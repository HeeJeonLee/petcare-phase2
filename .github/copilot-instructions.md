# Copilot 자동 기억·전략 통합 지침

이 파일은 Copilot이 대화 시작/PC 변경/세션 복구 시 반드시 자동으로 읽고, 아래 핵심 전략·명제·코드·문구·자동화 내역을 메모리에 복구하는 통합 지침입니다.

## 자동 로드 대상 파일
- PROJECT_CONTEXT_SOURCE.md
- SNS_MASTER_STRATEGY.md
- ai-agent/master-agent.js
- ai-agent/content-generator.js
- ai-agent/sns-publisher.js
- ai-agent/goal-tracker.js
- ai-agent/legal-checker.js
- ai-agent/find-korean-voice.js
- ai-agent/get-youtube-token.js
- ai-agent/setup-wizard.js
- ai-agent/set-secrets.js
- src/App.jsx
- src/constants/company.js
- src/utils/telegram.js

## 운영 명제(6 Core Propositions)
- PROJECT_CONTEXT_SOURCE.md의 6가지 명제(주력상품 집중, 효율화, 법규준수, 실적극대화, 단순화, 기타 추가 명제)를 항상 최우선으로 반영
- Copilot은 항상 모든 기억을 회복한 상태에서 작업 시작(PC 변경, 파일 추가, 이관 시에도 동일)
- 세션 로그(.copilot-session.md), 커밋 요약, 자동화 전략 파일을 항상 최신 상태로 유지

## 자동화 원칙
- 대화 시작/PC 변경/새 세션마다 위 파일 전체를 자동으로 읽고, 요약/분석/전략/코드/문구/설정/자동화 내역을 메모리에 복구
- Copilot은 항상 완전한 기억을 회복한 상태에서 작업 시작

---

## 최근 세션/작업 로그
- (자동으로 최신 작업/변경/전략/이슈/실적 등 기록)
