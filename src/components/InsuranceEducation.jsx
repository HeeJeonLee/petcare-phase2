// src/components/InsuranceEducation.jsx
// 교육 센터 - 용어, 견종, 청구절차, FAQ (19개 항목)

import React, { useState } from 'react';

const InsuranceEducation = () => {
  const [activeTab, setActiveTab] = useState('terms');
  const [expandedItem, setExpandedItem] = useState(0);

  const terms = [
    {
      term: '보험료 (Premium)',
      definition: '보험에 가입할 때 가입자가 보험회사에 납부하는 금액',
      example: '월 25,000원의 보험료를 납입하면 보장을 받을 수 있습니다'
    },
    {
      term: '보장금액 (Coverage)',
      definition: '보험에 가입했을 때 보험회사가 보장해주는 최대 금액',
      example: '기본보장이 500만원이면 그 이내에서 진료비를 보장합니다'
    },
    {
      term: '자기부담금 (Deductible)',
      definition: '보험금을 받을 때 가입자가 직접 내야 하는 부분',
      example: '자기부담금 10%면, 100만원 진료비 시 10만원은 본인이 내야함'
    },
    {
      term: '갱신 (Renewal)',
      definition: '보험이 만료되고 다시 재가입하는 것 (보험료 재산정)',
      example: '1년 계약 후 갱신되면서 나이에 따라 보험료가 올라갈 수 있음'
    },
    {
      term: '면책사항 (Exclusion)',
      definition: '보험회사가 보장하지 않는 사항들',
      example: '예방접종비, 미용비, 기왕증(가입 전 질병) 등은 보장 안 함'
    },
    {
      term: '청구 (Claim)',
      definition: '보험금 지급을 요청하는 행위',
      example: '진료 받은 후 병원에서 나눠준 영수증과 서류로 청구 신청'
    },
    {
      term: '기왕증 (Pre-existing Condition)',
      definition: '보험 가입 전부터 있던 질병이나 부상',
      example: '슬개골 탈구가 이미 있었다면 가입 후에도 보장 제외될 수 있음'
    },
    {
      term: '갱신 한도 (Max Age)',
      definition: '보험에 가입할 수 있는 최대 나이',
      example: '갱신한도가 15세면 15세까지만 계속 갱신 가능'
    }
  ];

  const dogBreeds = [
    {
      breed: '말티즈 🐕',
      characteristics: '작은 몸집, 흰 색깔, 온순함',
      commonDiseases: ['슬개골 탈구', '디스크'],
      recommendedCoverage: '기본형 (월 20-25K)',
      tip: '작은 치아 문제가 많으니 치과 보장 있는 상품 추천'
    },
    {
      breed: '푸들 🐕',
      characteristics: '지능형, 활발함, 빠진 털 없음',
      commonDiseases: ['귀염증', '피부질환'],
      recommendedCoverage: '균형형 (월 25-30K)',
      tip: '활동적이어서 수술 확률이 높으니 수술보장 충분한 상품 선택'
    },
    {
      breed: '비글 🐕',
      characteristics: '사냥 본능, 활발함, 중간 크기',
      commonDiseases: ['이염증', '갑상선 질환'],
      recommendedCoverage: '보장형 (월 28-35K)',
      tip: '크기가 크기 때문에 대형견 상품이나 체중 조건 확인 필수'
    },
    {
      breed: '시바견 🐕',
      characteristics: '독립적, 깔끔함, 중형견',
      commonDiseases: ['알레르기', '슬개골 탈구'],
      recommendedCoverage: '균형형 (월 26-32K)',
      tip: '개인차가 크므로 가입 전 건강검진 필수'
    },
    {
      breed: '고양이 🐱',
      characteristics: '깔끔함, 독립적, 실내 활동',
      commonDiseases: ['신장질환', '당뇨', '염증'],
      recommendedCoverage: '균형형 (월 22-28K)',
      tip: '중년 이후 신장질환 위험이 높으니 조기 가입 권장'
    }
  ];

  const claimProcess = [
    {
      step: 1,
      title: '진료 후 서류 수집',
      description: '동물병원에서 진료받은 후 필요한 모든 서류를 받으세요',
      details: [
        '진료비 영수증 (원본)',
        '진료내역 상세 기록',
        '처방약 영수증',
        '진단서 (필요시)'
      ]
    },
    {
      step: 2,
      title: '고객센터에 연락',
      description: '보험회사 고객센터에 청구 의사를 알리세요',
      details: [
        '전화 또는 앱으로 미리 신고',
        '필요한 서류 목록 확인',
        '청구 절차 안내받기',
        '담당자 배정받기'
      ]
    },
    {
      step: 3,
      title: '청구 서류 작성 및 제출',
      description: '청구서를 작성하여 서류와 함께 제출하세요',
      details: [
        '청구 신청서 작성',
        '서류 패키지 준비',
        '우편/방문/앱으로 제출',
        '접수 확인 번호 기록'
      ]
    },
    {
      step: 4,
      title: '심사 및 검증',
      description: '보험회사에서 제출된 서류를 심사합니다 (5-10일)',
      details: [
        '보장 대상 여부 확인',
        '면책 사항 검토',
        '보험료 계산',
        '필요시 추가 자료 요청'
      ]
    },
    {
      step: 5,
      title: '보험금 지급',
      description: '심사가 완료되면 보험금이 계좌로 입금됩니다',
      details: [
        '입금 전 최종 확인 연락',
        '지정된 계좌로 송금',
        '영수증 발급',
        '완료 알림 수신'
      ]
    }
  ];

  const faqs = [
    {
      question: '가입 후 몇 일부터 보장이 시작되나요?',
      answer: '대부분의 펫보험은 가입 후 7-30일의 대기 기간이 있습니다. 대기 기간 내에는 보장받지 못하므로 미리 문의해서 확인하세요.'
    },
    {
      question: '기왕증(가입 전 질병)도 보장받나요?',
      answer: '대부분의 펫보험은 기왕증을 보장하지 않습니다. 다만 일부 상품은 일정 기간 후 보장하기도 하니 확인하세요.'
    },
    {
      question: '청구 후 거절당할 수 있나요?',
      answer: '네, 다음의 경우 거절될 수 있습니다: 면책 사항, 자격 상실, 사기 의심, 서류 부족 등. 명확한 이유를 전달받을 권리가 있습니다.'
    },
    {
      question: '보험료는 나이가 들면서 계속 올라가나요?',
      answer: '네, 갱신할 때마다 나이에 따라 보험료가 인상됩니다. 일부 상품은 한도를 정해놓기도 하니 확인하세요.'
    },
    {
      question: '여러 보험사에 동시 가입할 수 있나요?',
      answer: '네, 가능합니다. 다만 총 보험금이 실제 진료비를 초과할 수 없으므로 보험금 계산 시 차감됩니다 (중복 보장 방지).'
    },
    {
      question: '온라인으로 청구할 수 있나요?',
      answer: '네, 대부분의 보험사가 모바일 앱이나 웹사이트에서 온라인 청구를 지원합니다. 서류를 사진으로 찍어서 업로드하면 됩니다.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">📚 펫보험 교육 센터</h1>
          <p className="text-lg text-gray-600">용어부터 청구까지 모든 것을 배워보세요</p>
        </div>

        {/* 탭 네비게이션 */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {[
            { id: 'terms', label: '📖 보험 용어 (8개)', icon: '📖' },
            { id: 'breeds', label: '🐕 견종별 가이드 (5개)', icon: '🐕' },
            { id: 'process', label: '📋 청구 절차 (5개 단계)', icon: '📋' },
            { id: 'faq', label: '❓ FAQ (6개 질문)', icon: '❓' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                activeTab === tab.id
                  ? 'bg-orange-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 콘텐츠 영역 */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* 용어 탭 */}
          {activeTab === 'terms' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">📖 주요 용어 8개</h2>
              <div className="space-y-4">
                {terms.map((item, idx) => (
                  <div
                    key={idx}
                    className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition"
                  >
                    <button
                      onClick={() => setExpandedItem(expandedItem === idx ? -1 : idx)}
                      className="w-full px-6 py-4 bg-gradient-to-r from-orange-50 to-amber-50 hover:from-orange-100 hover:to-amber-100 flex justify-between items-center"
                    >
                      <span className="font-bold text-gray-800">{item.term}</span>
                      <span className="text-2xl">{expandedItem === idx ? '▼' : '▶'}</span>
                    </button>
                    {expandedItem === idx && (
                      <div className="px-6 py-4 bg-white border-t border-gray-200">
                        <p className="text-gray-700 mb-3"><strong>정의:</strong> {item.definition}</p>
                        <p className="text-gray-600"><strong>예시:</strong> {item.example}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 견종 탭 */}
          {activeTab === 'breeds' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">🐕 견종별 맞춤 가이드</h2>
              <div className="space-y-6">
                {dogBreeds.map((item, idx) => (
                  <div
                    key={idx}
                    className="border-l-4 border-orange-400 bg-orange-50 rounded-lg p-6"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold text-gray-800">{item.breed}</h3>
                      <span className="text-sm font-semibold text-orange-700 bg-orange-100 px-3 py-1 rounded-full">
                        {item.recommendedCoverage}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-4">{item.characteristics}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-semibold text-gray-600 mb-2">🏥 흔한 질병:</p>
                        <ul className="text-sm text-gray-700 space-y-1">
                          {item.commonDiseases.map((disease, i) => (
                            <li key={i}>• {disease}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-600 mb-2">💡 전문가 팁:</p>
                        <p className="text-sm text-gray-700 bg-white p-2 rounded">{item.tip}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 청구절차 탭 */}
          {activeTab === 'process' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">📋 5단계 청구 절차</h2>
              <div className="space-y-6">
                {claimProcess.map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-br from-orange-500 to-red-500">
                        <span className="text-white font-bold text-lg">{item.step}</span>
                      </div>
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
                      <p className="text-gray-600 mb-3">{item.description}</p>
                      <ul className="space-y-1">
                        {item.details.map((detail, i) => (
                          <li key={i} className="text-sm text-gray-700 flex items-start">
                            <span className="text-orange-500 mr-2">✓</span>
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>⏱️ 소요 시간:</strong> 평균 2주 (서류 제출 후 심사 5-10일 + 입금 3-5일)
                </p>
              </div>
            </div>
          )}

          {/* FAQ 탭 */}
          {activeTab === 'faq' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">❓ 자주 묻는 질문 6개</h2>
              <div className="space-y-4">
                {faqs.map((item, idx) => (
                  <div
                    key={idx}
                    className="border border-gray-200 rounded-lg overflow-hidden"
                  >
                    <button
                      onClick={() => setExpandedItem(expandedItem === idx ? -1 : idx)}
                      className="w-full px-6 py-4 bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 flex justify-between items-center text-left"
                    >
                      <span className="font-bold text-gray-800">{item.question}</span>
                      <span className="text-2xl text-blue-600">{expandedItem === idx ? '▼' : '▶'}</span>
                    </button>
                    {expandedItem === idx && (
                      <div className="px-6 py-4 bg-white border-t border-gray-200">
                        <p className="text-gray-700">{item.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 요약 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
          <div className="bg-blue-500 text-white rounded-lg p-4 text-center">
            <div className="text-3xl font-bold">8</div>
            <div className="text-sm">핵심 용어</div>
          </div>
          <div className="bg-green-500 text-white rounded-lg p-4 text-center">
            <div className="text-3xl font-bold">5</div>
            <div className="text-sm">견종 가이드</div>
          </div>
          <div className="bg-orange-500 text-white rounded-lg p-4 text-center">
            <div className="text-3xl font-bold">5</div>
            <div className="text-sm">청구 단계</div>
          </div>
          <div className="bg-purple-500 text-white rounded-lg p-4 text-center">
            <div className="text-3xl font-bold">6</div>
            <div className="text-sm">FAQ</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsuranceEducation;
