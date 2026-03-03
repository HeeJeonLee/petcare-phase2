// src/components/InsurancePersonality.jsx
// AI 보험 성향 분석 - 5Q → 4가지 성향 (500줄)

import React, { useState } from 'react';

const InsurancePersonality = () => {
  const [currentStep, setCurrentStep] = useState(0); // 0-4: 질문, 5: 결과
  const [answers, setAnswers] = useState([0, 0, 0, 0, 0]);
  const [personality, setPersonality] = useState(null);

  const questions = [
    {
      id: 1,
      title: '💰 저축 vs 보장',
      subtitle: '보험에 대한 태도를 선택하세요',
      description: '보험 가입 시 월 보험료를 얼마나 중요하게 생각하시나요?',
      left: { text: '💵 적게 내고 싶다\n(저비용 최우선)', value: 1 },
      right: { text: '💎 많이 내더라도\n최고 보장을 원한다', value: 5 },
      scale: ['최소화', 2, 3, 4, '최대화']
    },
    {
      id: 2,
      title: '⚖️ 위험 회피 성향',
      subtitle: '리스크에 대한 태도',
      description: '반려동물의 건강 문제에 대해 얼마나 신경 쓰시나요?',
      left: { text: '🛡️ 매우 보수적\n(작은 위험도 대비)', value: 1 },
      right: { text: '🚀 공격적\n(필요할 때만 대비)', value: 5 },
      scale: ['매우보수', '보수', '중립', '공격', '매우공격']
    },
    {
      id: 3,
      title: '📅 계획 기간',
      subtitle: '보험 보유 목표 기간',
      description: '반려동물과 얼마나 오래 함께하실 계획인가요?',
      left: { text: '📍 단기 (1-3년)\n긴급 대비용', value: 1 },
      right: { text: '🎯 장기 (10년+)\n평생 함께', value: 5 },
      scale: ['1-3년', '3-5년', '5-7년', '7-10년', '10년+']
    },
    {
      id: 4,
      title: '🤝 신뢰도 선호',
      subtitle: '보험사 선택 기준',
      description: '어떤 보험사를 선호하시나요?',
      left: { text: '🏢 중소 회사\n합리적 가격', value: 1 },
      right: { text: '🏛️ 대형 회사\n안정성 최고', value: 5 },
      scale: ['중소기업', '중견기업', '구분안함', '대기업선호', '대대기업필수']
    },
    {
      id: 5,
      title: '🎯 의사결정 스타일',
      subtitle: '정보 활용 방식',
      description: '보험 상품을 선택할 때 주로 어디를 참고하시나요?',
      left: { text: '💭 직관\n느낌이 좋은 것', value: 1 },
      right: { text: '📊 데이터 분석\n상세 비교 후 선택', value: 5 },
      scale: ['직관100%', '직관多', '반반', '분석多', '분석100%']
    }
  ];

  // 성향 분석 로직
  const analyzePersonality = (scores) => {
    const total = scores.reduce((a, b) => a + b, 0);
    const avg = total / scores.length;

    // 4가지 성향 분류
    const conservative = scores[1]; // 보수성
    const timehorizon = scores[2]; // 장기 계획
    const datadriven = scores[4]; // 데이터 기반

    let type = '';
    let description = '';
    let companies = [];
    let budget = '';
    let strategy = '';
    let color = '';

    if (avg <= 2) {
      type = '🛡️ 안정형 (보수)';
      description = '작은 위험도 철저히 대비하고, 신뢰할 수 있는 보험사를 선호합니다.';
      companies = ['메리츠화재', '현대해상', '삼성화재'];
      budget = '월 23,000 ~ 25,000원';
      strategy = [
        '대형 보험사 상품만 검토',
        '최소 15년 이상 갱신 가능한 상품',
        '기본보장금액 5,000만원 이상',
        '평가점수 90점 이상'
      ];
      color = 'blue';
    } else if (avg <= 3) {
      type = '⚖️ 균형형 (중도)';
      description = '보험료와 보장을 균형있게 고려하며, 합리적인 선택을 선호합니다.';
      companies = ['메리츠화재', 'DB손해보험', '현대해상'];
      budget = '월 25,000 ~ 27,000원';
      strategy = [
        '상위 3개 회사 비교',
        '보장금액 5,000~5,500만원',
        '월 보험료 25,000~30,000원대',
        '리뷰 점수 85점 이상'
      ];
      color = 'emerald';
    } else if (avg <= 4) {
      type = '🚀 공격형 (수익)';
      description = '최고의 보장을 원하며, 보험료보다 커버리지를 우선합니다.';
      companies = ['KB손해보험', '한화손해보험', '삼성화재'];
      budget = '월 28,000 ~ 35,000원';
      strategy = [
        '기본보장금액 6,000만원 이상',
        '수술비 최대 보장 상품',
        'MRI/CT 커버율 높은 상품',
        '통원비 무제한 포함 상품'
      ];
      color = 'orange';
    } else {
      type = '📊 분석형 (데이터)';
      description = '모든 데이터를 분석하여 최적의 선택을 추구합니다.';
      companies = ['DB손해보험', 'KB손해보험', '메리츠화재'];
      budget = '월 25,000 ~ 32,000원 (맞춤형)';
      strategy = [
        '5개사 이상 상품 비교표 작성',
        '시나리오별 시뮬레이션',
        '보장 범위 세부 검토',
        '갱신 패턴 분석'
      ];
      color = 'purple';
    }

    return {
      type,
      description,
      companies,
      budget,
      strategy,
      color,
      score: Math.round(avg * 20),
      conservative,
      timehorizon,
      datadriven
    };
  };

  const handleAnswer = (value) => {
    const newAnswers = [...answers];
    newAnswers[currentStep] = value;
    setAnswers(newAnswers);

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // 분석 완료
      const result = analyzePersonality(newAnswers);
      setPersonality(result);
      setCurrentStep(5);
    }
  };

  const resetQuiz = () => {
    setCurrentStep(0);
    setAnswers([0, 0, 0, 0, 0]);
    setPersonality(null);
  };

  if (currentStep < questions.length) {
    const q = questions[currentStep];
    const progress = ((currentStep + 1) / questions.length) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          {/* 헤더 */}
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">🧠 AI 보험 성향 분석</h1>
            <p className="text-gray-600">5가지 질문으로 당신의 성향을 분석합니다</p>
          </div>

          {/* 진행도 바 */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-semibold text-gray-700">
                질문 {currentStep + 1} / {questions.length}
              </p>
              <p className="text-sm font-semibold text-purple-600">{Math.round(progress)}%</p>
            </div>
            <div className="w-full bg-gray-300 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* 질문 카드 */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">{q.title}</h2>
            <p className="text-sm text-gray-500 mb-6">{q.subtitle}</p>
            <p className="text-lg text-gray-700 mb-8">{q.description}</p>

            {/* 척도 레이블 */}
            <div className="flex justify-between text-xs text-gray-500 mb-3 px-1">
              {q.scale.map((label, idx) => (
                <span key={idx}>{label}</span>
              ))}
            </div>

            {/* 슬라이더 */}
            <div className="mb-8">
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(value => (
                  <button
                    key={value}
                    onClick={() => handleAnswer(value)}
                    className={`flex-1 py-4 rounded-lg font-bold transition transform hover:scale-105 ${
                      answers[currentStep] === value
                        ? 'bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>

            {/* 선택지 설명 */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className={`p-4 rounded-lg border-2 transition ${
                answers[currentStep] <= 2 ? 'border-purple-600 bg-purple-50' : 'border-gray-200'
              }`}>
                <p className="text-sm font-semibold text-gray-800 whitespace-pre-wrap">
                  {q.left.text}
                </p>
              </div>
              <div className={`p-4 rounded-lg border-2 transition ${
                answers[currentStep] >= 4 ? 'border-pink-600 bg-pink-50' : 'border-gray-200'
              }`}>
                <p className="text-sm font-semibold text-gray-800 whitespace-pre-wrap">
                  {q.right.text}
                </p>
              </div>
            </div>

            {/* 다음 / 제출 버튼 */}
            <div className="flex gap-4">
              {currentStep > 0 && (
                <button
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition"
                >
                  ← 이전
                </button>
              )}
              <button
                onClick={() => handleAnswer(answers[currentStep])}
                disabled={answers[currentStep] === 0}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-lg text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {currentStep === questions.length - 1 ? '분석 완료 →' : '다음 →'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 결과 화면
  if (personality) {
    const colorVariants = {
      blue: { light: 'from-blue-50 to-cyan-50', strong: 'from-blue-600 to-cyan-600' },
      emerald: { light: 'from-emerald-50 to-green-50', strong: 'from-emerald-600 to-green-600' },
      orange: { light: 'from-orange-50 to-amber-50', strong: 'from-orange-600 to-amber-600' },
      purple: { light: 'from-purple-50 to-indigo-50', strong: 'from-purple-600 to-indigo-600' }
    };

    const colors = colorVariants[personality.color];

    return (
      <div className={`min-h-screen bg-gradient-to-br ${colors.light} py-12 px-4`}>
        <div className="max-w-4xl mx-auto">
          {/* 성향 카드 */}
          <div className={`bg-gradient-to-br ${colors.strong} text-white rounded-2xl shadow-2xl p-12 mb-8 text-center`}>
            <p className="text-6xl mb-4">
              {personality.type.split(' ')[0]}
            </p>
            <h1 className="text-4xl font-bold mb-4">{personality.type}</h1>
            <p className="text-lg opacity-90 mb-6">{personality.description}</p>
            <div className="inline-block bg-white bg-opacity-20 px-6 py-3 rounded-full">
              <p className="text-2xl font-bold">성향 점수: {personality.score}/100</p>
            </div>
          </div>

          {/* 3열 레이아웃 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* 추천 보험사 */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">🏆 추천 보험사</h2>
              <div className="space-y-2">
                {personality.companies.map((company, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg text-sm font-semibold ${
                      idx === 0
                        ? 'bg-yellow-100 text-yellow-800'
                        : idx === 1
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-orange-100 text-orange-800'
                    }`}
                  >
                    {idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'} {company}
                  </div>
                ))}
              </div>
            </div>

            {/* 예상 예산 */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">💰 예상 월 예산</h2>
              <p className="text-3xl font-bold text-green-600 mb-4">{personality.budget}</p>
              <p className="text-sm text-gray-600">
                당신의 성향에 맞는 평균 보험료입니다. 실제 금액은 반려동물의 나이, 건강상태에 따라 달라질 수 있습니다.
              </p>
            </div>

            {/* 의사결정 유형 */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">🎯 의사결정</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-600 mb-1">위험회피</p>
                  <div className="w-full bg-gray-300 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-full rounded-full transition-all"
                      style={{ width: `${personality.conservative * 20}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">장기계획</p>
                  <div className="w-full bg-gray-300 rounded-full h-2">
                    <div
                      className="bg-green-600 h-full rounded-full transition-all"
                      style={{ width: `${personality.timehorizon * 20}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">데이터분석</p>
                  <div className="w-full bg-gray-300 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-full rounded-full transition-all"
                      style={{ width: `${personality.datadriven * 20}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 전략 가이드 */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">📋 당신을 위한 선택 전략</h2>
            <ol className="space-y-4">
              {personality.strategy.map((step, idx) => (
                <li key={idx} className="flex gap-4">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br ${colors.strong} text-white flex items-center justify-center font-bold`}>
                    {idx + 1}
                  </div>
                  <p className="flex-grow text-gray-800 pt-1">{step}</p>
                </li>
              ))}
            </ol>
          </div>

          {/* CTA 버튼 */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={resetQuiz}
              className="px-8 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition"
            >
              🔄 다시 분석
            </button>
            <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:shadow-lg transition">
              ✨ 맞춤 상품 보기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default InsurancePersonality;
