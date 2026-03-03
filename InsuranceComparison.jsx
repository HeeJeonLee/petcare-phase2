// src/components/InsuranceComparison.jsx
// 8개 보험사 상세 비교표 + 필터링 + 정렬

import React, { useState, useMemo } from 'react';

const InsuranceComparison = () => {
  const [filterPriority, setFilterPriority] = useState('all');
  const [sortBy, setSortBy] = useState('premium');
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);

  const insuranceCompanies = [
    {
      id: 1, name: '메리츠화재', product: '펫퍼민트', logo: '🔥', marketShare: '1위',
      rating: 4.8, reviews: 2450,
      monthlyPremium: { young: 22000, middle: 25000, senior: 38000 },
      coverage: { medical: 5000000, surgery: 10000000, liability: 100000000, mriCt: 3000000, hospitalization: 5000000, dental: 500000 },
      coinsurance: '90%', copay: '없음', maxAge: 15, waitingPeriod: '14일',
      features: ['슬개골 보장 (1년 면책)', '전국 2,000개 제휴병원', '자동 청구 시스템', '갱신 15세까지', '생식기 제거 할인'],
      strengths: ['점유율 1위', '병원 많음', '빠른 청구'],
      weaknesses: ['슬개골 1년 면책', '보장 제약'],
      priority: 'balanced'
    },
    {
      id: 2, name: '삼성화재', product: '위풍댕댕', logo: '🌟', marketShare: '2위',
      rating: 4.6, reviews: 1890,
      monthlyPremium: { young: 28000, middle: 32000, senior: 42000 },
      coverage: { medical: 4500000, surgery: 9000000, liability: 100000000, mriCt: 2500000, hospitalization: 4500000, dental: 1000000 },
      coinsurance: '90%', copay: '없음', maxAge: 16, waitingPeriod: '14일',
      features: ['치과 특화 (1000만원)', '다견할인 (2마리 이상 10% 할인)', '고령견 16세까지 가능', '통증 보장 (신경블록)', '생식기 수술 할인'],
      strengths: ['치과 보장', '다견 할인', '고령견 가능'],
      weaknesses: ['보험료 높음', '보장 낮음'],
      priority: 'comprehensive'
    },
    {
      id: 3, name: 'DB손해보험', product: '펫블리', logo: '💎', marketShare: '3위',
      rating: 4.7, reviews: 1650,
      monthlyPremium: { young: 23000, middle: 26000, senior: 35000 },
      coverage: { medical: 5500000, surgery: 11000000, liability: 100000000, mriCt: 3500000, hospitalization: 5500000, dental: 800000 },
      coinsurance: '90%', copay: '없음', maxAge: 12, waitingPeriod: '14일',
      features: ['슬개골 특화 보장', '12세까지만 가입 가능', '통원 무제한 보장', '암 보장 (특약)', '응급 실비 보장'],
      strengths: ['슬개골 특화', '중장년 친화', '통원 무제한'],
      weaknesses: ['보험료 변동성', '12세 제한'],
      priority: 'balanced'
    },
    {
      id: 4, name: '현대해상', product: '굿앤굿우리펫', logo: '🏆', marketShare: '4위',
      rating: 4.5, reviews: 1420,
      monthlyPremium: { young: 26000, middle: 29000, senior: 40000 },
      coverage: { medical: 5000000, surgery: 10000000, liability: 100000000, mriCt: 2500000, hospitalization: 5000000, dental: 500000 },
      coinsurance: '100%', copay: '없음', maxAge: 14, waitingPeriod: '14일',
      features: ['가성비 우수', '100% 보장 (면책금 없음)', '제휴병원 1500+', '환급금 (계약금 30% 반환)', '빠른 심사 (3일 이내)'],
      strengths: ['가성비', '100% 보장', '환급금'],
      weaknesses: ['MRI/CT 낮음', '갱신비 높음'],
      priority: 'budget'
    },
    {
      id: 5, name: 'KB손해보험', product: '금쪽같은펫', logo: '👑', marketShare: '5위',
      rating: 4.9, reviews: 2100,
      monthlyPremium: { young: 30000, middle: 35000, senior: 48000 },
      coverage: { medical: 6000000, surgery: 12000000, liability: 100000000, mriCt: 5000000, hospitalization: 6000000, dental: 1000000 },
      coinsurance: '90%', copay: '없음', maxAge: 15, waitingPeriod: '14일',
      features: ['MRI/CT 최고 (500만원)', '대형견 특화 (15kg 이상)', '통원 무제한 보장', '암 보장 (특약)', '응급 수술비 추가 (50%)'],
      strengths: ['MRI/CT 최고', '대형견 친화', '최고 평점'],
      weaknesses: ['보험료 높음', '대형견만 추천'],
      priority: 'comprehensive'
    },
    {
      id: 6, name: '한화손해보험', product: 'Signature Pet', logo: '✨', marketShare: '신상품',
      rating: 4.3, reviews: 340,
      monthlyPremium: { young: 32000, middle: 36000, senior: 50000 },
      coverage: { medical: 5500000, surgery: 11000000, liability: 100000000, mriCt: 3000000, hospitalization: 5500000, dental: 900000 },
      coinsurance: '90%', copay: '없음', maxAge: 16, waitingPeriod: '21일',
      features: ['2026년 신상품', '프리미엄 서비스', '전문가 상담 포함', '맞춤 설계 가능', '통원 무제한'],
      strengths: ['신상품', '프리미엄', '고령견 16세'],
      weaknesses: ['보험료 높음', '검증 부족', '대기기간 길음'],
      priority: 'comprehensive'
    },
    {
      id: 7, name: '농협손해보험', product: 'NH가성비굿', logo: '🌾', marketShare: '신상품',
      rating: 4.4, reviews: 580,
      monthlyPremium: { young: 26000, middle: 28000, senior: 36000 },
      coverage: { medical: 4800000, surgery: 9500000, liability: 150000000, mriCt: 2000000, hospitalization: 4800000, dental: 600000 },
      coinsurance: '90%', copay: '없음', maxAge: 14, waitingPeriod: '14일',
      features: ['배상책임 최고 (1.5억)', '가성비 우수', '제휴병원 1800+', '빠른 청구 (5일 이내)', '통원 일 한도 (100만원)'],
      strengths: ['배상책임 최고', '가성비', '빠른 청구'],
      weaknesses: ['MRI/CT 낮음', '보장 제약'],
      priority: 'budget'
    },
    {
      id: 8, name: '롯데손해보험', product: 'let:click', logo: '🎯', marketShare: '신상품',
      rating: 4.2, reviews: 420,
      monthlyPremium: { young: 24000, middle: 27000, senior: 34000 },
      coverage: { medical: 4500000, surgery: 9000000, liability: 80000000, mriCt: 2000000, hospitalization: 4500000, dental: 400000 },
      coinsurance: '90%', copay: '없음', maxAge: 13, waitingPeriod: '14일',
      features: ['최저가 보험료', '간편한 온라인 가입', '온라인 우대 (5% 추가할인)', '빠른 심사 (당일 심사)', '수술 특약 (50% 추가)'],
      strengths: ['최저가', '간편', '빠른 심사'],
      weaknesses: ['보장 낮음', '배상책임 낮음', '평점 낮음'],
      priority: 'budget'
    }
  ];

  const filteredAndSortedCompanies = useMemo(() => {
    let filtered = insuranceCompanies;
    if (filterPriority !== 'all') {
      filtered = filtered.filter(company => company.priority === filterPriority);
    }
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'premium': return a.monthlyPremium.middle - b.monthlyPremium.middle;
        case 'rating': return b.rating - a.rating;
        case 'coverage': return (b.coverage.medical + b.coverage.surgery) - (a.coverage.medical + a.coverage.surgery);
        default: return 0;
      }
    });
    return sorted;
  }, [filterPriority, sortBy]);

  const displayedCompanies = filteredAndSortedCompanies.slice(0, 8);

  const toggleCompanySelection = (id) => {
    setSelectedCompanies(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">🔍 8개 보험사 상세 비교</h1>
          <p className="text-lg text-gray-600">보험료, 보장 내용, 평점 등 모든 정보를 한눈에 비교하세요</p>
          <p className="text-sm text-gray-500 mt-2">⚠️ 본 정보는 2026년 2월 기준이며, 변경될 수 있습니다</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">우선순위 필터</label>
              <div className="flex gap-2 flex-wrap">
                {[
                  { value: 'all', label: '🔄 모두 보기' },
                  { value: 'budget', label: '💰 경제형' },
                  { value: 'balanced', label: '⚖️ 균형형' },
                  { value: 'comprehensive', label: '🛡️ 보장형' }
                ].map(option => (
                  <button
                    key={option.value}
                    onClick={() => setFilterPriority(option.value)}
                    className={`px-4 py-2 rounded-lg transition font-semibold ${
                      filterPriority === option.value ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">정렬</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none">
                <option value="premium">💵 보험료 낮은 순</option>
                <option value="rating">⭐ 평점 높은 순</option>
                <option value="coverage">🛡️ 보장액 높은 순</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {displayedCompanies.map(company => (
            <div key={company.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition">
              <div onClick={() => setExpandedRow(expandedRow === company.id ? null : company.id)}
                className="p-6 cursor-pointer hover:bg-gray-50 transition">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                  <div className="md:col-span-2">
                    <div className="flex items-center gap-3">
                      <input type="checkbox" checked={selectedCompanies.includes(company.id)}
                        onChange={() => toggleCompanySelection(company.id)} className="w-5 h-5 rounded" />
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">{company.logo} {company.name}</h3>
                        <p className="text-sm text-gray-600">{company.product}</p>
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-500">{company.rating.toFixed(1)}</div>
                    <p className="text-xs text-gray-600">{company.reviews}개 리뷰</p>
                  </div>

                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">{(company.monthlyPremium.middle / 1000).toFixed(0)}k원</div>
                    <p className="text-xs text-gray-600">월보험료 (3세)</p>
                  </div>

                  <div className="text-center">
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition">
                      {expandedRow === company.id ? '▲ 닫기' : '▼ 상세'}
                    </button>
                  </div>
                </div>
              </div>

              {expandedRow === company.id && (
                <div className="border-t border-gray-200 p-6 bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-lg font-bold text-gray-800 mb-4">🛡️ 보장 내용</h4>
                      <div className="space-y-3">
                        {[
                          { label: '의료비', value: company.coverage.medical },
                          { label: '수술비', value: company.coverage.surgery },
                          { label: '배상책임', value: company.coverage.liability },
                          { label: 'MRI/CT', value: company.coverage.mriCt },
                          { label: '입원비', value: company.coverage.hospitalization },
                          { label: '치과', value: company.coverage.dental }
                        ].map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center">
                            <span className="text-gray-700">{item.label}</span>
                            <span className="font-bold text-blue-600">{(item.value / 1000000).toFixed(1)}백만원</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-bold text-gray-800 mb-4">📋 가입 조건</h4>
                      <div className="space-y-2 mb-6">
                        <div className="flex justify-between">
                          <span className="text-gray-700">보험료 (1세)</span>
                          <span className="font-bold">{(company.monthlyPremium.young / 1000).toFixed(0)}k원</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-700">보험료 (7세 이상)</span>
                          <span className="font-bold">{(company.monthlyPremium.senior / 1000).toFixed(0)}k원</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-700">최대 가입 나이</span>
                          <span className="font-bold">{company.maxAge}세</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-700">대기 기간</span>
                          <span className="font-bold">{company.waitingPeriod}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-700">공제율</span>
                          <span className="font-bold">{company.coinsurance}</span>
                        </div>
                      </div>

                      <h4 className="text-lg font-bold text-gray-800 mb-4">⭐ 특징</h4>
                      <ul className="space-y-2">
                        {company.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                            <span className="text-blue-500 mt-1">✓</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-bold text-green-600 mb-2">✅ 강점</h5>
                      <ul className="text-sm space-y-1">
                        {company.strengths.map((strength, idx) => (<li key={idx} className="text-gray-700">• {strength}</li>))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-bold text-orange-600 mb-2">⚠️ 약점</h5>
                      <ul className="text-sm space-y-1">
                        {company.weaknesses.map((weakness, idx) => (<li key={idx} className="text-gray-700">• {weakness}</li>))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {selectedCompanies.length > 0 && (
          <div className="fixed bottom-6 right-6 bg-blue-500 text-white px-6 py-3 rounded-full shadow-lg font-bold">
            {selectedCompanies.length}개 선택됨
          </div>
        )}

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-12">
          <p className="text-sm text-gray-700">
            <strong>⚠️ 면책 공고:</strong> 본 정보는 펫보험 가입을 권유하는 것이 아니며, 정보 제공 목적입니다. 정확한 가입 조건과 보장 내용은 각 보험사에 문의하시기 바랍니다.
          </p>
        </div>
      </div>
    </div>
  );
};

export default InsuranceComparison;
