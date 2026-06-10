# Copilot VS Code 확장/에이전트 설계 가이드

## 목적
- PC 변경/새 대화/세션 복구 시, Copilot이 반드시 모든 핵심 파일/전략/코드/문구/자동화 내역을 자동으로 읽고, 메모리에 복구하도록 보장
- 운영자/팀장이 "기억 연속성"을 100% 신뢰할 수 있도록 함

## 핵심 파일 자동 로드 목록
- .github/copilot-instructions.md
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

## 동작 원리
1. VS Code 확장/에이전트가 실행되면, 위 파일 전체를 자동으로 읽고 요약/분석/전략/코드/문구/설정/자동화 내역을 메모리에 복구
2. .copilot-session.md에 세션 로그/요약 자동 저장
3. Copilot이 항상 완전한 기억을 회복한 상태에서 작업 시작

## 구현 예시
- ai-agent/session-context-loader.js, ai-agent/auto-session-recover.js 참고
- 확장 activate()에서 autoRecoverSession() 호출
- 세션/컨텍스트 복구 후, Copilot/운영자에게 "완전한 기억 복구 완료" 메시지 출력

## 추가 권장 사항
- PC 변경/새 대화 시 자동 실행(activate/onStartup)
- 세션 로그/커밋 요약 자동화
- 핵심 파일 변경 감지 시 자동 재로드
- 운영자 수동 복구 버튼 제공(필요시)

---

이 가이드와 예시 코드를 기반으로, Copilot의 기억 연속성/자동 복구 시스템을 완성할 수 있습니다.