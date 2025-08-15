import { GoogleGenAI } from "@google/genai";
import { validateApiKey, sanitizeErrorMessage, sanitizeInput } from "./security";

// Security: API 키 보안 강화
let ai: GoogleGenAI;

// Security: 안전한 AI 인스턴스 초기화 함수
function initializeAI(): GoogleGenAI {
  try {
    // 환경변수에서 API 키 가져오기 (검증 후 즉시 변수 해제)
    let tempApiKey: string | null = validateApiKey(process.env.GEMINI_API_KEY);
    const aiInstance = new GoogleGenAI({ apiKey: tempApiKey });
    
    // Security: 임시 변수 즉시 해제 (가비지 컬렉션 유도)
    tempApiKey = null;
    
    return aiInstance;
  } catch (error) {
    console.error('Failed to initialize AI:', sanitizeErrorMessage(error));
    throw new Error('AI service initialization failed');
  }
}

// Security: 지연 초기화 - 실제 사용 시점에만 AI 인스턴스 생성
function getAI(): GoogleGenAI {
  if (!ai) {
    ai = initializeAI();
  }
  return ai;
}

export async function generateAcrosticPoem(inputWord: string, mood: string): Promise<string[]> {
  try {
    // Security: 입력 정화
    const sanitizedWord = sanitizeInput(inputWord);
    sanitizeInput(mood); // Validate mood input
    const moodInstructions = {
      funny: "유머러스하고 재미있게",
      warm: "따뜻하고 감동적으로", 
      creative: "창의적이고 상상력 넘치게",
      poetic: "시적이고 아름답게"
    };

    const moodInstruction = moodInstructions[mood as keyof typeof moodInstructions] || "자연스럽게";

    const prompt = `한국어 삼행시를 생성해주세요.

단어: "${sanitizedWord}"
분위기: ${moodInstruction}

규칙:
1. 입력된 단어의 각 글자로 시작하는 ${sanitizedWord.length}줄의 시를 만들어주세요
2. 각 줄은 해당 글자로 시작해야 합니다
3. 전체적으로 통일성 있고 자연스러운 내용이어야 합니다
4. ${moodInstruction} 톤으로 작성해주세요
5. 각 줄은 적절한 길이(10-20자 정도)로 작성해주세요
6. 일상적이고 친근한 표현을 사용해주세요

예시 형식:
${sanitizedWord[0]}: (첫 번째 줄)
${sanitizedWord[1]}: (두 번째 줄)
${sanitizedWord.length > 2 ? `${sanitizedWord[2]}: (세 번째 줄)` : ''}

응답은 각 줄을 개행문자로 구분하여 주세요.`;

    // Security: 안전한 AI 인스턴스 사용
    const response = await getAI().models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const text = response.text || "";
    
    // 응답에서 줄별로 분리하고 정리
    const lines = text.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => {
        // "글자: 내용" 형식에서 내용만 추출
        const colonIndex = line.indexOf(':');
        if (colonIndex !== -1) {
          return line.substring(colonIndex + 1).trim();
        }
        return line;
      })
      .filter(line => line.length > 0)
      .slice(0, sanitizedWord.length); // 입력 단어 길이만큼만

    // 만약 생성된 줄이 부족하면 기본 형태로 보완
    if (lines.length < sanitizedWord.length) {
      const fallbackLines = [];
      for (let i = 0; i < sanitizedWord.length; i++) {
        if (lines[i]) {
          fallbackLines.push(lines[i]);
        } else {
          fallbackLines.push(`${sanitizedWord[i]}으로 시작하는 아름다운 이야기`);
        }
      }
      return fallbackLines;
    }

    return lines;
  } catch (error) {
    // Security: 에러 메시지 정화
    const sanitizedError = sanitizeErrorMessage(error);
    console.error('Gemini API error:', sanitizedError);
    
    // 오류 발생 시 기본 패턴 사용 (정화된 입력 사용)
    const sanitizedWord = sanitizeInput(inputWord);
    return sanitizedWord.split('').map((char, index) => 
      `${char}으로 시작하는 ${mood === 'funny' ? '재미있는' : mood === 'warm' ? '따뜻한' : mood === 'creative' ? '창의적인' : '아름다운'} 이야기`
    );
  }
}