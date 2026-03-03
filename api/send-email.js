// api/send-email.js
// Vercel Serverless Function
// POST /api/send-email 엔드포인트

import { COMPANY_INFO } from '../src/constants/company.js';

export default async function handler(req, res) {
  // CORS 설정
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // OPTIONS 요청 처리
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // POST만 허용
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { name, phone, email, petType, petAge, message } = req.body;

    // 환경변수 확인
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const adminEmail = process.env.PETCARE_ADMIN_EMAIL || 'hejunl@hanmail.net';

    if (!RESEND_API_KEY) {
      console.error('❌ RESEND_API_KEY 환경변수 없음');
      res.status(500).json({
        error: 'RESEND API key missing',
        details: '환경변수 설정: RESEND_API_KEY=re_... 필요'
      });
      return;
    }

    if (!adminEmail) {
      console.error('❌ PETCARE_ADMIN_EMAIL 환경변수 없음');
      res.status(500).json({
        error: 'Admin email configuration error',
        details: '환경변수 PETCARE_ADMIN_EMAIL을 설정해주세요.'
      });
      return;
    }

    // 이메일 HTML 템플릿
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #2563eb, #7c3aed); padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 30px;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🐾 PetCare+</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0;">펫 라이프 맞춤 설계 리포트 신청</p>
        </div>

        <div style="background: #f8fafc; border-radius: 12px; padding: 24px; margin-bottom: 20px;">
          <h2 style="color: #1e293b; font-size: 18px; margin-top: 0;">📋 신청 정보</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 12px 8px; color: #64748b; font-weight: bold; width: 30%;">성함</td>
              <td style="padding: 12px 8px; color: #1e293b; font-weight: 600;">${name || '-'}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 12px 8px; color: #64748b; font-weight: bold;">연락처</td>
              <td style="padding: 12px 8px; color: #1e293b; font-weight: 600;">
                <a href="tel:${phone}" style="color: #2563eb;">${phone || '-'}</a>
              </td>
            </tr>
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 12px 8px; color: #64748b; font-weight: bold;">이메일</td>
              <td style="padding: 12px 8px; color: #1e293b;">${email || '-'}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 12px 8px; color: #64748b; font-weight: bold;">반려동물</td>
              <td style="padding: 12px 8px; color: #1e293b;">${petType || '-'} (${petAge || '-'})</td>
            </tr>
            <tr>
              <td style="padding: 12px 8px; color: #64748b; font-weight: bold; vertical-align: top;">상담 내용</td>
              <td style="padding: 12px 8px; color: #1e293b;">${message || '(특별한 요청사항 없음)'}</td>
            </tr>
          </table>
        </div>

        <div style="background: #fef3c7; border: 1px solid #fbbf24; border-radius: 12px; padding: 16px; margin-bottom: 20px;">
          <p style="margin: 0; color: #92400e; font-weight: bold;">
            ⏰ 신청 시간: ${new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}
          </p>
          <p style="margin: 8px 0 0; color: #92400e; font-size: 14px;">
            📧 우측 하단 AI 챗봇에서 24시간 무료 상담 가능합니다
          </p>
        </div>

        <div style="background: #dbeafe; border: 1px solid #0ea5e9; border-radius: 12px; padding: 16px; margin-bottom: 20px;">
          <p style="margin: 0; color: #0369a1; font-weight: bold;">
            ✅ 상담 신청이 정상 접수되었습니다!
          </p>
          <p style="margin: 8px 0 0; color: #0369a1; font-size: 14px;">
            • AI 챗봇: 즉시 24시간 무료 상담<br/>
            • 맞춤 리포트: 신청 후 검토<br/>
            • 전문가 연결: 필요 시 지원
          </p>
        </div>

        <div style="text-align: center; padding: 20px; color: #94a3b8; font-size: 12px;">
          <p>🐾 PetCare+ | ${COMPANY_INFO.name} | Claude AI 기반 펫보험 상담</p>
          <p>📋 <strong>펫 라이프 맞춤 설계 리포트</strong></p>
          <p>사업자등록번호: ${COMPANY_INFO.businessNumber} | 📞 ${COMPANY_INFO.phone}</p>
        </div>
      </div>
    `;

    const fromEmail = 'noreply@resend.dev';

    console.log(`\n📧 ===== 이메일 발송 시작 =====`);
    console.log(`   고객명: ${name}`);
    console.log(`   연락처: ${phone}`);
    console.log(`   고객 이메일: ${email || '(미입력)'}`);
    console.log(`   반려동물: ${petType} / ${petAge}`);
    console.log(`   상담 내용: ${message || '(없음)'}`);
    console.log(`   관리자 이메일: ${adminEmail}`);

    // Resend API 호출
    const requestBody = JSON.stringify({
      from: `PetCare+ 상담팀 <${fromEmail}>`,
      to: [adminEmail],
      cc: email ? [email] : [],
      subject: `[PetCare+] 새로운 펫 라이프 설계 신청 - ${name}`,
      html: emailHtml,
      replyTo: email || adminEmail,
      headers: {
        'X-Customer-Name': name,
        'X-Customer-Phone': phone,
        'X-Customer-Email': email || 'no-email',
        'X-Pet-Type': petType || 'unknown',
        'X-Source': 'petcare-plus-form'
      }
    });

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: requestBody
    });

    console.log(`📨 응답 상태: ${response.status}`);

    const resendData = await response.json();

    if (response.ok) {
      console.log('✅ 이메일 발송 성공!');
      console.log(`   Message ID: ${resendData.id}`);
      console.log(`   받는사람: ${adminEmail}`);
      if (email) console.log(`   CC: ${email}`);
      console.log(`===== 이메일 발송 완료 =====\n`);

      res.status(200).json({
        success: true,
        id: resendData.id,
        message: '상담 신청이 접수되었습니다',
        adminEmail,
        customerEmail: email || null
      });
    } else {
      console.error('❌ 이메일 발송 실패!');
      console.error(`   상태: ${response.status}`);
      console.error(`   오류: ${JSON.stringify(resendData)}`);
      console.log(`===== 이메일 발송 실패 =====\n`);

      res.status(400).json({
        error: resendData.message || '이메일 발송 실패',
        details: resendData,
        status: response.status
      });
    }
  } catch (error) {
    console.error('❌ API 오류 발생!');
    console.error(`   타입: ${error.constructor.name}`);
    console.error(`   메시지: ${error.message}`);
    console.error(`   스택: ${error.stack}`);

    res.status(500).json({
      error: `API 오류: ${error.message}`,
      type: error.constructor.name
    });
  }
}
