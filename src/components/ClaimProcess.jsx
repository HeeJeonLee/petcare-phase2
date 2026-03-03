// src/components/ClaimProcess.jsx
// 보험금 청구 프로세스 가이드 + 체크리스트

import React, { useState } from 'react';

const ClaimProcess = () => {
  const [expandedStep, setExpandedStep] = useState(null);
  const [checkedItems, setCheckedItems] = useState({});

  const claimProcess = [
    {
      step: 1, title: '📋 진료 후 영수증 수집', duration: '즉시',
      description: '동물병원에서 진료받은 후 반드시 필요한 서류를 수집합니다',
      details: ['진료영수증 (원본)', '진료내역 상세 (처방약, 검사 항목)', '진료 담당 수의사 연락처', '동물병원 면허증 사본 (초회 청구 시)', '반려동물 예방접종 증명서'],
      tips: ['영수증을 분실하지 않도록 주의', '진료 당일에 모든 서류를 받는 것이 좋음', '영수증에 반려동물 이름이 명기되어 있는지 확인', '신용카드 영수증보다 병원 발행 영수증이 필수'],
      icon: '🏥'
    },
    {
      step: 2, title: '📱 보험사 고객센터 연락', duration: '1-2일',
      description: '보험사에 청구 의사를 알리고 필요한 서류를 확인합니다',
      details: ['고객센터 전화 또는 앱 접속', '보험계약번호 및 반려동물 정보 제공', '진료 내용 간단히 설명', '필요 서류 목록 확인', '청구 방법 안내 받기'],
      tips: ['보험사마다 신청 방법이 다를 수 있음', '대기 기간 만료 여부 확인 (보통 14일)', '면책 기간 내 진료인지 확인', '통화 내용을 기록해두면 나중에 도움'],
      icon: '☎️'
    },
    {
      step: 3, title: '📄 청구 서류 작성 및 제출', duration: '3-5일',
      description: '보험사 지정 양식에 따라 청구 서류를 작성합니다',
      details: ['보험금 청구 신청서 작성', '진료영수증 사본 첨부', '진료내역 상세 첨부', '신분증 사본 첨부', '통장 사본 (계좌 확인용)'],
      tips: ['모든 문항을 빠짐없이 작성', '서명은 가입자 본인 서명 필수', '날짜는 청구 신청일 기준', '온라인 or 우편 제출 모두 가능'],
      icon: '✍️'
    },
    {
      step: 4, title: '🔍 보험사 심사', duration: '5-10일',
      description: '보험사에서 청구 서류를 검토하고 지급 여부를 판단합니다',
      details: ['청구 내용 검증', '보장 대상 질병 여부 확인', '보장 한도 확인', '면책 기간 재확인', '기존 병력 조회'],
      tips: ['심사 기간 중 추가 서류 요청이 있을 수 있음', '신속한 심사를 원하면 담당자에게 연락', '청구 건별로 심사 기간이 다를 수 있음', '복잡한 케이스는 시간이 더 걸릴 수 있음'],
      icon: '🔎'
    },
    {
      step: 5, title: '💰 보험금 지급', duration: '1-3일',
      description: '심사 완료 후 지급 승인 시 계좌로 입금됩니다',
      details: ['보험금 지급 승인 통지', '지급액 확인 (보장한도 내)', '세금 공제 후 순액 입금', '입금 확인', '영수증 자료 보관'],
      tips: ['일반적으로 영업일 기준 1-3일 내 입금', '주말/공휴일은 입금 지연 가능', '부분 지급이 될 수 있음', '통장 잔액으로 확인 필수'],
      icon: '💸'
    },
    {
      step: 6, title: '🎯 완료 및 기록 보관', duration: '장기',
      description: '청구 완료 후 향후 참고용 기록을 보관합니다',
      details: ['보험금 지급 확인서 보관', '진료영수증 보관', '청구 서류 사본 보관', '진료 기록 정리', '보험료 납입 확인'],
      tips: ['최소 3년 이상 보관 권장', '디지털 자료로도 백업 권장', '다음 청구 시 참고 가능', '분실 시 보험사 재발급 가능'],
      icon: '✅'
    }
  ];

  const commonQuestions = [
    { question: '보험금을 받기까지 몇 일이 걸리나요?', answer: '일반적으로 청구 후 10-15일 소요됩니다. (영업일 기준) 복잡한 케이스는 20일까지 걸릴 수 있습니다.' },
    { question: '보장 한도를 초과하면 어떻게 되나요?', answer: '한도 초과분은 본인이 전액 부담합니다. 미리 한도를 확인하고 고가 시술 전에 보험사에 문의하는 것이 좋습니다.' },
    { question: '면책 기간이란 무엇인가요?', answer: '보험 가입 후 일정 기간(보통 14일) 동안은 질병 청구가 불가합니다. (사고는 가능) 면책 기간 내 진료비는 보장 안 됩니다.' },
    { question: '같은 질병으로 여러 번 청구할 수 있나요?', answer: '네, 보장 한도 내에서 가능합니다. 다만 같은 질병의 재치료는 보장 기간이 제한될 수 있습니다.' },
    { question: '예방 접종이나 건강검진도 보장되나요?', answer: '아니요, 예방 차원의 검진과 접종은 보장 대상이 아닙니다. 질병 치료만 보장됩니다.' },
    { question: '보험료를 못 내면 어떻게 되나요?', answer: '보험료 미납 시 30-60일 유예 기간 후 보험이 자동 해약됩니다. 복구하려면 보험사에 연락하세요.' }
  ];

  const checklist = [
    { id: 'receipt', label: '진료영수증 (원본)', category: 'document' },
    { id: 'details', label: '진료내역 상세', category: 'document' },
    { id: 'license', label: '병원 면허증 사본', category: 'document' },
    { id: 'vaccine', label: '예방접종 증명서', category: 'document' },
    { id: 'contact', label: '수의사 연락처 확인', category: 'document' },
    { id: 'claim_form', label: '보험금 청구서 작성', category: 'form' },
    { id: 'id_copy', label: '신분증 사본', category: 'form' },
    { id: 'bank_copy', label: '통장 사본', category: 'form' },
    { id: 'signature', label: '본인 서명', category: 'form' },
    { id: 'call', label: '보험사 고객센터 연락', category: 'notice' },
    { id: 'deadline', label: '청구 기한 확인 (보통 3년)', category: 'notice' },
    { id: 'waiting', label: '대기 기간 만료 확인', category: 'notice' }
  ];

  const toggleCheck = (id) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const completionRate = Math.round((Object.values(checkedItems).filter(Boolean).length / checklist.length) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">📋 보험금 청구 프로세스</h1>
          <p className="text-lg text-gray-600">단계별 청구 과정과 필요한 서류를 확인하세요</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">🎯 전체 프로세스 흐름</h2>
          <div className="space-y-4">
            {claimProcess.map((process, index) => (
              <div key={process.step}>
                <button onClick={() => setExpandedStep(expandedStep === process.step ? null : process.step)}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-lg hover:shadow-lg transition flex justify-between items-center">
                  <div className="flex items-center gap-4 text-left">
                    <span className="text-3xl">{process.icon}</span>
                    <div>
                      <h3 className="font-bold text-lg">{process.title}</h3>
                      <p className="text-sm text-orange-100">소요 시간: {process.duration}</p>
                    </div>
                  </div>
                  <span className="text-2xl">{expandedStep === process.step ? '▲' : '▼'}</span>
                </button>

                {expandedStep === process.step && (
                  <div className="bg-gradient-to-b from-orange-50 to-white p-6 border-l-4 border-orange-500">
                    <p className="text-gray-700 mb-4">{process.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-bold text-gray-800 mb-3">📌 필요한 서류</h4>
                        <ul className="space-y-2">
                          {process.details.map((detail, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                              <span className="text-orange-500 mt-1">✓</span>
                              <span>{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-bold text-gray-800 mb-3">💡 팁</h4>
                        <ul className="space-y-2">
                          {process.tips.map((tip, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                              <span className="text-yellow-500 mt-1">★</span>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {index < claimProcess.length - 1 && (
                  <div className="flex justify-center py-2">
                    <div className="text-3xl text-orange-400">↓</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">✅ 청구 준비 체크리스트</h2>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-gray-700">완료율</span>
              <span className="text-lg font-bold text-orange-600">{completionRate}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 h-full transition-all duration-300"
                style={{ width: `${completionRate}%` }}></div>
            </div>
          </div>

          <div className="space-y-6">
            {['document', 'form', 'notice'].map(category => {
              const categoryLabel = { document: '📄 필수 서류', form: '📝 작성 서류', notice: '📢 확인 사항' }[category];
              const categoryItems = checklist.filter(item => item.category === category);

              return (
                <div key={category}>
                  <h3 className="font-bold text-gray-800 mb-3">{categoryLabel}</h3>
                  <div className="space-y-2">
                    {categoryItems.map(item => (
                      <label key={item.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-orange-50 cursor-pointer transition">
                        <input type="checkbox" checked={checkedItems[item.id] || false} onChange={() => toggleCheck(item.id)}
                          className="w-5 h-5 rounded cursor-pointer" />
                        <span className={`flex-1 ${checkedItems[item.id] ? 'line-through text-gray-400' : 'text-gray-700'}`}>{item.label}</span>
                        {checkedItems[item.id] && <span className="text-lg">✓</span>}
                      </label>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">❓ 자주 묻는 질문</h2>
          <div className="space-y-4">
            {commonQuestions.map((qa, index) => (
              <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                <h4 className="font-bold text-gray-800 mb-2">Q: {qa.question}</h4>
                <p className="text-gray-700 ml-4">A: {qa.answer}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mt-12">
          <p className="text-sm text-gray-700">
            <strong>⚠️ 면책 공고:</strong> 본 청구 가이드는 일반적인 정보이며, 각 보험사마다 청구 절차가 상이할 수 있습니다. 정확한 청구 방법은 해당 보험사에 직접 문의하시기 바랍니다.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClaimProcess;
