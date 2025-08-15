# KindTool.ai Korean Acrostic Poem Generator - Firebase Edition

## 프로젝트 구조

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components  
│   │   ├── pages/         # Page components
│   │   ├── lib/           # Utility libraries
│   │   └── hooks/         # Custom React hooks
│   └── public/            # Static assets
├── functions/             # Firebase Functions (API backend)
│   ├── src/
│   │   ├── index.ts       # Main Functions entry point
│   │   ├── gemini.ts      # Google Gemini AI integration
│   │   ├── firestore.ts   # Firestore database operations
│   │   ├── security.ts    # Security utilities
│   │   ├── fallback-generator.ts # Fallback poem generation
│   │   └── types.ts       # TypeScript type definitions
│   ├── package.json       # Functions dependencies
│   └── tsconfig.json      # TypeScript configuration
├── firebase.json          # Firebase configuration
├── firestore.rules       # Firestore security rules
├── firestore.indexes.json # Firestore indexes
└── .firebaserc           # Firebase project settings
```

## 설정 방법

### 1. Firebase 프로젝트 생성
1. [Firebase Console](https://console.firebase.google.com/)에서 새 프로젝트 생성
2. Firestore Database 활성화 (프로덕션 모드)
3. Firebase Functions 활성화

### 2. Firebase CLI 설치 및 로그인
```bash
npm install -g firebase-tools
firebase login
```

### 3. Firebase 프로젝트 설정
```bash
# .firebaserc 파일에서 프로젝트 ID 설정
{
  "projects": {
    "default": "your-firebase-project-id"
  }
}
```

### 4. Firebase 설정 업데이트
`client/src/lib/firebase-client.ts` 파일에서 Firebase 설정을 실제 프로젝트 설정으로 업데이트:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com", 
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

### 5. 환경 변수 설정
Firebase Functions에서 Gemini API 키 설정:

```bash
firebase functions:config:set gemini.api_key="your-gemini-api-key"
```

## 빌드 및 배포

### 로컬 개발
```bash
# 의존성 설치
npm install
cd functions && npm install && cd ..

# 로컬 에뮬레이터 실행
firebase emulators:start
```

### 프로덕션 배포
```bash
# 전체 빌드 및 배포
npm run build
firebase deploy

# 또는 개별 배포
firebase deploy --only hosting    # 프론트엔드만
firebase deploy --only functions  # 백엔드만  
firebase deploy --only firestore  # 데이터베이스 규칙만
```

## 보안 기능

### API 키 보안
- Firebase Functions 환경 변수로 안전하게 저장
- 지연 초기화로 메모리 노출 최소화
- 모든 에러 메시지에서 민감 정보 제거

### 데이터베이스 보안
- Firestore 보안 규칙로 읽기/쓰기 제한
- Functions에서만 데이터베이스 접근 가능
- 클라이언트에서 직접 데이터베이스 접근 차단

### Rate Limiting
- IP 기반 요청 제한 (분당 10회)
- 일일 AI 사용량 제한 (125회)
- 자동 메모리 정리

## 주요 기능

### 삼행시 생성
- Google Gemini AI를 사용한 고품질 한국어 삼행시 생성
- 4가지 분위기 모드 (재미있게, 따뜻하게, 창의적으로, 시적으로)
- AI 실패 시 규칙 기반 fallback 시스템

### 사용량 추적
- 일일 AI 사용량 실시간 모니터링
- 오전 5시 KST 기준 일일 리셋
- 관리자 대시보드

### 문의 시스템
- Firestore 기반 문의 게시판
- 공개/비공개 문의 지원
- 상태 관리 (대기중/해결됨)

## Firebase 특징

### Hosting
- CDN을 통한 빠른 정적 파일 서빙
- 자동 HTTPS 적용
- 커스텀 도메인 지원

### Functions
- 서버리스 백엔드
- 자동 스케일링
- 서울 리전 (asia-northeast1) 배포

### Firestore
- NoSQL 실시간 데이터베이스
- 자동 백업 및 복구
- 강력한 보안 규칙

## 모니터링

Firebase Console에서 다음을 모니터링할 수 있습니다:
- Functions 실행 로그 및 성능
- Firestore 읽기/쓰기 사용량
- Hosting 트래픽 통계
- 에러 추적 및 알림

## 비용 최적화

- Functions 실행 시간 최소화
- Firestore 읽기/쓰기 최적화
- 불필요한 데이터 저장 방지 (프라이버시 중심)
- 적절한 캐싱 헤더 설정

## 백업 및 복구

Firestore 데이터는 자동으로 백업되며, Firebase Console에서 수동 내보내기도 가능합니다.

## 지원

문제가 발생한 경우 Firebase Console의 로그를 확인하거나 skfghd@naver.com으로 문의해주세요.