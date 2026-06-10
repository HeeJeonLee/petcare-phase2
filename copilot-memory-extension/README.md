# Copilot Memory Loader VS Code Extension

## 목적
- PC 변경/새 대화/세션 복구 시, Copilot이 반드시 모든 핵심 파일/전략/코드/문구/자동화 내역을 자동으로 읽고, 세션/컨텍스트를 복구하도록 보장

## 주요 기능
- 워크스페이스가 열릴 때 자동으로 핵심 파일(.github/copilot-instructions.md, PROJECT_CONTEXT_SOURCE.md 등) 전체를 읽고, .copilot-session.md에 요약 저장
- 명령 팔레트에서 "Copilot: 세션/컨텍스트 자동 복구" 명령 실행 가능
- Copilot/운영자가 항상 완전한 기억으로 작업 시작 가능

## 설치 및 사용법
1. 이 폴더에서 `npm install` 후 `npm run compile`로 빌드
2. VS Code에서 이 폴더를 확장 개발 모드로 열고(F5), 워크스페이스를 열면 자동 실행
3. 명령 팔레트(Ctrl+Shift+P)에서 "Copilot: 세션/컨텍스트 자동 복구" 실행 가능

## 구현 원리
- src/extension.ts 참고 (핵심 파일 자동 로드 및 세션 로그 저장)
- ai-agent/session-context-loader.js, auto-session-recover.js와 연동 가능

---

이 확장으로 Copilot의 기억 연속성/자동 복구가 100% 보장됩니다.