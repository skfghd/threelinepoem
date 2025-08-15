# Firebase 배포 체크리스트

## ✅ 완료된 이전 작업

### 🏗️ 프로젝트 구조 재구성
- [x] Firebase Hosting 설정 (firebase.json)
- [x] Firebase Functions 디렉토리 구조 생성
- [x] Firestore 보안 규칙 및 인덱스 설정
- [x] TypeScript 설정 파일 생성

### 🔐 보안 시스템 이전
- [x] API 키 보안 강화 (지연 초기화, 메모리 보호)
- [x] 모든 민감 정보 에러 메시지 정화
- [x] Rate limiting 시스템
- [x] 입력 정화 및 검증
- [x] 환경 변수 검증

### 🤖 AI 서비스 이전
- [x] Google Gemini AI 통합
- [x] 4가지 분위기 모드 지원
- [x] Fallback 생성 시스템
- [x] 일일 사용량 제한 (125회)

### 💾 데이터베이스 이전
- [x] PostgreSQL → Firestore 마이그레이션
- [x] 일일 사용량 추적
- [x] 문의 게시판 시스템
- [x] 보안 규칙 설정

### 🎨 프론트엔드 최적화
- [x] API 엔드포인트 Firebase Functions 연결
- [x] 빌드 설정 Firebase 호환성 확보
- [x] 정적 자산 최적화

## 🚀 배포 준비사항

### 1. Firebase 프로젝트 설정 (필수)
```bash
# Firebase CLI 설치
npm install -g firebase-tools

# Firebase 로그인
firebase login

# 프로젝트 생성 및 ID 설정
# .firebaserc 파일에서 "your-firebase-project-id" 교체 필요
```

### 2. Firebase 설정 업데이트 (필수)
`client/src/lib/firebase-client.ts` 파일에서:
- Firebase 설정을 실제 프로젝트 값으로 교체
- API 키, 프로젝트 ID 등 실제 값 입력

### 3. 환경 변수 설정 (필수)
```bash
# Gemini API 키 설정
firebase functions:config:set gemini.api_key="실제-gemini-api-키"
```

### 4. 서비스 활성화 (필수)
Firebase Console에서:
- [x] Firestore Database (프로덕션 모드)
- [x] Firebase Functions
- [x] Firebase Hosting
- [x] Firebase Authentication (선택사항)

## 🏃‍♂️ 배포 실행

### 한 번에 배포
```bash
# 배포 스크립트 실행
./deploy.sh
```

### 단계별 배포
```bash
# 1. 의존성 설치
npm install
cd functions && npm install && cd ..

# 2. 빌드
npm run build:client
cd functions && npm run build && cd ..

# 3. 배포
firebase deploy
```

## 🔍 배포 후 확인사항

### 기능 테스트
- [ ] 삼행시 생성 (AI 모드)
- [ ] 삼행시 생성 (Fallback 모드)  
- [ ] 일일 사용량 통계 표시
- [ ] 문의 게시판 작성/조회
- [ ] 4가지 분위기 모드 테스트

### 성능 확인
- [ ] 페이지 로딩 속도
- [ ] API 응답 시간
- [ ] CDN 캐싱 확인

### 보안 검증
- [ ] API 키 노출 여부 확인
- [ ] Rate limiting 동작 확인
- [ ] Firestore 보안 규칙 테스트

## 📁 패키지 내용

압축 파일 `kindtool-firebase-deployment.zip` 포함사항:
- Firebase 설정 파일들 (firebase.json, .firebaserc, etc.)
- Functions 소스코드 (TypeScript)
- React 프론트엔드 소스코드
- 보안 규칙 및 인덱스
- 배포 스크립트 및 문서
- 에셋 파일들

## 🆘 문제 해결

### Functions 배포 실패
1. Node.js 버전 확인 (Functions는 Node 20 사용)
2. 환경 변수 설정 확인
3. Firebase CLI 권한 확인

### Firestore 접근 오류
1. 보안 규칙 검토
2. 인덱스 생성 확인
3. 프로젝트 권한 확인

### API 연결 오류
1. Firebase Functions URL 확인
2. CORS 설정 검토
3. API 키 설정 확인

## 📞 지원

배포 중 문제 발생 시 skfghd@naver.com으로 문의