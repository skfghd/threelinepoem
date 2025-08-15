#!/bin/bash

# Firebase 배포 스크립트
echo "🚀 KindTool.ai Firebase 배포 시작..."

# 의존성 설치
echo "📦 의존성 설치 중..."
npm install
cd functions && npm install && cd ..

# 프론트엔드 빌드
echo "🏗️ 프론트엔드 빌드 중..."
npm run build:client

# Functions 빌드
echo "⚙️ Functions 빌드 중..."  
cd functions && npm run build && cd ..

# Firebase 배포
echo "🌍 Firebase 배포 중..."
firebase deploy

echo "✅ 배포 완료!"
echo "🌐 https://your-project-id.firebaseapp.com 에서 확인하세요."