# ============================================
# PetCare+ GitHub & Vercel 자동 배포 스크립트
# ============================================
# 이 스크립트는 다음을 자동으로 처리합니다:
# 1. Git, GitHub CLI, Vercel CLI 설치 확인
# 2. GitHub 저장소 생성
# 3. 코드 커밋 및 푸시
# 4. Vercel 배포
# 5. 환경변수 설정

# 색상 정의
$red = "`e[91m"
$green = "`e[92m"
$yellow = "`e[93m"
$blue = "`e[94m"
$reset = "`e[0m"

Write-Host "${blue}========================================${reset}" -NoNewline
Write-Host "${blue}`n  🚀 PetCare+ 자동 배포 시작`n${reset}" -NoNewline
Write-Host "${blue}========================================${reset}`n"

# ============================================
# STEP 1: 필수 도구 확인
# ============================================
Write-Host "${yellow}📋 STEP 1: 필수 도구 확인${reset}`n"

function Check-Tool {
    param([string]$toolName, [string]$command)
    
    try {
        if ($toolName -eq "Git") {
            $result = & git --version 2>&1
        } elseif ($toolName -eq "GitHub CLI") {
            $result = & gh --version 2>&1
        } elseif ($toolName -eq "Vercel CLI") {
            $result = & vercel --version 2>&1
        }
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "${green}✅ $toolName 설치됨: $result${reset}"
            return $true
        } else {
            Write-Host "${red}❌ $toolName 미설치${reset}"
            return $false
        }
    } catch {
        Write-Host "${red}❌ $toolName 미설치${reset}"
        return $false
    }
}

$gitInstalled = Check-Tool "Git"
$ghInstalled = Check-Tool "GitHub CLI"
$vercelInstalled = Check-Tool "Vercel CLI"

if (-not $gitInstalled -or -not $ghInstalled -or -not $vercelInstalled) {
    Write-Host "`n${red}⚠️ 필수 도구가 설치되지 않았습니다.${reset}"
    Write-Host "${yellow}다음 가이드를 따라 수동으로 설치해주세요:${reset}`n"
    
    Write-Host "${blue}📖 설치 방법:${reset}"
    Write-Host "1. Git: https://git-scm.com/download/win (설치 후 재시작)"
    Write-Host "2. GitHub CLI: https://cli.github.com (설치 후 재시작)"
    Write-Host "3. Vercel CLI: npm install -g vercel (Node.js 필요)${reset}`n"
    
    Write-Host "${yellow}도구 설치 후 이 스크립트를 다시 실행하세요.${reset}"
    exit 1
}

# ============================================
# STEP 2: GitHub 로그인 확인
# ============================================
Write-Host "`n${yellow}📋 STEP 2: GitHub 로그인 확인${reset}`n"

try {
    $ghStatus = & gh auth status 2>&1
    Write-Host "${green}✅ GitHub 로그인됨:${reset}`n$ghStatus`n"
} catch {
    Write-Host "${red}❌ GitHub에 로그인되지 않았습니다.${reset}"
    Write-Host "${yellow}명령어 실행: gh auth login${reset}"
    & gh auth login
}

# ============================================
# STEP 3: GitHub 저장소 생성
# ============================================
Write-Host "${yellow}`n📋 STEP 3: GitHub 저장소 생성${reset}`n"

$repoName = "petcare-phase2"
Write-Host "저장소명: $repoName"

try {
    # 저장소 이미 존재하는지 확인
    $existingRepo = & gh repo view $repoName 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "${green}✅ 저장소가 이미 존재합니다: $repoName${reset}"
    }
} catch {
    Write-Host "${yellow}새 저장소 생성 중...${reset}"
    & gh repo create $repoName --public --source=. --remote=origin --push
    Write-Host "${green}✅ 저장소 생성 완료${reset}"
}

# ============================================
# STEP 4: Git 설정
# ============================================
Write-Host "${yellow}`n📋 STEP 4: Git 설정${reset}`n"

# 현재 디렉토리 확인
$currentDir = Get-Location
Write-Host "작업 디렉토리: $currentDir"

# Git 초기화
if (-not (Test-Path ".git")) {
    Write-Host "${yellow}Git 저장소 초기화 중...${reset}"
    & git init
    & git config user.name "petcare-automation"
    & git config user.email "admin@petcare.local"
} else {
    Write-Host "${green}✅ Git 저장소 이미 초기화됨${reset}"
}

# ============================================
# STEP 5: 코드 커밋 및 푸시
# ============================================
Write-Host "${yellow}`n📋 STEP 5: 코드 커밋 및 푸시${reset}`n"

