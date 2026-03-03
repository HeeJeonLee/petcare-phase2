# 🚀 PetCare+ 배포 체크리스트 및 가이드

> 2026년 3월 3일 최종 정리 버전
> 이 문서는 GitHub → Vercel 배포 프로세스를 정밀하게 기록합니다.

---

## 📋 **1단계: 배포 전 최종 검증**

### ✅ 로컬 코드 검증 (완료됨)

- [x] 모든 React 컴포넌트 확인 (11개)
  - ✅ AIRecommendation.jsx (406줄)
  - ✅ ChatBot.jsx (217줄, 대화형 업그레이드 완료)
  - ✅ ClaimProcess.jsx (192줄)
  - ✅ ComparisonChart.jsx (402줄)
  - ✅ HealthCalculator.jsx (301줄)
  - ✅ HospitalFinder.jsx (305줄)
  - ✅ InsuranceComparison.jsx (280줄, 8개 보험사)
  - ✅ InsuranceEducation.jsx (349줄)
  - ✅ InsurancePersonality.jsx (363줄)
  - ✅ MyPage.jsx (361줄)
  - ✅ AdvancedFilter.jsx (468줄)
  
- [x] 핵심 파일 상태 확인
  - ✅ src/App.jsx (이메일 수집 고정, 3열 그리드, 주소 제거)
  - ✅ src/main.jsx (진입점)
  - ✅ src/constants/company.js (사업정보 정리됨)
  - ✅ vite.config.js (빌드 설정)
  - ✅ tailwind.config.js (스타일링)
  - ✅ package.json (의존성)

- [x] 환경 변수 파일 확인
  - ✅ .env.local 생성됨 (로컬 개발용)
  - ✅ .env.example.txt 존재 (참고용)
  - ✅ .gitignore에 .env.local 포함됨

- [x] 배포 설정 확인
  - ✅ vercel.json 최적화됨 (devCommand 제거, crons 제거)
  - ✅ .gitignore 업데이트됨 (*.txt 제외, .env.local 제외)

### 🔍 배포 전 고정된 문제들

| 문제 | 해결 상태 |
|-----|---------|
| 이메일 수집 구조 | ✅ 고정됨 (name/phone/email/petType/petAge/message) |
| 상담폼 레이아웃 | ✅ 고정됨 (3열 그리드) |
| 사업자정보 | ✅ 정리됨 (신규사업자, 주소 제거) |
| ChatBot | ✅ 업그레이드됨 (대화형, 스트리밍) |
| 8개 보험사 | ✅ 확인됨 (InsuranceComparison) |
| Google Maps | ✅ API 준비됨 (VITE_GOOGLE_MAPS_API_KEY) |

---

## 🔧 **2단계: GitHub 저장소 설정**

### GitHub 저장소 생성 및 초기화

```bash
# 프로젝트 폴더에서 실행
git init
git config user.name "your_github_username"
git config user.email "your_email@gmail.com"

git add .
git commit -m "feat: PetCare+ v2.0 - 11개 컴포넌트, 업그레이드된 CHatBot, 이메일 수집 고정, Vercel 배포 준비"

# GitHub에 리모트 추가 (사용자가 생성한 저장소 URL 필요)
git remote add origin https://github.com/your_username/petcare-phase2.git
git branch -M main
git push -u origin main
```

### GitHub 설정 확인

