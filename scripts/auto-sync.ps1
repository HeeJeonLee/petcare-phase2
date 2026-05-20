param(
  [switch]$Loop,
  [int]$IntervalSeconds = 60,
  [string]$MessagePrefix = "chore: auto-sync"
)

function Invoke-AutoSync {
  $insideRepo = git rev-parse --is-inside-work-tree 2>$null
  if ($insideRepo -ne "true") {
    Write-Host "[auto-sync] Git 저장소가 아닙니다."
    return
  }

  $changes = git status --porcelain
  if ([string]::IsNullOrWhiteSpace(($changes -join ""))) {
    Write-Host "[auto-sync] 변경사항 없음"
    return
  }

  git add -A

  git diff --cached --quiet
  if ($LASTEXITCODE -eq 0) {
    Write-Host "[auto-sync] 스테이징된 변경사항 없음"
    return
  }

  $ts = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
  $msg = "$MessagePrefix $ts"

  git commit -m $msg
  if ($LASTEXITCODE -ne 0) {
    Write-Host "[auto-sync] 커밋 실패"
    return
  }

  git push
  if ($LASTEXITCODE -ne 0) {
    Write-Host "[auto-sync] 푸시 실패 (인증/권한/브랜치 확인 필요)"
    return
  }

  Write-Host "[auto-sync] 커밋+푸시 완료: $msg"
}

if ($Loop) {
  Write-Host "[auto-sync] 반복 모드 시작 (주기: $IntervalSeconds초)"
  while ($true) {
    Invoke-AutoSync
    Start-Sleep -Seconds $IntervalSeconds
  }
} else {
  Invoke-AutoSync
}
