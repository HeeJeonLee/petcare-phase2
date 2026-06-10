// kakao-openchat-api.js
// 카카오 오픈채팅/커뮤니티 API 연동(메시지 자동화)
// (실제 발송은 카카오 비즈니스/오픈빌더 승인 필요)

const fetch = require('node-fetch');

class KakaoOpenChatAPI {
  constructor(token) {
    this.token = token || process.env.KAKAO_BIZ_TOKEN;
    this.baseUrl = 'https://kauth.kakao.com'; // 실제 메시지 발송은 오픈빌더/비즈니스 API 사용
  }

  // 예시: 오픈채팅방 메시지 발송(오픈빌더 연동 필요)
  async sendMessageToOpenChat(roomId, message) {
    // 실제 구현은 카카오 오픈빌더/비즈니스 API 문서 참고
    // 아래는 구조 예시(테스트용, 실제 발송은 별도 승인 필요)
    const url = `${this.baseUrl}/openchat/${roomId}/message`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });
    if (!res.ok) {
      throw new Error(`카카오 오픈채팅 메시지 발송 실패: ${res.status}`);
    }
    return await res.json();
  }

  // 오픈채팅방 목록 조회(예시)
  async listOpenChats() {
    // 실제 구현은 카카오 오픈빌더/비즈니스 API 문서 참고
    const url = `${this.baseUrl}/openchat/list`;
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.token}`,
      },
    });
    if (!res.ok) {
      throw new Error(`카카오 오픈채팅 목록 조회 실패: ${res.status}`);
    }
    return await res.json();
  }
}

module.exports = KakaoOpenChatAPI;
