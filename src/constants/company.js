// src/constants/company.js
// 회사 공개 정보 (GitHub에 커밋됨, .env.local 불필요)
// 민감한 정보는 포함하지 않음 - 모두 공개 정보

export const COMPANY_INFO = {
  // 회사 기본 정보
  name: '수인AI브릿지',
  businessNumber: '신규 사업자', // 신규 사업자로 표기
  representative: '이희천',
  
  // 보험설계사 정보 (중요)
  consultant: {
    name: '이희천',
    designation: '보험설계사',
    designationCode: '251220019',
    company: '미래에셋금융서비스',
    experience: '25년 금융보험 경력',
    email: 'hejunl@hanmail.net',
    phone: '010-5650-0670'
  },
  
  // 연락처 (이메일만 공개 - 하단에만 표시)
  email: 'hejunl@hanmail.net',
  phone: '010-5650-0670', // 내부용 (하단 footer에만 사업번호 뒤에 형식상으로만 표시)
  
  // 주소는 제거됨 (모든 페이지에서 제외)
  address: '',
  fullAddress: '',
  
  // 비즈니스 정보
  businessType: 'AI 기반 펫보험 비교 플랫폼 (정보 제공 목적)',
  foundedYear: 2026,
  
  // 소셜 미디어 (추후 추가 가능)
  social: {
    instagram: '',
    facebook: '',
    blog: ''
  },
  
  // 운영 시간
  operatingHours: '24시간 (AI 챗봇)',
  
  // 법적 공고 (중요)
  serviceNotice: {
    disclaimer: '본 플랫폼은 펫보험 가입을 권유하는 것이 아니며, 정보 제공 목적입니다.',
    dataUsage: '개인정보는 상담 목적으로만 사용됩니다.',
    legalTerms: [
      '⚠️ 본 서비스는 정보 제공용 펫보험 비교 플랫폼입니다.',
      '❌ 보험 권유, 권유행위, 중개행위를 하지 않습니다.',
      '✅ 정확한 가입 조건과 보장 내용은 각 보험사에 직접 확인하세요.',
      '💬 보험설계사 상담은 별도의 랜딩페이지에서 진행됩니다.'
    ]
  }
};

// 편의 함수들
export const getCompanyEmail = () => COMPANY_INFO.email;
export const getCompanyPhone = () => COMPANY_INFO.phone;
export const getCompanyAddress = () => COMPANY_INFO.address;
