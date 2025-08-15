// Firestore database operations  
import * as admin from 'firebase-admin';
import { DailyUsage, UsageStats, Inquiry } from './types';

const db = admin.firestore();

// Daily usage tracking functions
export async function getTodayUsage(): Promise<DailyUsage> {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const docRef = db.collection('daily_usage').doc(today);
  
  try {
    const doc = await docRef.get();
    
    if (!doc.exists) {
      // Create new usage record for today
      const newUsage: DailyUsage = {
        date: today,
        count: 0,
        limit: 125,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      await docRef.set({
        ...newUsage,
        createdAt: admin.firestore.Timestamp.fromDate(newUsage.createdAt),
        updatedAt: admin.firestore.Timestamp.fromDate(newUsage.updatedAt)
      });
      
      return newUsage;
    }
    
    const data = doc.data();
    return {
      date: data!.date,
      count: data!.count,
      limit: data!.limit,
      createdAt: data!.createdAt.toDate(),
      updatedAt: data!.updatedAt.toDate()
    };
  } catch (error) {
    console.error('Error getting today usage:', error);
    // Return default values on error
    return {
      date: today,
      count: 0,
      limit: 125,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }
}

export async function incrementAIUsage(): Promise<void> {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const docRef = db.collection('daily_usage').doc(today);
  
  try {
    await db.runTransaction(async (transaction: admin.firestore.Transaction) => {
      const doc = await transaction.get(docRef);
      
      if (!doc.exists) {
        // Create new usage record
        transaction.set(docRef, {
          date: today,
          count: 1,
          limit: 125,
          createdAt: admin.firestore.Timestamp.now(),
          updatedAt: admin.firestore.Timestamp.now()
        });
      } else {
        // Increment existing count
        const currentCount = doc.data()!.count || 0;
        transaction.update(docRef, {
          count: currentCount + 1,
          updatedAt: admin.firestore.Timestamp.now()
        });
      }
    });
  } catch (error) {
    console.error('Error incrementing AI usage:', error);
    throw error;
  }
}

export async function canUseAI(): Promise<boolean> {
  try {
    const usage = await getTodayUsage();
    return usage.count < usage.limit;
  } catch (error) {
    console.error('Error checking AI usage limit:', error);
    return false; // Fail-safe: don't allow AI usage if we can't verify
  }
}

export async function getUsageStats(): Promise<UsageStats> {
  try {
    const usage = await getTodayUsage();
    
    // Calculate reset time (5 AM KST next day)
    const now = new Date();
    const kstOffset = 9 * 60; // KST is UTC+9
    const kstNow = new Date(now.getTime() + kstOffset * 60000);
    
    const resetDate = new Date(kstNow);
    if (kstNow.getHours() >= 5) {
      resetDate.setDate(resetDate.getDate() + 1);
    }
    resetDate.setHours(5, 0, 0, 0);
    
    // Convert back to UTC for consistency
    const resetTime = new Date(resetDate.getTime() - kstOffset * 60000);
    
    return {
      current: usage.count,
      limit: usage.limit,
      remaining: Math.max(0, usage.limit - usage.count),
      resetTime: resetTime.toISOString()
    };
  } catch (error) {
    console.error('Error getting usage stats:', error);
    return {
      current: 0,
      limit: 125,
      remaining: 125,
      resetTime: new Date().toISOString()
    };
  }
}

// Inquiry functions
export async function createInquiry(inquiry: Omit<Inquiry, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  try {
    const docRef = await db.collection('inquiries').add({
      ...inquiry,
      status: 'pending',
      createdAt: admin.firestore.Timestamp.now(),
      updatedAt: admin.firestore.Timestamp.now()
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error creating inquiry:', error);
    throw error;
  }
}

export async function getInquiries(): Promise<Inquiry[]> {
  try {
    const snapshot = await db.collection('inquiries')
      .orderBy('createdAt', 'desc')
      .get();
    
    return snapshot.docs.map((doc: admin.firestore.QueryDocumentSnapshot) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate()
    } as Inquiry));
  } catch (error) {
    console.error('Error getting inquiries:', error);
    return [];
  }
}

export async function getInquiry(id: string): Promise<Inquiry | null> {
  try {
    const doc = await db.collection('inquiries').doc(id).get();
    
    if (!doc.exists) {
      return null;
    }
    
    const data = doc.data()!;
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate()
    } as Inquiry;
  } catch (error) {
    console.error('Error getting inquiry:', error);
    return null;
  }
}