Write-Host "${yellow}변경된 파일 확인 중...${reset}"
& git status

Write-Host "`n${yellow}파일 추가 중 (git add .)...${reset}"
& git add .

Write-Host "${yellow}커밋 메시지로 커밋 중...${reset}"
$commitMessage = "feat: PetCare+ v2.0 - 자동 배포 ($(Get-Date -Format 'yyyy-MM-dd'))"
& git commit -m $commitMessage

# 브랜치 이름 확인 및 main으로 변경
$currentBranch = git rev-parse --abbrev-ref HEAD
if ($currentBranch -ne "main") {
    Write-Host "${yellow}브랜치 이름 변경: $currentBranch → main${reset}"
    & git branch -M main
}

# 원격 저장소 확인
$remotes = & git remote
if ($remotes -notcontains "origin") {
    Write-Host "${yellow}원격 저장소 추가 중...${reset}"
    & gh repo view --web
    Write-Host "${yellow}GitHub에서 HTTPS URL 복사 후 입력하세요:${reset}"
    $repoUrl = Read-Host "저장소 URL"
    & git remote add origin $repoUrl
}

Write-Host "${yellow}GitHub에 푸시 중...${reset}"
& git push -u origin main

Write-Host "${green}✅ GitHub 푸시 완료${reset}"

# ============================================
# STEP 6: Vercel 로그인 확인
# ============================================
Write-Host "${yellow}`n📋 STEP 6: Vercel 로그인 확인${reset}`n"

Write-Host "${yellow}Vercel 로그인 상태 확인...${reset}"

try {
    $vercelWhoami = & vercel whoami 2>&1
    Write-Host "${green}✅ Vercel 로그인됨: $vercelWhoami${reset}"
} catch {
    Write-Host "${yellow}Vercel 로그인 필요...${reset}"
    & vercel login
}

# ============================================
# STEP 7: Vercel 배포
# ============================================
Write-Host "${yellow}`n📋 STEP 7: Vercel 배포${reset}`n"

Write-Host "${yellow}Vercel 배포 시작...${reset}"
Write-Host "${yellow}(첫 배포 시 프로젝트명을 입력해야 할 수 있습니다)${reset}"

& vercel deploy --prod

Write-Host "${green}✅ Vercel 배포 완료${reset}"

# ============================================
# STEP 8: 환경변수 설정 가이드
# ============================================
Write-Host "${yellow}`n📋 STEP 8: 환경변수 설정 (수동)${reset}`n"

Write-Host "${blue}다음 단계를 수동으로 수행하세요:${reset}`n"
Write-Host "1. Vercel 대시보드 접속: https://vercel.com/dashboard"
Write-Host "2. petcare-phase2 프로젝트 선택"
Write-Host "3. Settings → Environment Variables 클릭"
Write-Host "4. 다음 환경변수 추가:`n"

Write-Host "${yellow}추가할 환경변수:${reset}"
Write-Host "  VITE_ANTHROPIC_API_KEY = sk-ant-..."
Write-Host "  VITE_GOOGLE_MAPS_API_KEY = AIzaSyA6..."
Write-Host "  RESEND_API_KEY = re_HDpESPkP_..."
Write-Host "  PETCARE_ADMIN_EMAIL = hejunl@hanmail.net"
Write-Host "  VITE_SUPABASE_URL = https://cpejxivbyvlpkmthgwfg.supabase.co"
Write-Host "  VITE_SUPABASE_ANON_KEY = sb_publishable_..."""

Write-Host "`n5. 각 변수별 'Save' 클릭"
Write-Host "6. Vercel이 자동으로 재배포됨 (약 1-2분)"

# ============================================
# 완료 메시지
# ============================================
Write-Host "`n${green}========================================${reset}"
Write-Host "${green}✅ 배포 프로세스 완료!${reset}"
Write-Host "${green}========================================${reset}`n"

Write-Host "${blue}📍 다음 URL에서 라이브 사이트 확인:${reset}"
Write-Host "https://petcare-phase2.vercel.app`n"

Write-Host "${yellow}📋 다음 작업:${reset}"
Write-Host "1. Vercel 대시보드에서 환경변수 설정"
Write-Host "2. 환경변수 설정 후 자동 재배포 대기 (약 1-2분)"
Write-Host "3. 라이브 사이트에서 기능 테스트"
Write-Host "4. 이메일, 챗봇, 맵 기능 확인`n"

Read-Host "${green}엔터를 누르면 종료됩니다.${reset}"
