# 🚀 Firebase 배포 가이드

## ✅ 포함된 파일 확인

이 zip 파일에는 Firebase 배포에 필요한 모든 파일이 포함되어 있습니다:

### 핵심 Firebase 설정
- `firebase.json` - Firebase 프로젝트 설정
- `.firebaserc` - Firebase 프로젝트 ID 설정
- `firestore.rules` - 데이터베이스 보안 규칙
- `firestore.indexes.json` - 데이터베이스 인덱스

### Functions (서버사이드)
- `functions/src/index.ts` - 메인 API 엔드포인트
- `functions/src/gemini.ts` - Google Gemini AI 통합
- `functions/src/firestore.ts` - 데이터베이스 연산
- `functions/src/security.ts` - 보안 유틸리티
- `functions/package.json` - Dependencies
- `functions/.env.example` - 환경변수 예시

### 프론트엔드
- `public/index.html` - 메인 HTML 템플릿
- `client/src/` - React 앱 소스코드
- `vite.firebase.config.ts` - Vite 빌드 설정

### 배포 스크립트 및 문서
- `deploy.sh` - 원클릭 배포 스크립트
- `firebase-package.json` - 프로젝트 package.json
- `README-FIREBASE.md` - 상세 가이드
- `DEPLOYMENT-CHECKLIST.md` - 배포 체크리스트

## 🚀 3단계 배포 프로세스

### 1단계: Firebase 프로젝트 설정
```bash
# Firebase CLI 설치
npm install -g firebase-tools

# Firebase 로그인
firebase login

# .firebaserc 파일 수정
# "your-firebase-project-id"를 실제 프로젝트 ID로 변경
```

### 2단계: 환경변수 설정
```bash
# Gemini API 키 설정
firebase functions:config:set gemini.api_key="실제-API-키"

# client/src/lib/firebase-client.ts 파일에서
# Firebase 설정을 실제 프로젝트 값으로 변경
```

### 3단계: 배포 실행
```bash
# 의존성 설치 및 배포
chmod +x deploy.sh
./deploy.sh
```

## ✅ 배포 완료 확인

배포 성공 후 확인사항:
- [ ] https://프로젝트ID.firebaseapp.com 접속 확인
- [ ] 삼행시 생성 기능 테스트
- [ ] 일일 사용량 통계 표시 확인
- [ ] Firebase Console에서 Functions 로그 확인

## 🔧 문제 해결

### Functions 배포 오류
- Node.js 20 버전 확인
- 환경변수 설정 재확인
- Firebase 권한 검토

### 빌드 오류
- 의존성 재설치: `npm install && cd functions && npm install`
- 캐시 클리어: `firebase functions:config:get`

### 접속 오류
- Firebase Hosting 활성화 확인
- 도메인 설정 검토
- CORS 설정 확인

## 📞 지원
기술 지원: skfghd@naver.com