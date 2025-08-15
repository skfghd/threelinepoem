// Security utilities for API key protection and validation

/**
 * Security: API 키 검증 함수
 * 형식과 길이를 확인하여 유효하지 않은 키 사용을 방지
 */
export function validateApiKey(apiKey: string | undefined): string {
  if (!apiKey) {
    throw new Error("API key is required");
  }

  const trimmedKey = apiKey.trim();
  
  // 기본 형식 검증
  if (trimmedKey.length < 20) {
    throw new Error("API key too short");
  }

  // Gemini API 키 형식 검증 (AIza로 시작하는 39자리)
  if (!trimmedKey.startsWith('AIza') || trimmedKey.length !== 39) {
    throw new Error("Invalid Gemini API key format");
  }

  // 특수문자나 공백이 포함되어 있는지 확인
  if (!/^[A-Za-z0-9_-]+$/.test(trimmedKey)) {
    throw new Error("API key contains invalid characters");
  }

  return trimmedKey;
}

/**
 * Security: 에러 메시지에서 모든 민감한 정보 제거
 */
export function sanitizeErrorMessage(error: unknown): string {
  let message = '';
  
  if (typeof error === 'string') {
    message = error;
  } else if (error instanceof Error) {
    message = error.message;
  } else {
    return 'Unknown error occurred';
  }
  
  // 모든 형태의 API 키 패턴 제거
  return message
    .replace(/AIza[a-zA-Z0-9_-]*/g, '[API_KEY_REDACTED]')
    .replace(/sk-[a-zA-Z0-9]*/g, '[API_KEY_REDACTED]')
    .replace(/Bearer\s+[a-zA-Z0-9_-]+/g, 'Bearer [TOKEN_REDACTED]')
    .replace(/api[_-]?key[:\s=]+[a-zA-Z0-9_-]+/gi, 'api_key=[REDACTED]')
    .replace(/token[:\s=]+[a-zA-Z0-9_-]+/gi, 'token=[REDACTED]')
    .replace(/password[:\s=]+[^\s]+/gi, 'password=[REDACTED]')
    .replace(/secret[:\s=]+[^\s]+/gi, 'secret=[REDACTED]');
}

/**
 * Security: 요청 정화 함수
 * XSS 및 injection 공격 방지
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') {
    throw new Error('Input must be a string');
  }
  
  return input
    .trim()
    .replace(/[<>"'&]/g, '') // HTML/JS 특수문자 제거
    .replace(/\x00/g, '') // null byte 제거
    .slice(0, 100); // 최대 길이 제한
}

/**
 * Security: 메모리에서 민감한 데이터 완전 제거
 */
export function secureDelete(obj: any): void {
  if (typeof obj === 'object' && obj !== null) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (typeof obj[key] === 'string' && obj[key].length > 10) {
          // 문자열을 0으로 덮어쓰기
          obj[key] = '\0'.repeat(obj[key].length);
        }
        delete obj[key];
      }
    }
  }
}

/**
 * Security: 환경변수 검증 및 보안 확인
 */
export function validateEnvironment(): void {
  const requiredEnvVars = ['GEMINI_API_KEY'];
  const missingVars: string[] = [];
  
  requiredEnvVars.forEach(varName => {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  });
  
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }
  
  // API 키 형식 검증
  validateApiKey(process.env.GEMINI_API_KEY);
  
  console.log('Security: Environment validation completed successfully');
}