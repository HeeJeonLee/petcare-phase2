// src/components/AIRecommendation.jsx
// AI 기반 맞춤형 펫보험 추천 시스템
// 서버사이드 API를 통해 Claude AI 호출 (CORS 해결)

import React, { useState } from 'react';

const AIRecommendation = () => {
  const [step, setStep] = useState(1); // 1: 정보수집, 2: 분석중, 3: 결과
  const [formData, setFormData] = useState({
    petName: '',
    petType: 'dog',
    petAge: '',
    breed: '',
    weight: '',
    gender: 'male',
    hasChronicDisease: false,
    chronicDiseaseDetails: '',
    budget: 50000,
    priority: 'balanced',
    veterinaryExperience: 'none',
    location: ''
  });

  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const insuranceDatabase = {
    meritz: {
      name: '메리츠화재',
      product: '펫퍼민트',
      marketShare: '1위',
      monthlyPremium: { young: 22000, middle: 25000, senior: 38000 },
      coverage: { medical: 5000000, surgery: 10000000, liability: 100000000, mriCt: 3000000 },
      features: ['슬개골 특화', '제휴병원 2000+', '자동청구', '15세까지'],
      strength: ['점유율 1위', '병원 많음'],
      weakness: ['슬개골 1년 면책', '보장 제약']
    },
    samsung: {
      name: '삼성화재',
      product: '위풍댕댕',
      monthlyPremium: { young: 28000, middle: 32000, senior: 42000 },
      coverage: { medical: 4500000, surgery: 9000000, liability: 100000000, mriCt: 2500000 },
      features: ['치과 특화', '다견할인', '고령견 가능', '통증 보장'],
      strength: ['치과 보장', '다견 할인'],
      weakness: ['보험료 높음', '보장 낮음']
    },
    db: {
      name: 'DB손해보험',
      product: '펫블리',
      monthlyPremium: { young: 23000, middle: 26000, senior: 35000 },
      coverage: { medical: 5500000, surgery: 11000000, liability: 100000000, mriCt: 3500000 },
      features: ['슬개골 특화', '12세까지 가입', '통원 보장', '암 보장'],
      strength: ['슬개골 특화', '중장년 친화'],
      weakness: ['보험료 변동', '12세 제한']
    },
    hyundai: {
      name: '현대해상',
      product: '굿앤굿우리펫',
      monthlyPremium: { young: 26000, middle: 29000, senior: 40000 },
      coverage: { medical: 5000000, surgery: 10000000, liability: 100000000, mriCt: 2500000 },
      features: ['가성비 우수', '100% 보장', '제휴병원', '환급금'],
      strength: ['가성비', '100% 보장'],
      weakness: ['MRI/CT 낮음', '갱신비 높음']
    },
    kb: {
      name: 'KB손해보험',
      product: '금쪽같은펫',
      monthlyPremium: { young: 30000, middle: 35000, senior: 48000 },
      coverage: { medical: 6000000, surgery: 12000000, liability: 100000000, mriCt: 5000000 },
      features: ['MRI/CT 최고', '대형견 친화', '통원 무제한', '암 보장'],
      strength: ['MRI/CT 최고', '대형견'],
      weakness: ['보험료 높음', '대형견만']
    },
    hanwha: {
      name: '한화손해보험',
      product: 'Signature Pet',
      monthlyPremium: { young: 32000, middle: 36000, senior: 50000 },
      coverage: { medical: 5500000, surgery: 11000000, liability: 100000000, mriCt: 3000000 },
      features: ['신상품 2026', '프리미엄 서비스', '전문가상담', '맞춤설계'],
      strength: ['신상품', '프리미엄'],
      weakness: ['보험료 높음', '검증 부족']
    },
    nonghyup: {
      name: '농협손해보험',
      product: 'NH가성비굿',
      monthlyPremium: { young: 26000, middle: 28000, senior: 36000 },
      coverage: { medical: 4800000, surgery: 9500000, liability: 150000000, mriCt: 2000000 },
      features: ['배상책임 최고', '가성비', '제휴병원', '빠른 청구'],
      strength: ['배상책임', '가성비'],
      weakness: ['MRI/CT 낮음', '보장 제약']
    },
    lotte: {
      name: '롯데손해보험',
      product: 'let:click',
      monthlyPremium: { young: 24000, middle: 27000, senior: 34000 },
      coverage: { medical: 4500000, surgery: 9000000, liability: 80000000, mriCt: 2000000 },
      features: ['저렴', '간편가입', '온라인 우대', '빠른 심사'],
      strength: ['저렴', '간편'],
      weakness: ['보장 낮음', '배상책임 낮음']
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const generateRecommendation = async () => {
    setLoading(true);
    setError(null);

    try {
      const ageGroup = parseInt(formData.petAge) <= 3 ? 'young' : 
                       parseInt(formData.petAge) <= 7 ? 'middle' : 'senior';

      const insuranceInfo = Object.entries(insuranceDatabase).map(([key, data]) => ({
        id: key,
        name: data.name,
        product: data.product,
        monthly: data.monthlyPremium[ageGroup],
        features: data.features,
        strength: data.strength,
        weakness: data.weakness
      }));

      const prompt = `
당신은 펫보험 전문 상담사입니다. 다음 고객 정보에 기반하여 맞춤형 보험 추천을 제공하세요.

📋 고객 정보:
- 반려동물: ${formData.petName} (${formData.petType}, ${formData.breed || '종 미지정'})
- 나이: ${formData.petAge}세, 몸무게: ${formData.weight}kg, 성별: ${formData.gender}
- 만성질환: ${formData.hasChronicDisease ? formData.chronicDiseaseDetails : '없음'}
- 월예산: ${formData.budget.toLocaleString()}원
- 우선순위: ${formData.priority === 'balanced' ? '균형형' : formData.priority === 'comprehensive' ? '보장형' : '경제형'}
- 동물병원 이용: ${formData.veterinaryExperience === 'frequent' ? '자주' : formData.veterinaryExperience === 'occasional' ? '가끔' : '거의 안함'}
- 위치: ${formData.location}

📊 이용 가능한 보험사 정보:
${insuranceInfo.map(ins => `
${ins.name} (${ins.product})
- 월보험료: ${ins.monthly.toLocaleString()}원
- 강점: ${ins.strength.join(', ')}
- 약점: ${ins.weakness.join(', ')}
- 특징: ${ins.features.join(', ')}
`).join('\n')}

요청사항:
1. TOP 3 추천 보험사를 순위별로 제시
2. 각 추천 이유를 구체적으로 설명 (3-4줄)
3. 주의사항 및 추가 조언 제공
4. 보험료 비교 및 ROI 분석
5. 가입 시 체크리스트 제공

톤: 전문적이면서도 친근함
형식: 마크다운 사용 (구조화)
금지사항:
- "무조건 이 보험을 선택해야 합니다" 같은 강압적 표현
- "최고의 보험" 같은 절대적 표현
- 특정 보험사 비난
      `;

      // 서버 API를 통해 Claude 호출 (CORS 문제 해결)
      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });

      if (!response.ok) {
        throw new Error('AI 분석 요청 실패');
      }

      const data = await response.json();
      const recommendationText = data.content || '';

      setRecommendation({
        petInfo: formData,
        analysis: recommendationText,
        timestamp: new Date(),
        insuranceOptions: insuranceInfo.slice(0, 3)
      });

      setStep(3);
    } catch (err) {
      console.error('AI 분석 실패:', err);
      setError('분석에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">🐾 AI 맞춤형 펫보험 추천</h1>
          <p className="text-lg text-gray-600">Claude AI가 당신의 반려동물을 위해 최적의 보험을 찾아드립니다</p>
          <p className="text-sm text-gray-500 mt-2">⚠️ 본 추천은 정보 제공용이며 보험 권유가 아닙니다</p>
        </div>

        {/* Step 1: 정보 수집 */}
        {step === 1 && (
          <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">반려동물 이름</label>
                <input
                  type="text"
                  name="petName"
                  value={formData.petName}
                  onChange={handleInputChange}
                  placeholder="예: 뽀삐"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">종류</label>
                <select
                  name="petType"
                  value={formData.petType}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="dog">강아지</option>
                  <option value="cat">고양이</option>
                  <option value="rabbit">토끼</option>
                  <option value="bird">새</option>
                  <option value="etc">기타</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">나이 (세)</label>
                <input
                  type="number"
                  name="petAge"
                  value={formData.petAge}
                  onChange={handleInputChange}
                  placeholder="예: 3"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">품종</label>
                <input
                  type="text"
                  name="breed"
                  value={formData.breed}
                  onChange={handleInputChange}
                  placeholder="예: 푸들"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">몸무게 (kg)</label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  placeholder="예: 5"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">성별</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="male">수컷</option>
                  <option value="female">암컷</option>
                </select>
              </div>
            </div>

            <div className="border-t pt-6">
              <label className="flex items-center space-x-3 mb-4">
                <input
                  type="checkbox"
                  name="hasChronicDisease"
                  checked={formData.hasChronicDisease}
                  onChange={handleInputChange}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="font-semibold text-gray-700">만성질환이 있습니다</span>
              </label>

              {formData.hasChronicDisease && (
                <textarea
                  name="chronicDiseaseDetails"
                  value={formData.chronicDiseaseDetails}
                  onChange={handleInputChange}
                  placeholder="예: 슬개골 탈구, 아토피 등"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  rows="3"
                />
              )}
            </div>

            <div className="border-t pt-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">월 예산</label>
                <input
                  type="range"
                  name="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                  min="10000"
                  max="100000"
                  step="5000"
                  className="w-full"
                />
                <p className="text-center text-lg font-bold text-blue-600 mt-2">
                  {formData.budget.toLocaleString()}원
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">우선순위</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'economical', label: '💰 경제형', desc: '저렴한 보험료' },
                    { value: 'balanced', label: '⚖️ 균형형', desc: '적절한 가격/보장' },
                    { value: 'comprehensive', label: '🛡️ 보장형', desc: '최고 보장' }
                  ].map(option => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, priority: option.value }))}
                      className={`p-3 rounded-lg border-2 transition ${
                        formData.priority === option.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-semibold">{option.label}</div>
                      <div className="text-xs text-gray-600">{option.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">동물병원 이용 빈도</label>
                <select
                  name="veterinaryExperience"
                  value={formData.veterinaryExperience}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="none">거의 안 함</option>
                  <option value="occasional">가끔</option>
                  <option value="frequent">자주</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">지역</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="예: 서울시 강남구"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <button
              onClick={() => { setStep(2); setTimeout(generateRecommendation, 100); }}
              disabled={!formData.petName || !formData.petAge}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-bold text-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              AI 분석 시작 ✨
            </button>
          </div>
        )}

        {/* Step 2: 분석 중 */}
        {step === 2 && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="inline-block mb-6">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">AI가 분석 중입니다...</h2>
            <p className="text-gray-600">{formData.petName}님의 최적 보험을 찾고 있습니다</p>
          </div>
        )}

        {/* Step 3: 결과 */}
        {step === 3 && recommendation && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">📊 분석 결과</h2>
              <div className="prose prose-sm max-w-none">
                <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                  {recommendation.analysis}
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStep(1)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg font-bold transition"
              >
                처음부터 다시
              </button>
              <button
                onClick={() => window.location.href = '#consultation'}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-bold hover:shadow-lg transition"
              >
                상담 신청하기
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIRecommendation;