- [ ] 저장소 생성됨 (https://github.com/your_username/petcare-phase2)
- [ ] .gitignore가 정상 작동함 (node_modules/, .env.local 제외)
- [ ] main 브랜치에 코드 푸시됨
- [ ] GitHub Settings에서 배포 소스 확인

---

## 🌐 **3단계: Vercel 배포 설정**

### Vercel 환경변수 설정 (필수)

Vercel 프로젝트 Settings → Environment Variables에서 다음을 설정하세요:

```
# Claude API (필수)
VITE_ANTHROPIC_API_KEY = sk-ant-...

# Supabase (필수)
VITE_SUPABASE_URL = https://cpejxivbyvlpkmthgwfg.supabase.co
VITE_SUPABASE_ANON_KEY = sb_publishable_...
SUPABASE_SERVICE_KEY = eyJhbGc...

# Google Maps (필수)
VITE_GOOGLE_MAPS_API_KEY = AIzaSyA6...

# Resend (이메일, 필수)
RESEND_API_KEY = re_HDpESPkP_...
PETCARE_ADMIN_EMAIL = hejunl@hanmail.net

# 회사정보 (선택)
VITE_COMPANY_ADDRESS = 경기도 수원시 영통구
VITE_CONSULTANT_PHONE = 010-5650-0670
```

### Vercel 빌드 설정 확인

- [ ] Build Command: `npm run build` ✅ (vercel.json에 설정됨)
- [ ] Install Command: `npm install` ✅ (vercel.json에 설정됨)
- [ ] Output Directory: `dist` ✅ (vite.config.js에 설정됨)
- [ ] Framework: Vite ✅ (자동감지)

### Vercel 배포 옵션

```
Production Deployment:
- Source: GitHub (main branch)
- Auto-deploy on push: 활성화
- Build: npm install && npm run build
- Output: dist/
```

---

## ⚙️ **4단계: 빌드 프로세스 (Vercel 자동 실행)**

Vercel이 다음 순서로 자동 실행합니다:

```
1. Git Clone: GitHub에서 코드 다운로드
   └─ .gitignore 적용 (node_modules, .env.local 제외)

2. Node.js 환경 설정
   └─ Node version: 18.x (자동선택)

3. 의존성 설치
   └─ npm install (package.json 기반)

4. 환경변수 로드
   └─ VITE_* 변수들 로드 (Vercel Settings에서)

5. 빌드 실행
   └─ npm run build (vite build 실행)
   └─ dist/ 폴더 생성
   └─ 소스맵 제거 (production)

6. 배포
   └─ dist/ 콘텐츠 CDN에 배포
   └─ HTTPS 자동 활성화

7. 헬스 체크
   └─ 배포된 URL 자동 테스트
```

---

## 🧪 **5단계: 배포 후 검증**

### 배포 완료 후 확인사항

- [ ] Vercel 대시보드에서 배포 SUCCESS 표시됨
- [ ] Production URL 생성됨 (예: https://petcare-phase2.vercel.app)
- [ ] Environment Variables 모두 설정됨
- [ ] 빌드 로그에 오류 없음

### 라이브 기능 테스트

```
1. 웹페이지 접속
   [ ] https://your-domain.vercel.app 로드됨
   [ ] 반응형 디자인 정상

2. 이메일 수집 테스트
   [ ] 상담 폼 작성
   [ ] 제출 → hejunl@hanmail.net 이메일 수신 확인
   [ ] 모든 필드 포함 확인 (name/phone/email/petName/age/message)

3. ChatBot 테스트
   [ ] 우측 하단 💬 버튼 나타남
   [ ] 클릭 → 챗봇 열림
   [ ] 메시지 입력 → Claude API 응답 수신
   [ ] 대화형 UI 정상작동

4. Google Maps 테스트
   [ ] "병원 검색" 섹션 접속
   [ ] 지도 로드됨
   [ ] 인근 병원 검색 정상작동

5. 보험사 비교 테스트
   [ ] "보험 비교" 섹션 접속
   [ ] 8개 보험사 표시됨 (메리츠, 삼성, DB, 현대, KB, 한화, 농협, 롯데)

6. 마이페이지 테스트
   [ ] 모든 섹션 로드됨
   [ ] 성향 분석, 건강계산기 정상작동

7. 푸터 정보 확인
   [ ] 주소 미표시 ✅ (경기도 주소 없음)
   [ ] 이메일 + ChatBot 안내만 표시 ✅
   [ ] 사업자정보 올바름 ✅
```

---

## 🔴 **6단계: 문제 발생 시 대처**

### 빌드 실패 시

**에러**: `ERR! code ERESOLVE` : 의존성 충돌

```bash
# Vercel 콘솔에서 확인하고, 로컬에서도 테스트
npm install --legacy-peer-deps
npm run build
```

**에러**: `Missing environment variable`

```
→ Vercel Settings에서 환경변수 재확인
→ VITE_* 변수는 클라이언트 코드에서 사용됨
→ 배포 후 다시 시도 (변수 로드 재시도)
```

### 라이브 오류 시

**증상**: 웹페이지가 로드되지만 기능 오류

```
1. Vercel Logs에서 오류 확인
   → https://vercel.com → 프로젝트 → Deployments → Logs

2. 브라우저 Console에서 오류 확인
   → F12 → Console 탭

3. 일반적인 원인:
   - 환경변수 누락 (API 키 설정 바뀜)
   - CORS 오류 (API 엔드포인트)
   - 캐시 문제 (Ctrl+Shift+Delete)
```

---

## 📝 **배포 기록 (이번 배포 정보)**

```
배포 날짜: 2026-03-03
프로젝트: PetCare+ Phase 2 Complete
버전: 2.0.0

주요 변경사항:
✅ 11개 React 컴포넌트 (3,778줄)
✅ ChatBot 대화형 업그레이드 (스트리밍 응답)
✅ 이메일 수집 구조 고정 (name/phone/email/petType/petAge/message)
✅ 상담폼 3열 그리드 레이아웃
✅ 사업자정보 정리 (신규사업자, 주소제거)
✅ Google Maps 통합
✅ 8개 보험사 비교표
✅ Vercel 배포 최적화 (vercel.json)

빌드 환경:
- Node.js: 18.x (Vercel 기본)
- Vite: 5.0.8
- React: 18.2.0
- Tailwind CSS: 3.4.0

배포 타겟:
- 프로덕션: Vercel (자동배포)
- DNS: your-domain.vercel.app
- SSL: 자동 HTTPS
```

---

## 🎯 **다음 단계**

1. [x] 코드 검증 완료
2. [ ] GitHub 저장소 생성 및 푸시
3. [ ] Vercel 프로젝트 연결
4. [ ] 환경변수 설정
5. [ ] 배포 실행
6. [ ] 라이브 기능 테스트

---

**문의사항**: 배포 과정에서 문제 발생 시 Vercel 대시보드의 "Deployments" → "Logs" 탭에서 상세 오류를 확인하세요.
