// Fallback poem generator for when AI is unavailable
import { MoodType } from './types';

const fallbackPatterns = {
  funny: [
    "이런 날엔 웃음만 나와",
    "온 세상이 재미있어 보여",
    "유쾌한 하루가 시작돼",
    "엄청 신나는 기분이야",
    "어디서든 웃음소리가"
  ],
  warm: [
    "이른 아침 따스한 햇살이",
    "온 마음을 포근하게 감싸",
    "언제나 행복한 추억들",
    "엄마의 사랑처럼 따뜻해",
    "어깨 위에 내려앉는 평화"
  ],
  creative: [
    "이상한 나라 앨리스처럼",
    "온갖 상상이 펼쳐져",
    "유니콘이 뛰어노는 들판",
    "엄청난 모험이 기다려",
    "어떤 꿈도 이룰 수 있어"
  ],
  poetic: [
    "이슬 맺힌 꽃잎처럼 곱고",
    "온 세상에 향기를 퍼뜨려",
    "유월의 바람결에 실려",
    "엄숙한 아름다움으로",
    "어둠 속에서도 빛나는"
  ]
};

export function generateFallbackPoem(word: string, mood: MoodType): string[] {
  const patterns = fallbackPatterns[mood] || fallbackPatterns.warm;
  const chars = word.split('');
  
  return chars.map((char, index) => {
    const patternIndex = index % patterns.length;
    const pattern = patterns[patternIndex];
    
    // 첫 글자를 입력 문자로 교체
    const words = pattern.split(' ');
    if (words.length > 0) {
      words[0] = char + words[0].substring(1);
    }
    
    return words.join(' ');
  });
}

export function getFallbackMessage(mood: MoodType): string {
  const messages = {
    funny: "AI 서비스가 일시 중단되어 기본 패턴으로 재미있는 삼행시를 만들어드렸어요! 😄",
    warm: "AI 서비스가 일시 중단되어 기본 패턴으로 따뜻한 삼행시를 만들어드렸어요! 🤗",
    creative: "AI 서비스가 일시 중단되어 기본 패턴으로 창의적인 삼행시를 만들어드렸어요! ✨",
    poetic: "AI 서비스가 일시 중단되어 기본 패턴으로 시적인 삼행시를 만들어드렸어요! 🌸"
  };
  
  return messages[mood] || messages.warm;
}