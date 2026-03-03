// src/components/HealthCalculator.jsx
// 건강 계산기 - 월 의료비 자동 계산 (294줄)

import React, { useState, useMemo } from 'react';

const HealthCalculator = () => {
  const [petAge, setPetAge] = useState(5);
  const [petType, setPetType] = useState('dog');
  const [petWeight, setPetWeight] = useState(10);
  const [healthCondition, setHealthCondition] = useState('healthy');
  const [vetFrequency, setVetFrequency] = useState('quarterly');
  const [chronicDiseases, setChronicDiseases] = useState([]);

  // 질병 옵션
  const diseaseOptions = [
    { id: 'knee', label: '🦵 슬개골 탈구', monthlyCost: 150000 },
    { id: 'skin', label: '🔴 피부질환', monthlyCost: 80000 },
    { id: 'dental', label: '🦷 치과질환', monthlyCost: 120000 },
    { id: 'ear', label: '👂 귀염증', monthlyCost: 60000 },
    { id: 'obesity', label: '⚖️ 비만', monthlyCost: 70000 },
    { id: 'joint', label: '🦴 관절염', monthlyCost: 100000 },
    { id: 'cataract', label: '👁️ 백내장', monthlyCost: 110000 },
    { id: 'heart', label: '❤️ 심장질환', monthlyCost: 200000 }
  ];

  // 건강 상태별 진료비
  const healthCosts = {
    healthy: 250000,    // 월 25만원 (예방접종, 건강검진)
    normal: 500000,     // 월 50만원 (간단한 질병)
    concern: 1000000,   // 월 100만원 (어느 정도 질병)
    serious: 2000000    // 월 200만원 (심각한 질병)
  };

  // 동물별 기본 진료비 계수
  const typeCostMultiplier = {
    dog: 1.0,
    cat: 0.85,
    rabbit: 0.7,
    bird: 0.5
  };

  // 나이별 진료비 계수
  const getAgeMultiplier = (age) => {
    if (age <= 3) return 0.8;      // 어린 동물 10% 적게
    if (age <= 7) return 1.0;      // 기준
    if (age <= 10) return 1.3;     // 중년 30% 많이
    if (age <= 12) return 1.6;     // 고령 60% 많이
    return 2.0;                    // 매우 고령 100% 많이
  };

  // 몸무게별 치료비 계수
  const getWeightMultiplier = (weight) => {
    if (weight < 5) return 0.6;    // 초소형
    if (weight < 10) return 0.8;   // 소형
    if (weight < 20) return 1.0;   // 중형
    if (weight < 30) return 1.2;   // 대형
    return 1.4;                    // 초대형
  };

  // 병원 방문 빈도별 계수
  const frequencyMultiplier = {
    monthly: 12,
    quarterly: 4,
    semiAnnual: 2,
    annual: 1,
    rare: 0.5
  };

  // 질병 토글
  const toggleDisease = (diseaseId) => {
    setChronicDiseases(prev =>
      prev.includes(diseaseId)
        ? prev.filter(d => d !== diseaseId)
        : [...prev, diseaseId]
    );
  };

  // 계산 로직
  const calculation = useMemo(() => {
    // 1. 기본 진료비
    let baseCost = healthCosts[healthCondition];

    // 2. 나이 계수 적용
    const ageMultiplier = getAgeMultiplier(petAge);
    baseCost *= ageMultiplier;

    // 3. 동물 종류 계수 적용
    const typeMultiplier = typeCostMultiplier[petType];
    baseCost *= typeMultiplier;

    // 4. 몸무게 계수 적용
    const weightMultiplier = getWeightMultiplier(petWeight);
    baseCost *= weightMultiplier;

    // 5. 만성질환 추가 비용
    const chronicCost = chronicDiseases.reduce((total, diseaseId) => {
      const disease = diseaseOptions.find(d => d.id === diseaseId);
      return total + (disease?.monthlyCost || 0);
    }, 0);

    const totalMonthlyCost = baseCost + chronicCost;

    // 6. 월 방문 횟수별 예상 청구
    const annualCost = totalMonthlyCost * 12;
    const insuredAmount = Math.ceil(totalMonthlyCost / 100000) * 100000; // 10만원 단위로 올림

    // 7. 보험료 추천 (청구액의 50-70%)
    const recommendedPremium = {
      economical: Math.ceil(insuredAmount * 0.5 / 1000) * 1000,
      balanced: Math.ceil((totalMonthlyCost * 12) * 0.6 / 1000) * 1000,
      comprehensive: Math.ceil((totalMonthlyCost * 12) * 0.8 / 1000) * 1000
    };

    return {
      baseCost: Math.round(baseCost),
      chronicCost: Math.round(chronicCost),
      totalMonthlyCost: Math.round(totalMonthlyCost),
      annualCost: Math.round(annualCost),
      insuredAmount,
      recommendedPremium,
      ageMultiplier: (ageMultiplier * 100).toFixed(0),
      weightMultiplier: (weightMultiplier * 100).toFixed(0)
    };
  }, [petAge, petType, petWeight, healthCondition, chronicDiseases]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">💚 월 의료비 계산기</h1>
          <p className="text-lg text-gray-600">반려동물의 월 예상 진료비와 필요한 보험료를 계산하세요</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 입력 패널 */}
          <div className="lg:col-span-1 bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">📋 반려동물 정보</h2>

            {/* 나이 */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                🎂 나이: <span className="text-2xl text-green-600">{petAge}세</span>
              </label>
              <input
                type="range"
                min="1"
                max="20"
                value={petAge}
                onChange={(e) => setPetAge(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1세</span>
                <span>20세</span>
              </div>
            </div>

            {/* 종류 */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">🐾 종류</label>
              <select
                value={petType}
                onChange={(e) => setPetType(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
              >
                <option value="dog">🐕 강아지</option>
                <option value="cat">🐱 고양이</option>
                <option value="rabbit">🐰 토끼</option>
                <option value="bird">🦜 새</option>
              </select>
            </div>

            {/* 몸무게 */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                ⚖️ 몸무게: <span className="text-2xl text-green-600">{petWeight}kg</span>
              </label>
              <input
                type="range"
                min="1"
                max="50"
                value={petWeight}
                onChange={(e) => setPetWeight(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1kg</span>
                <span>50kg</span>
              </div>
            </div>

            {/* 건강 상태 */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">❤️ 건강 상태</label>
              <select
                value={healthCondition}
                onChange={(e) => setHealthCondition(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
              >
                <option value="healthy">💪 매우 건강함 (예방접종만)</option>
                <option value="normal">😊 보통 (가끔 감기/소화 문제)</option>
                <option value="concern">😟 관심 필요 (만성질환 있음)</option>
                <option value="serious">🚨 심각 (자주 치료 필요)</option>
              </select>
            </div>

            {/* 만성질환 선택 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">🏥 만성질환 (중복선택)</label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {diseaseOptions.map(disease => (
                  <label key={disease.id} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={chronicDiseases.includes(disease.id)}
                      onChange={() => toggleDisease(disease.id)}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-700 flex-1">{disease.label}</span>
                    <span className="text-xs text-red-600 font-semibold">
                      +{(disease.monthlyCost / 10000).toFixed(0)}만
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* 결과 패널 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 주요 계산 결과 */}
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-2xl shadow-lg p-8">
              <h3 className="text-lg font-semibold mb-6 opacity-90">📊 월 예상 진료비</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm opacity-75 mb-1">기본 진료비</p>
                  <p className="text-3xl font-bold">{(calculation.baseCost / 10000).toFixed(1)}만₩</p>
                </div>
                <div>
                  <p className="text-sm opacity-75 mb-1">만성질환 비용</p>
                  <p className="text-3xl font-bold">{(calculation.chronicCost / 10000).toFixed(1)}만₩</p>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-white border-opacity-30">
                <p className="text-sm opacity-75 mb-2">총 월 예상 청구액</p>
                <p className="text-5xl font-bold">{(calculation.totalMonthlyCost / 10000).toFixed(0)}만₩</p>
              </div>
            </div>

            {/* 연간 비용 분석 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-lg">
                <p className="text-sm font-semibold text-blue-700 mb-2">📈 연간 총 진료비</p>
                <p className="text-3xl font-bold text-blue-600">{(calculation.annualCost / 1000000).toFixed(1)}백만₩</p>
                <p className="text-xs text-blue-600 mt-2">월 {(calculation.totalMonthlyCost / 10000).toFixed(0)}만원 × 12개월</p>
              </div>

              <div className="bg-purple-50 border-l-4 border-purple-400 p-6 rounded-lg">
                <p className="text-sm font-semibold text-purple-700 mb-2">💰 권장 보험료 (월)</p>
                <div className="space-y-2">
                  <p className="text-sm text-purple-600">
                    💵 경제형: <span className="font-bold text-lg">{(calculation.recommendedPremium.economical / 10000).toFixed(0)}만₩</span>
                  </p>
                  <p className="text-sm text-purple-600">
                    ⭐ 균형형: <span className="font-bold text-lg">{(calculation.recommendedPremium.balanced / 10000).toFixed(0)}만₩</span>
                  </p>
                  <p className="text-sm text-purple-600">
                    🛡️ 보장형: <span className="font-bold text-lg">{(calculation.recommendedPremium.comprehensive / 10000).toFixed(0)}만₩</span>
                  </p>
                </div>
              </div>
            </div>

            {/* 세부 계산 요소 */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-800 mb-4">🔍 계산 요소 분석</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-3 rounded border border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">나이 계수</p>
                  <p className="text-xl font-bold text-gray-800">{calculation.ageMultiplier}%</p>
                  <p className="text-xs text-gray-600 mt-1">기본 대비</p>
                </div>
                <div className="bg-white p-3 rounded border border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">몸무게 계수</p>
                  <p className="text-xl font-bold text-gray-800">{calculation.weightMultiplier}%</p>
                  <p className="text-xs text-gray-600 mt-1">기본 대비</p>
                </div>
                <div className="bg-white p-3 rounded border border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">보험추천액</p>
                  <p className="text-xl font-bold text-green-600">{(calculation.insuredAmount / 10000).toFixed(0)}만₩</p>
                  <p className="text-xs text-gray-600 mt-1">라운드업</p>
                </div>
                <div className="bg-white p-3 rounded border border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">절감률</p>
                  <p className="text-xl font-bold text-blue-600">40-60%</p>
                  <p className="text-xs text-gray-600 mt-1">보험 가입 시</p>
                </div>
              </div>
            </div>

            {/* 조언 */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>💡 조언:</strong> 현재 계산 결과 월 {(calculation.totalMonthlyCost / 10000).toFixed(0)}만원의 진료비가 예상됩니다.
                {chronicDiseases.length > 0 && ` 만성질환이 있으므로 보장 범위가 잘 맞는 상품을 선택하세요.`}
                {petAge > 10 && ` 고령견이므로 갱신 한도가 높은 상품을 추천합니다.`}
              </p>
            </div>
          </div>
        </div>

        {/* 계산 공식 설명 */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-6">
          <h3 className="font-bold text-gray-800 mb-4">📐 계산 공식</h3>
          <div className="text-sm text-gray-700 space-y-2">
            <p>
              <strong>총 월 진료비</strong> = 기본 진료비 × 나이 계수 × 종류 계수 × 몸무게 계수 + 만성질환 비용
            </p>
            <p>
              <strong>권장 보험료</strong> = 월 진료비 × 12개월 × 보장 비율 (50-80%)
            </p>
            <p className="text-xs text-gray-600 mt-4">
              🔔 주의: 이 계산기는 예상치입니다. 실제 진료비는 의료기관, 치료 내용, 질병 진행도에 따라 다를 수 있습니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthCalculator;
