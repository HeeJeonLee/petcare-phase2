// src/components/AdvancedFilter.jsx
// 고급 필터링 - 견종, 건강상태, 우선순위 (400줄)

import React, { useState, useMemo } from 'react';

const AdvancedFilter = () => {
  const [selectedBreeds, setSelectedBreeds] = useState([]);
  const [selectedHealth, setSelectedHealth] = useState([]);
  const [selectedPriority, setSelectedPriority] = useState('balanced');
  const [priceRange, setPriceRange] = useState([15000, 50000]);
  const [renewalAge, setRenewalAge] = useState(15);
  const [sortBy, setSortBy] = useState('relevance');

  // 견종 옵션
  const breeds = [
    { id: 'maltese', name: '말티즈', icon: '🐕', size: 'small', avgCost: 22000 },
    { id: 'poodle', name: '푸들', icon: '🐩', size: 'small', avgCost: 24000 },
    { id: 'beagle', name: '비글', icon: '🐕', size: 'medium', avgCost: 26000 },
    { id: 'shiba', name: '시바견', icon: '🐕', size: 'medium', avgCost: 25000 },
    { id: 'yorkie', name: '요크셔테리어', icon: '🐕', size: 'small', avgCost: 23000 },
    { id: 'cat', name: '고양이', icon: '🐱', size: 'small', avgCost: 20000 },
    { id: 'other', name: '기타', icon: '🦮', size: 'various', avgCost: 25000 }
  ];

  // 건강상태 (다중선택)
  const healthConditions = [
    { id: 'knee', name: '슬개골 탈구', impact: 'high', color: 'red' },
    { id: 'skin', name: '피부질환', impact: 'medium', color: 'yellow' },
    { id: 'dental', name: '치과질환', impact: 'medium', color: 'blue' },
    { id: 'ear', name: '귀염증', impact: 'low', color: 'orange' },
    { id: 'obesity', name: '비만', impact: 'medium', color: 'pink' },
    { id: 'joint', name: '관절염', impact: 'high', color: 'purple' },
    { id: 'cataract', name: '백내장', impact: 'medium', color: 'indigo' },
    { id: 'heart', name: '심장질환', impact: 'high', color: 'crimson' }
  ];

  // 우선순위 옵션
  const priorities = [
    {
      id: 'economical',
      name: '💰 저비용형',
      desc: '월 보험료 최소화',
      companies: ['롯데', '농협', '메리츠'],
      avgCost: 20000
    },
    {
      id: 'balanced',
      name: '⚖️ 균형형',
      desc: '보험료 vs 보장 최적화',
      companies: ['메리츠', 'DB', '현대'],
      avgCost: 26000
    },
    {
      id: 'medical',
      name: '🏥 수술특화형',
      desc: '수술비 우선',
      companies: ['KB', '한화', 'DB'],
      avgCost: 32000
    },
    {
      id: 'dental',
      name: '🦷 치과특화형',
      desc: '치과 보장 우선',
      companies: ['삼성', 'DB', '메리츠'],
      avgCost: 28000
    },
    {
      id: 'comprehensive',
      name: '🛡️ 고보장형',
      desc: '보장금액 최대화',
      companies: ['KB', '한화', '삼성'],
      avgCost: 35000
    }
  ];

  // 보험사 데이터
  const insuranceCompanies = [
    {
      id: 'meritz',
      name: '메리츠화재',
      product: '펫퍼민트',
      premium: 25000,
      coverage: 5000000,
      renewal: 20,
      score: 92,
      match: 0,
      features: ['슬개골특화', '제휴병원2000+', '자동청구', '15세까지'],
      suitableFor: ['maltese', 'poodle', 'shiba', 'knee', 'balanced']
    },
    {
      id: 'samsung',
      name: '삼성화재',
      product: '위풍댕댕',
      premium: 28000,
      coverage: 4500000,
      renewal: 22,
      score: 88,
      match: 0,
      features: ['치과특화', '다견할인', '고령견가능', '통증보장'],
      suitableFor: ['poodle', 'dental', 'balanced', 'comprehensive']
    },
    {
      id: 'db',
      name: 'DB손해보험',
      product: '펫블리',
      premium: 26000,
      coverage: 5500000,
      renewal: 18,
      score: 90,
      match: 0,
      features: ['슬개골특화', '12세까지', '통원보장', '암보장'],
      suitableFor: ['beagle', 'knee', 'joint', 'balanced', 'medical']
    },
    {
      id: 'hyundai',
      name: '현대해상',
      product: '굿앤굿우리펫',
      premium: 29000,
      coverage: 5000000,
      renewal: 21,
      score: 87,
      match: 0,
      features: ['가성비우수', '100%보장', '제휴병원', '환급금'],
      suitableFor: ['balanced', 'economical', 'yorkie']
    },
    {
      id: 'kb',
      name: 'KB손해보험',
      product: '금쪽같은펫',
      premium: 35000,
      coverage: 6000000,
      renewal: 25,
      score: 89,
      match: 0,
      features: ['MRI/CT최고', '대형견친화', '통원무제한', '암보장'],
      suitableFor: ['medical', 'comprehensive', 'knee', 'joint']
    },
    {
      id: 'hanwha',
      name: '한화손해보험',
      product: 'Signature Pet',
      premium: 32000,
      coverage: 5500000,
      renewal: 24,
      score: 86,
      match: 0,
      features: ['신상품', '프리미엄서비스', '전문가상담', '맞춤설계'],
      suitableFor: ['comprehensive', 'medical', 'balanced']
    },
    {
      id: 'nonghyup',
      name: '농협손해보험',
      product: 'NH가성비굿',
      premium: 28000,
      coverage: 4800000,
      renewal: 20,
      score: 85,
      match: 0,
      features: ['배상책임최고', '가성비', '제휴병원', '빠른청구'],
      suitableFor: ['economical', 'balanced', 'other']
    },
    {
      id: 'lotte',
      name: '롯데손해보험',
      product: 'let:click',
      premium: 24000,
      coverage: 4500000,
      renewal: 18,
      score: 82,
      match: 0,
      features: ['저렴', '간편가입', '온라인우대', '빠른심사'],
      suitableFor: ['economical', 'yorkie', 'cat']
    }
  ];

  // 필터링 로직
  const calculateMatchScore = (company) => {
    let score = 0;

    // 1. 우선순위 매칭 (40%)
    const priorityConfig = priorities.find(p => p.id === selectedPriority);
    if (priorityConfig && priorityConfig.companies.includes(company.name.split('손')[0])) {
      score += 40;
    }

    // 2. 건강상태 매칭 (30%)
    if (selectedHealth.length > 0) {
      const healthMatches = selectedHealth.filter(h => 
        company.suitableFor.includes(h)
      ).length;
      score += (healthMatches / selectedHealth.length) * 30;
    } else {
      score += 30;
    }

    // 3. 가격대 매칭 (20%)
    if (company.premium >= priceRange[0] && company.premium <= priceRange[1]) {
      score += 20;
    } else if (company.premium > priceRange[1]) {
      score += (priceRange[1] / company.premium) * 15;
    }

    // 4. 갱신한도 매칭 (10%)
    if (company.renewal >= renewalAge) {
      score += 10;
    } else {
      score += (company.renewal / renewalAge) * 8;
    }

    return Math.round(score);
  };

  // 필터링된 보험사 계산
  const filteredCompanies = useMemo(() => {
    let companies = insuranceCompanies.map(c => ({
      ...c,
      match: calculateMatchScore(c)
    }));

    // 정렬
    if (sortBy === 'score') {
      companies.sort((a, b) => b.match - a.match);
    } else if (sortBy === 'price') {
      companies.sort((a, b) => a.premium - b.premium);
    } else if (sortBy === 'coverage') {
      companies.sort((a, b) => b.coverage - a.coverage);
    } else {
      companies.sort((a, b) => b.match - a.match);
    }

    return companies;
  }, [selectedPriority, selectedHealth, priceRange, renewalAge, sortBy]);

  // 토글 함수
  const toggleBreed = (breedId) => {
    setSelectedBreeds(prev =>
      prev.includes(breedId)
        ? prev.filter(b => b !== breedId)
        : [...prev, breedId]
    );
  };

  const toggleHealth = (healthId) => {
    setSelectedHealth(prev =>
      prev.includes(healthId)
        ? prev.filter(h => h !== healthId)
        : [...prev, healthId]
    );
  };

  const resetFilters = () => {
    setSelectedBreeds([]);
    setSelectedHealth([]);
    setSelectedPriority('balanced');
    setPriceRange([15000, 50000]);
    setRenewalAge(15);
    setSortBy('relevance');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">🔍 고급 필터링</h1>
          <p className="text-lg text-gray-600">7가지 필터로 최적의 보험사를 찾아보세요</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 필터 패널 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6 space-y-6">
              {/* 견종 필터 */}
              <div>
                <h3 className="font-bold text-gray-800 mb-3">🐕 견종/묘종 (7가지)</h3>
                <div className="space-y-2">
                  {breeds.map(breed => (
                    <label key={breed.id} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedBreeds.includes(breed.id)}
                        onChange={() => toggleBreed(breed.id)}
                        className="w-4 h-4 rounded border-gray-300"
                      />
                      <span className="text-sm text-gray-700">{breed.icon} {breed.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 건강상태 필터 */}
              <div>
                <h3 className="font-bold text-gray-800 mb-3">🏥 건강상태 (8가지)</h3>
                <div className="space-y-2">
                  {healthConditions.map(health => (
                    <label key={health.id} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedHealth.includes(health.id)}
                        onChange={() => toggleHealth(health.id)}
                        className="w-4 h-4 rounded border-gray-300"
                      />
                      <span className="text-sm text-gray-700">{health.name}</span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded text-white ${
                        health.impact === 'high' ? 'bg-red-500' :
                        health.impact === 'medium' ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}>
                        {health.impact === 'high' ? '높음' : health.impact === 'medium' ? '중간' : '낮음'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 우선순위 필터 */}
              <div>
                <h3 className="font-bold text-gray-800 mb-3">⭐ 우선순위 (5가지)</h3>
                <div className="space-y-2">
                  {priorities.map(priority => (
                    <button
                      key={priority.id}
                      onClick={() => setSelectedPriority(priority.id)}
                      className={`w-full text-left p-3 rounded-lg border-2 transition ${
                        selectedPriority === priority.id
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <p className="font-semibold text-sm text-gray-800">{priority.name}</p>
                      <p className="text-xs text-gray-600">{priority.desc}</p>
                      <p className="text-xs text-blue-600 font-bold mt-1">월 {(priority.avgCost / 10000).toFixed(0)}만원대</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* 리셋 버튼 */}
              <button
                onClick={resetFilters}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg font-semibold transition"
              >
                🔄 초기화
              </button>
            </div>
          </div>

          {/* 결과 패널 */}
          <div className="lg:col-span-3">
            {/* 고급 필터 (슬라이더) */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">⚙️ 고급 필터</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 월 보험료 범위 */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    💰 월 보험료: <span className="text-blue-600">{(priceRange[0] / 10000).toFixed(0)}~{(priceRange[1] / 10000).toFixed(0)}만원</span>
                  </label>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="15000"
                      max="50000"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                      className="w-full"
                    />
                    <input
                      type="range"
                      min="15000"
                      max="50000"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      className="w-full"
                    />
                  </div>
                </div>

                {/* 최소 갱신 한도 */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    🎂 최소 갱신 한도: <span className="text-blue-600">{renewalAge}세까지</span>
                  </label>
                  <input
                    type="range"
                    min="12"
                    max="25"
                    value={renewalAge}
                    onChange={(e) => setRenewalAge(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* 정렬 및 결과 정보 */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="text-sm text-gray-600">
                  <strong>{filteredCompanies.length}</strong>개의 보험사 검색됨
                </p>
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="relevance">관련성 순</option>
                <option value="score">점수 높은 순</option>
                <option value="price">가격 낮은 순</option>
                <option value="coverage">보장 많은 순</option>
              </select>
            </div>

            {/* 검색 결과 */}
            <div className="space-y-4">
              {filteredCompanies.map((company, idx) => (
                <div
                  key={company.id}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition p-6 border-l-4"
                  style={{
                    borderLeftColor: `rgb(${Math.min(255, company.match * 2)}, ${Math.min(company.match * 2, 150)}, 100)`
                  }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* 회사 정보 */}
                    <div>
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm text-gray-600 mr-2">
                            {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : '•'}
                          </p>
                          <p className="font-bold text-lg text-gray-800">{company.name}</p>
                          <p className="text-sm text-gray-600">{company.product}</p>
                        </div>
                      </div>
                      <div className="mt-3 flex gap-2 flex-wrap">
                        {company.features.slice(0, 2).map((feature, i) => (
                          <span key={i} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* 상세 정보 */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600 mb-1">월 보험료</p>
                        <p className="font-bold text-lg text-gray-800">{(company.premium / 10000).toFixed(0)}만₩</p>
                      </div>
                      <div>
                        <p className="text-gray-600 mb-1">기본 보장</p>
                        <p className="font-bold text-lg text-gray-800">{(company.coverage / 1000000).toFixed(1)}백만</p>
                      </div>
                      <div>
                        <p className="text-gray-600 mb-1">갱신 한도</p>
                        <p className="font-bold text-lg text-gray-800">{company.renewal}세</p>
                      </div>
                      <div>
                        <p className="text-gray-600 mb-1">만족도</p>
                        <p className="font-bold text-lg text-gray-800">⭐ {company.score}</p>
                      </div>
                    </div>

                    {/* 매칭 점수 */}
                    <div className="flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4">
                      <p className="text-4xl font-bold text-blue-600">{company.match}</p>
                      <p className="text-xs text-gray-600 mt-2">매칭 점수</p>
                      <div className="w-full bg-gray-300 rounded-full h-2 mt-3 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-600 h-full transition-all"
                          style={{ width: `${company.match}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 필터 설명 */}
        <div className="mt-12 bg-blue-50 border-l-4 border-blue-400 p-6 rounded-lg">
          <h3 className="font-bold text-blue-800 mb-3">📌 필터 설명</h3>
          <ul className="text-sm text-blue-700 space-y-2">
            <li>• <strong>동적 점수:</strong> 우선순위(40%) + 건강상태(30%) + 예산(20%) + 갱신한도(10%)</li>
            <li>• <strong>상위 3개:</strong> 점수가 높은 순서대로 자동 추천</li>
            <li>• <strong>다중선택 가능:</strong> 견종과 건강상태는 여러 개 선택 가능</li>
            <li>• <strong>우선순위:</strong> 경제형/균형형/수술특화/치과특화/고보장형 중 선택</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdvancedFilter;
