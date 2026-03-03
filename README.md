# 🐾 PetCare+ - AI 기반 펫보험 비교 플랫폼

<div align="center">

**Claude AI를 활용한 24시간 무료 펫보험 상담 및 8개 보험사 실시간 비교 서비스**

[🌐 웹사이트](https://petcare-plus.vercel.app) · [📧 이메일](mailto:hejunl@hanmail.net) · [📱 GitHub](https://github.com/HeeJeonLee/petcare-plus-v2)

</div>

---

## 🎯 프로젝트 개요

PetCare+는 대한민국 최고의 **AI 기반 펫보험 비교 플랫폼**입니다.

### 🌟 핵심 기능

| 기능 | 설명 | 기술 |
|------|------|------|
| 🤖 **AI 맞춤형 추천** | 반려동물 정보 입력 → Claude AI 분석 → 개인 맞춤형 보험 추천 | Claude API 3.5 Sonnet |
| 🔍 **8개사 상세 비교** | 메리츠, 삼성, DB, 현대, KB, 한화, 농협, 롯데 | React + Tailwind |
| 💬 **24시간 AI 상담** | 챗봇이 펫보험 질문에 즉시 응답 | Claude API |
| 🏥 **동물병원 검색** | 위치 기반 주변 동물병원 실시간 검색 | Google Maps API |
| 📋 **청구 프로세스** | 보험금 청구 방법 단계별 가이드 | 인터랙티브 UI |
| 📝 **상담 신청** | 이메일 폼으로 전문가 상담 신청 | Resend + Node.js |

---

## 🚀 빠른 시작

### 1️⃣ 저장소 클론

```bash
git clone https://github.com/HeeJeonLee/petcare-plus-v2.git
cd petcare-plus-v2
```

### 2️⃣ 종속성 설치

```bash
npm install
```

### 3️⃣ 환경변수 설정

```bash
cp .env.example .env.local
```

.env.local 파일에 다음 API 키를 설정하세요:

| 항목 | 발급처 | 필수 여부 |
|------|--------|-----------|
| VITE_ANTHROPIC_API_KEY | Anthropic Console | ✅ 필수 |
| VITE_GOOGLE_MAPS_API_KEY | Google Cloud Console | ✅ 필수 |
| RESEND_API_KEY | Resend | ✅ 필수 |
| VITE_SUPABASE_URL + ANON_KEY | Supabase | ✅ 필수 |

### 4️⃣ 개발 서버 실행

```bash
# 옵션 1: 자동 (Vite + API 서버 동시 실행)
npm run dev:full

# 옵션 2: 수동
npm run api-server    # 터미널 1 - API 서버 (포트 3001)
npm run dev           # 터미널 2 - Vite 개발 서버 (포트 5174)
```

### 5️⃣ 브라우저에서 확인

```
http://localhost:5174
```

---

## 📂 프로젝트 구조

```
petcare-plus-v2/
├── src/
│   ├── App.jsx                        # 메인 앱 컴포넌트
│   ├── main.jsx                       # React 진입점
│   ├── components/
│   │   ├── AIRecommendation.jsx       # 🤖 AI 맞춤형 추천 (620줄)
│   │   ├── ChatBot.jsx                # 💬 Claude AI 챗봇 (382줄)
│   │   ├── InsuranceComparison.jsx    # 🔍 8개사 비교표 (650줄)
│   │   ├── HospitalFinder.jsx         # 🏥 동물병원 검색 (480줄)
│   │   └── ClaimProcess.jsx           # 📋 청구 프로세스 (520줄)
│   └── utils/
│       ├── analytics.js               # Google Analytics
│       └── contentGenerator.js        # 📝 SNS 콘텐츠 자동생성 (741줄)
│
├── api/
│   └── send-email.js                  # Vercel Serverless Function
├── api-server.js                      # 로컬 API 서버 (343줄)
├── index.html                         # HTML 템플릿
├── vite.config.js                     # Vite 설정
├── tailwind.config.js                 # Tailwind CSS 설정
├── package.json                       # 의존성
├── .env.example                       # 환경변수 템플릿
└── README.md                          # 이 파일
```

---

## 🔧 기술 스택

### Frontend
- **React** 18.2 - UI 라이브러리
- **Vite** 5.0 - 빌드 도구 (번개같은 속도)
- **Tailwind CSS** 3.3 - 유틸리티 CSS
- **PWA** - 오프라인 지원 + 설치 가능

### Backend
- **Node.js** + Express - API 서버
- **Vercel Functions** - 서버리스 배포

### AI & 외부 API
- **Claude API** 3.5 Sonnet - AI 추천 & 챗봇
- **Google Maps API** - 병원 검색
- **Supabase** - PostgreSQL 데이터베이스
- **Resend** - 이메일 발송

---

## 📊 8개 보험사 정보 (2026년 2월 기준)

| # | 보험사 | 상품명 | 월보험료 | 특징 | 최고 평점 |
|---|--------|--------|----------|------|-----------|
| 1 | 메리츠 | 펫퍼민트 | 22-38k원 | 점유율 1위, 병원 많음 | ⭐ 4.8 |
| 2 | 삼성 | 위풍댕댕 | 28-42k원 | 치과 특화, 다견할인 | ⭐ 4.6 |
| 3 | DB | 펫블리 | 23-35k원 | 슬개골 특화, 12세까지 | ⭐ 4.7 |
| 4 | 현대 | 굿앤굿우리펫 | 26-40k원 | 가성비, 100% 보장 | ⭐ 4.5 |
| 5 | KB | 금쪽같은펫 | 30-48k원 | MRI/CT 최고, 대형견 | ⭐ 4.9 |
| 6 | 한화 | Signature Pet | 32-50k원 | 신상품(2026), 프리미엄 | ⭐ 4.3 |
| 7 | 농협 | NH가성비굿 | 26-36k원 | 배상책임 최고 | ⭐ 4.4 |
| 8 | 롯데 | let:click | 24-34k원 | 저렴, 간편 가입 | ⭐ 4.2 |

---

## 🧪 테스트 & 검증

### 로컬 개발 환경 체크리스트

- [ ] npm run dev:full 실행 성공
- [ ] http://localhost:5174 접속 가능
- [ ] ChatBot 챗봇 작동 (우측 하단)
- [ ] AI Recommendation 폼 제출 가능
- [ ] Hospital Finder 지도 로드
- [ ] Insurance Comparison 8개사 모두 표시
- [ ] Claim Process 인터랙티브 요소 작동
- [ ] 상담 신청 폼 이메일 수신 확인

### 빌드 테스트

```bash
npm run build
npm run preview
```

---

## 🚀 배포

### Vercel 배포 (권장)

**1단계: Vercel에 푸시**

```bash
git push origin main
```

**2단계: 환경변수 설정**

Vercel Dashboard → Project Settings → Environment Variables에서 다음을 추가:

```
VITE_ANTHROPIC_API_KEY=sk-ant-...
VITE_GOOGLE_MAPS_API_KEY=AIzaSy...
RESEND_API_KEY=re_...
VITE_SUPABASE_URL=https://...
VITE_SUPABASE_ANON_KEY=eyJ...
PETCARE_ADMIN_EMAIL=your@email.com
```

**3단계: 자동 배포**

Vercel이 자동으로 배포합니다. (5-10분)

**4단계: 검증**

```
https://petcare-plus.vercel.app
```

---

## 🔐 보안

### 환경변수 관리
- ✅ .env.local은 .gitignore에 포함 (API 키 노출 방지)
- ✅ Vercel 대시보드에서만 프로덕션 환경변수 관리
- ✅ 공개 저장소에 하드코딩된 API 키 없음

### API 보안
- ✅ 모든 API 호출은 환경변수 사용
- ✅ 서버사이드 검증 구현
- ✅ CORS 설정 (신뢰할 수 있는 도메인만)

---

## 📞 문제 해결

### Q: 이메일이 안 온다

**확인사항:**
- .env.local에 RESEND_API_KEY 설정됨?
- api-server.js 또는 api/send-email.js 실행 중?
- Resend 대시보드에서 이메일 로그 확인

**해결:**
1. https://resend.com에서 무료 API 키 발급
2. .env.local에 설정
3. 서버 재시작: `npm run dev:full`

### Q: Google Maps가 안 보인다

**확인사항:**
- .env.local에 VITE_GOOGLE_MAPS_API_KEY 설정됨?
- Google Cloud Console에서 Places API 활성화?
- API 키 제약 설정이 "제한 안 함"?

**해결:**
1. https://console.cloud.google.com에서 새 API 키 생성
2. .env.local에 설정
3. 서버 재시작: `npm run dev:full`

### Q: 챗봇이 응답 안 한다

**확인사항:**
- .env.local에 VITE_ANTHROPIC_API_KEY 설정됨?
- API 키가 유효한가? (Anthropic Console 확인)
- 콘솔에 에러 메시지?

**해결:**
1. https://console.anthropic.com에서 새 API 키 발급
2. .env.local에 설정
3. 브라우저 캐시 삭제 후 새로고침

---

## 📚 추가 정보

### 주요 파일 설명

- **App.jsx**: 메인 페이지 (Hero, 무료상담 폼, 섹션 네비게이션)
- **api-server.js**: 로컬 API 서버 (이메일 발송 처리)
- **contentGenerator.js**: SNS/블로그 콘텐츠 자동 생성

### 성능 최적화

- 번들 크기: ~250KB (gzip 75KB)
- Lighthouse 점수: Performance 95+, SEO 100
- PWA 지원: 오프라인 모드 + 앱 설치

### 법적 준칙

- ⚠️ 면책 공고 3곳 배치
- ⚠️ "이것만 선택하세요" 같은 강압적 표현 제거
- ⚠️ "최고", "무조건" 같은 절대적 표현 제거
- ✅ 보험업법 & 금융감독법 준수

---

## 🤝 기여

**버그 리포트**: GitHub Issues  
**기능 제안**: hejunl@hanmail.net

---

## 📄 라이선스

MIT License

---

## 👨‍💼 사업자 정보

- **회사명**: 수인AI브릿지
- **사업자등록번호**: 151-09-03201
- **대표자**: 이희전
- **개업일**: 2026년 02월 25일
- **주소**: 경기도 수원시 영통구 동탄원천로1109번길 37, 103층 502호
- **연락처**: 010-5650-0670
- **이메일**: hejunl@hanmail.net

---

<div align="center">

**PetCare+와 함께 반려동물의 건강한 미래를 만들어가세요!** 🐾

[🌐 웹사이트](https://petcare-plus.vercel.app) · [💬 상담신청](mailto:hejunl@hanmail.net) · [⭐ GitHub](https://github.com/HeeJeonLee/petcare-plus-v2)

**Made with ❤️ by HeeJeon Lee**

</div>
# Deployment
- Vercel: [PetCare+](https://petcare-phase2.vercel.app)
