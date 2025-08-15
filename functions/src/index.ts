// Firebase Functions main entry point
import * as functions from 'firebase-functions/v1';
import * as admin from 'firebase-admin';
import express from 'express';
import cors from 'cors';
import { z } from 'zod';

// Initialize Firebase Admin SDK
admin.initializeApp();

// Import our modules
import { generateAcrosticPoem } from './gemini';
import { generateFallbackPoem, getFallbackMessage } from './fallback-generator';
import { 
  getTodayUsage, 
  incrementAIUsage, 
  canUseAI, 
  getUsageStats,
  createInquiry,
  getInquiries,
  getInquiry 
} from './firestore';
import { 
  validateEnvironment, 
  sanitizeErrorMessage, 
  sanitizeInput, 
  secureDelete 
} from './security';

// Validate environment on startup
try {
  validateEnvironment();
} catch (error) {
  console.error('Security validation failed:', sanitizeErrorMessage(error));
  process.exit(1);
}

// Create Express app
const app = express();

// CORS configuration
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Security headers middleware
app.use((req, res, next) => {
  res.set({
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Referrer-Policy': 'strict-origin-when-cross-origin'
  });
  next();
});

// Rate limiting (simple in-memory store for demo)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10; // requests per minute
const RATE_WINDOW = 60 * 1000; // 1 minute

function rateLimit(req: express.Request, res: express.Response, next: express.NextFunction) {
  const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
  const now = Date.now();
  const windowStart = now - RATE_WINDOW;

  // Clean old entries
  for (const [ip, data] of rateLimitMap.entries()) {
    if (data.resetTime < windowStart) {
      rateLimitMap.delete(ip);
    }
  }

  const clientData = rateLimitMap.get(clientIP);
  if (!clientData) {
    rateLimitMap.set(clientIP, { count: 1, resetTime: now });
    return next();
  }

  if (clientData.resetTime < windowStart) {
    rateLimitMap.set(clientIP, { count: 1, resetTime: now });
    return next();
  }

  if (clientData.count >= RATE_LIMIT) {
    return res.status(429).json({ 
      error: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.' 
    });
  }

  clientData.count++;
  next();
}

app.use(rateLimit);

// Validation schemas
const PoemRequestSchema = z.object({
  inputWord: z.string().min(2).max(5).regex(/^[가-힣]+$/, "한글만 입력 가능합니다"),
  mood: z.enum(['funny', 'warm', 'creative', 'poetic'])
});

const InquirySchema = z.object({
  name: z.string().min(1).max(50),
  email: z.string().email(),
  category: z.string().min(1).max(20),
  title: z.string().min(1).max(100),
  content: z.string().min(1).max(1000),
  isPrivate: z.boolean()
});

// Routes
app.post('/poems', async (req, res) => {
  try {
    // Validate request
    const { inputWord, mood } = PoemRequestSchema.parse(req.body);
    
    // Security: Input sanitization
    const sanitizedWord = sanitizeInput(inputWord);
    const sanitizedMood = sanitizeInput(mood);
    
    let lines: string[] = [];
    let usedAI = false;
    let fallbackMessage: string | undefined;
    
    // Check if AI can be used (within daily limit)
    if (await canUseAI()) {
      try {
        // Try AI generation first
        lines = await generateAcrosticPoem(sanitizedWord, sanitizedMood);
        await incrementAIUsage();
        usedAI = true;
      } catch (error) {
        // AI failed, use fallback
        console.error("AI generation failed, using fallback:", error);
        lines = generateFallbackPoem(sanitizedWord, mood as any);
        fallbackMessage = "AI 생성 중 오류가 발생하여 규칙 기반 삼행시로 제공됩니다 😊";
      }
    } else {
      // Use fallback generation
      lines = generateFallbackPoem(sanitizedWord, mood as any);
      fallbackMessage = getFallbackMessage(mood as any);
    }
    
    // Return poem directly (no storage for privacy)
    const poem = {
      inputWord: sanitizedWord,
      mood: sanitizedMood,
      lines,
      createdAt: new Date(),
      usedAI,
      fallbackMessage
    };

    res.json(poem);
  } catch (error) {
    const sanitizedError = sanitizeErrorMessage(error);
    console.error("Error generating poem:", sanitizedError);
    
    // Security: Memory cleanup on error
    secureDelete(req.body);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: "입력값이 올바르지 않습니다.",
        details: error.errors.map(e => e.message)
      });
    }
    
    res.status(500).json({ 
      error: "삼행시 생성 중 오류가 발생했습니다." 
    });
  }
});

app.get('/poems', async (req, res) => {
  // Return empty for privacy (no storage)
  res.json([]);
});

app.get('/usage-stats', async (req, res) => {
  try {
    const stats = await getUsageStats();
    res.json(stats);
  } catch (error) {
    const sanitizedError = sanitizeErrorMessage(error);
    console.error("Error getting usage stats:", sanitizedError);
    res.status(500).json({ 
      error: "사용량 통계를 가져오는 중 오류가 발생했습니다." 
    });
  }
});

// Inquiry routes
app.post('/inquiries', async (req, res) => {
  try {
    const inquiryData = InquirySchema.parse(req.body);
    const id = await createInquiry(inquiryData);
    res.status(201).json({ id, message: "문의가 성공적으로 등록되었습니다." });
  } catch (error) {
    const sanitizedError = sanitizeErrorMessage(error);
    console.error("Error creating inquiry:", sanitizedError);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: "입력값이 올바르지 않습니다.",
        details: error.errors.map(e => e.message)
      });
    }
    
    res.status(500).json({ 
      error: "문의 등록 중 오류가 발생했습니다." 
    });
  }
});

app.get('/inquiries', async (req, res) => {
  try {
    const inquiries = await getInquiries();
    res.json(inquiries);
  } catch (error) {
    const sanitizedError = sanitizeErrorMessage(error);
    console.error("Error getting inquiries:", sanitizedError);
    res.status(500).json({ 
      error: "문의 목록을 가져오는 중 오류가 발생했습니다." 
    });
  }
});

app.get('/inquiries/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const inquiry = await getInquiry(id);
    
    if (!inquiry) {
      return res.status(404).json({ error: "문의를 찾을 수 없습니다." });
    }
    
    res.json(inquiry);
  } catch (error) {
    const sanitizedError = sanitizeErrorMessage(error);
    console.error("Error getting inquiry:", sanitizedError);
    res.status(500).json({ 
      error: "문의를 가져오는 중 오류가 발생했습니다." 
    });
  }
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  const sanitizedError = sanitizeErrorMessage(err.message || "Internal Server Error");
  console.error('Unhandled error:', sanitizedError);
  
  res.status(500).json({ 
    error: "서버 오류가 발생했습니다." 
  });
});

// Export the Firebase Function
export const api = functions
  .region('asia-northeast1') // Seoul region for better performance
  .runWith({
    timeoutSeconds: 540,
    memory: '512MB'
  })
  .https
  .onRequest(app);