# 🚀 PetCare+ Vercel 배포 가이드

## 📋 배포 전 체크리스트

### 1️⃣ 로컬 개발 환경 확인

```bash
git clone https://github.com/HeeJeonLee/petcare-plus-v2.git
cd petcare-plus-v2
npm install
cp .env.example .env.local
# API 키 입력
```

### 2️⃣ 로컬 테스트

```bash
npm run dev:full
# http://localhost:5174

# 확인할 기능:
# ✅ 페이지 로드 정상
# ✅ ChatBot 작동
# ✅ Google Maps 로드
# ✅ 상담 폼 이메일 발송
# ✅ 모든 섹션 네비게이션
```

### 3️⃣ 빌드 테스트

```bash
npm run build
npm run preview
# http://localhost:4173
```

---

## 🔑 Vercel 환경변수 설정

### Step 1: Vercel 대시보드 접속
https://vercel.com/dashboard

### Step 2: 프로젝트 생성
- Import Project → GitHub → petcare-plus-v2 선택

### Step 3: 환경변수 추가
**Settings → Environment Variables**

| 변수명 | 예시 |
|--------|------|
| VITE_ANTHROPIC_API_KEY | sk-ant-api03-... |
| VITE_GOOGLE_MAPS_API_KEY | AIzaSyA6... |
| RESEND_API_KEY | re_HDpES... |
| VITE_SUPABASE_URL | https://cpejxivb... |
| VITE_SUPABASE_ANON_KEY | eyJhbGc... |
| PETCARE_ADMIN_EMAIL | hejunl@hanmail.net |

**모든 환경에 추가:** Production, Preview, Development

### Step 4: 저장 및 재배포

```bash
git add -A
git commit -m "준비: Vercel 배포"
git push origin main
```

---

## 🔄 배포 프로세스

### 자동 배포 (권장)

```bash
git push origin main
# Vercel이 자동으로 빌드 & 배포
```

### 수동 배포

```bash
npm i -g vercel
vercel login
vercel --prod
```

---

## ✅ 배포 후 검증

### 1️⃣ 기본 기능
- ✅ 페이지 로드 (< 3초)
- ✅ 모바일 반응형
- ✅ 모든 섹션 네비게이션

### 2️⃣ AI 기능
- ✅ ChatBot 응답
- ✅ AI Recommendation 작동

### 3️⃣ 외부 API
- ✅ Google Maps 로드
- ✅ Email 발송

### 4️⃣ 성능
- Performance: 90+
- Accessibility: 90+
- Best Practices: 90+
- SEO: 100

### 5️⃣ 보안
- ✅ HTTPS
- ✅ API 키 환경변수화
- ✅ CORS 설정

---

## 🔧 문제 해결

### 🔴 페이지 안 열림

```bash
# 1. 로컬 빌드 테스트
npm run build

# 2. 에러 수정 후
git add -A
git commit -m "수정: 배포 오류"
git push origin main
```

### 🔴 이메일 안 옴

**확인:**
1. Vercel → Settings → Environment Variables
2. RESEND_API_KEY, PETCARE_ADMIN_EMAIL

**해결:**
- Resend 대시보드에서 API 키 재확인
- Environment Variables 재입력

### 🔴 Google Maps 안 보임

**확인:**
1. VITE_GOOGLE_MAPS_API_KEY
2. Google Cloud Console → Places API 활성화

**해결:**
- 새 API 키 생성
- Environment Variables 재입력

### 🔴 챗봇 응답 없음

**확인:**
1. VITE_ANTHROPIC_API_KEY
2. Anthropic Console → API 키 상태

**해결:**
- 새 키 발급
- Environment Variables 재입력

---

## 📊 모니터링

### Vercel 대시보드
- **Deployments**: 배포 이력
- **Function Logs**: API 오류
- **Analytics**: 트래픽

### 실시간 로그

```bash
vercel logs --follow
vercel logs --tail /api/send-email
```

---

## 🎯 최종 체크리스트

### 배포 전
- ✅ 로컬 테스트 완료
- ✅ 빌드 성공
- ✅ API 키 준비

### Vercel 설정
- ✅ GitHub 연동
- ✅ 환경변수 6개 입력
- ✅ Build Settings 확인

### 배포 후
- ✅ 배포 성공
- ✅ 페이지 로드 정상
- ✅ ChatBot 작동
- ✅ Google Maps 작동
- ✅ 이메일 발송
- ✅ 모바일 정상
- ✅ 성능 90+

---

## 📞 지원

**문제 발생 시:**
- 📧 hejunl@hanmail.net
- 📱 010-5650-0670
- GitHub Issues

---

**배포 완료! 🎉**

Made with ❤️ by HeeJeon Lee
