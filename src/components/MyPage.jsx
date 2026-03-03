// src/components/MyPage.jsx
// 마이페이지 - 상담 기록, 계산 이력 자동 저장 (385줄)

import React, { useState, useEffect } from 'react';

const MyPage = () => {
  const [activeTab, setActiveTab] = useState('consultations');
  const [consultations, setConsultations] = useState([]);
  const [calculations, setCalculations] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [userInfo, setUserInfo] = useState({
    name: '사용자',
    email: 'user@example.com',
    phone: '010-0000-0000',
    joinDate: new Date().toLocaleDateString('ko-KR')
  });

  // LocalStorage에서 저장된 데이터 불러오기
  useEffect(() => {
    const savedConsultations = localStorage.getItem('petcare_consultations');
    const savedCalculations = localStorage.getItem('petcare_calculations');
    const savedRecommendations = localStorage.getItem('petcare_recommendations');

    if (savedConsultations) setConsultations(JSON.parse(savedConsultations));
    if (savedCalculations) setCalculations(JSON.parse(savedCalculations));
    if (savedRecommendations) setRecommendations(JSON.parse(savedRecommendations));
  }, []);

  // 임의의 샘플 데이터 (데모용)
  const sampleConsultations = [
    {
      id: 1,
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString('ko-KR'),
      petName: '뽀삐',
      topic: '슬개골 탈구 보험 상담',
      company: '메리츠화재',
      status: '상담완료',
      notes: '월 25,000원의 펫퍼민트 추천'
    },
    {
      id: 2,
      date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toLocaleDateString('ko-KR'),
      petName: '뽀삐',
      topic: '보험료 비교 상담',
      company: 'DB손해보험',
      status: '상담완료',
      notes: '5개 보험사 비교 후 DB 펫블리 최종 선택'
    },
    {
      id: 3,
      date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toLocaleDateString('ko-KR'),
      petName: '머니',
      topic: '고령견 보험 가입 상담',
      company: '현대해상',
      status: '상담진행',
      notes: '10세 고양이, 신장질환 기왕증 있음'
    }
  ];

  const sampleCalculations = [
    {
      id: 1,
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toLocaleDateString('ko-KR'),
      petName: '뽀삐',
      age: 3,
      weight: 5,
      monthlyCost: 250000,
      recommendedPremium: 150000,
      conditions: ['슬개골 탈구']
    },
    {
      id: 2,
      date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toLocaleDateString('ko-KR'),
      petName: '머니',
      age: 10,
      weight: 3.5,
      monthlyCost: 480000,
      recommendedPremium: 280000,
      conditions: ['신장질환']
    },
    {
      id: 3,
      date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toLocaleDateString('ko-KR'),
      petName: '봉이',
      age: 1,
      weight: 2,
      monthlyCost: 150000,
      recommendedPremium: 80000,
      conditions: []
    }
  ];

  const sampleRecommendations = [
    {
      id: 1,
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toLocaleDateString('ko-KR'),
      petName: '뽀삐',
      analysis: '3세 말티즈, 슬개골 탈구',
      topChoices: [
        { rank: 1, company: '메리츠화재', reasoning: '슬개골 특화, 월 25,000원', matched: true },
        { rank: 2, company: 'DB손해보험', reasoning: '높은 보장금액, 월 26,000원', matched: false },
        { rank: 3, company: '현대해상', reasoning: '가성비 우수, 월 29,000원', matched: false }
      ]
    },
    {
      id: 2,
      date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toLocaleDateString('ko-KR'),
      petName: '머니',
      analysis: '10세 포메라니안, 신장질환, 예산 월 30만원',
      topChoices: [
        { rank: 1, company: 'DB손해보험', reasoning: '신장질환 커버, 월 26,000원', matched: false },
        { rank: 2, company: '메리츠화재', reasoning: '높은 만족도, 월 38,000원', matched: false },
        { rank: 3, company: 'KB손해보험', reasoning: '최고 보장금액, 월 48,000원', matched: false }
      ]
    }
  ];

  // 통계 계산
  const stats = {
    totalConsultations: consultations.length || sampleConsultations.length,
    totalCalculations: calculations.length || sampleCalculations.length,
    totalRecommendations: recommendations.length || sampleRecommendations.length,
    averageMonthlyCost: Math.round(
      (calculations.length > 0
        ? calculations.reduce((sum, c) => sum + c.monthlyCost, 0) / calculations.length
        : sampleCalculations.reduce((sum, c) => sum + c.monthlyCost, 0) / sampleCalculations.length)
    ),
    potentialSavings: Math.round(
      (calculations.length > 0
        ? calculations.reduce((sum, c) => sum + (c.monthlyCost - c.recommendedPremium), 0) / calculations.length
        : sampleCalculations.reduce((sum, c) => sum + (c.monthlyCost - c.recommendedPremium), 0) / sampleCalculations.length)
    )
  };

  const consultationList = consultations.length > 0 ? consultations : sampleConsultations;
  const calculationList = calculations.length > 0 ? calculations : sampleCalculations;
  const recommendationList = recommendations.length > 0 ? recommendations : sampleRecommendations;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">📋 마이페이지</h1>
          <p className="text-gray-600">모든 상담, 계산, 추천 기록이 자동으로 저장됩니다</p>
        </div>

        {/* 사용자 정보 카드 */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">사용자명</p>
              <p className="text-lg font-bold text-gray-800">{userInfo.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">이메일</p>
              <p className="text-sm text-gray-700 break-all">{userInfo.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">연락처</p>
              <p className="text-sm text-gray-700">{userInfo.phone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">가입일</p>
              <p className="text-sm text-gray-700">{userInfo.joinDate}</p>
            </div>
          </div>
        </div>

        {/* 통계 대시보드 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-6">
            <p className="text-sm opacity-80 mb-2">💬 상담 기록</p>
            <p className="text-4xl font-bold">{stats.totalConsultations}</p>
            <p className="text-xs opacity-75 mt-2">총 상담 건수</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg p-6">
            <p className="text-sm opacity-80 mb-2">💚 비용 계산</p>
            <p className="text-4xl font-bold">{stats.totalCalculations}</p>
            <p className="text-xs opacity-75 mt-2">총 계산 건수</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg p-6">
            <p className="text-sm opacity-80 mb-2">✨ AI 추천</p>
            <p className="text-4xl font-bold">{stats.totalRecommendations}</p>
            <p className="text-xs opacity-75 mt-2">총 추천 건수</p>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-lg p-6">
            <p className="text-sm opacity-80 mb-2">💰 월 절감액</p>
            <p className="text-3xl font-bold">{(stats.potentialSavings / 10000).toFixed(0)}만₩</p>
            <p className="text-xs opacity-75 mt-2">평균 절감금</p>
          </div>
        </div>

        {/* 탭 네비게이션 */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: 'consultations', label: '💬 상담 기록', count: stats.totalConsultations },
            { id: 'calculations', label: '💚 비용 계산', count: stats.totalCalculations },
            { id: 'recommendations', label: '✨ AI 추천', count: stats.totalRecommendations }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
              }`}
            >
              {tab.label} <span className="ml-1 bg-opacity-20 px-2 rounded">{tab.count}</span>
            </button>
          ))}
        </div>

        {/* 콘텐츠 영역 */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* 상담 기록 탭 */}
          {activeTab === 'consultations' && (
            <div>
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">💬 상담 기록</h2>
              </div>
              {consultationList.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {consultationList.map(consultation => (
                    <div key={consultation.id} className="p-6 hover:bg-gray-50 transition">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="text-lg font-bold text-gray-800">{consultation.topic}</p>
                          <p className="text-sm text-gray-600">
                            🐾 {consultation.petName} · 📅 {consultation.date}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          consultation.status === '상담완료'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {consultation.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">보험사</p>
                          <p className="font-semibold text-gray-800">{consultation.company}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">메모</p>
                          <p className="font-semibold text-gray-800">{consultation.notes}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center text-gray-500">
                  상담 기록이 없습니다
                </div>
              )}
            </div>
          )}

          {/* 비용 계산 탭 */}
          {activeTab === 'calculations' && (
            <div>
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">💚 월 의료비 계산 이력</h2>
              </div>
              {calculationList.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">날짜</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">반려동물</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">나이</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">몸무게</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">월 진료비</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">권장 보험료</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">절감액</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {calculationList.map(calc => (
                        <tr key={calc.id} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-600">{calc.date}</td>
                          <td className="px-6 py-4 text-sm font-semibold text-gray-800">{calc.petName}</td>
                          <td className="px-6 py-4 text-sm text-gray-700">{calc.age}세</td>
                          <td className="px-6 py-4 text-sm text-gray-700">{calc.weight}kg</td>
                          <td className="px-6 py-4 text-sm font-bold text-red-600">{(calc.monthlyCost / 10000).toFixed(0)}만₩</td>
                          <td className="px-6 py-4 text-sm font-bold text-green-600">{(calc.recommendedPremium / 10000).toFixed(0)}만₩</td>
                          <td className="px-6 py-4 text-sm font-bold text-blue-600">
                            {((calc.monthlyCost - calc.recommendedPremium) / 10000).toFixed(0)}만₩
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-12 text-center text-gray-500">
                  계산 이력이 없습니다
                </div>
              )}
            </div>
          )}

          {/* AI 추천 탭 */}
          {activeTab === 'recommendations' && (
            <div>
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">✨ AI 보험 추천 기록</h2>
              </div>
              {recommendationList.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {recommendationList.map(rec => (
                    <div key={rec.id} className="p-6 hover:bg-gray-50 transition">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="text-lg font-bold text-gray-800">🐾 {rec.petName}</p>
                          <p className="text-sm text-gray-600 mt-1">{rec.analysis}</p>
                          <p className="text-xs text-gray-500">📅 {rec.date}</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        {rec.topChoices.map(choice => (
                          <div
                            key={choice.rank}
                            className={`p-4 rounded-lg border-l-4 ${
                              choice.matched
                                ? 'border-green-500 bg-green-50'
                                : choice.rank === 1
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-300 bg-gray-50'
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-semibold text-gray-800">
                                  {choice.rank === 1 ? '🥇' : choice.rank === 2 ? '🥈' : '🥉'} {choice.company}
                                </p>
                                <p className="text-sm text-gray-700 mt-1">{choice.reasoning}</p>
                              </div>
                              {choice.matched && (
                                <span className="text-xs font-bold text-green-700 bg-green-200 px-2 py-1 rounded">
                                  가입완료
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center text-gray-500">
                  AI 추천 기록이 없습니다
                </div>
              )}
            </div>
          )}
        </div>

        {/* 액션 버튼 */}
        <div className="mt-8 flex gap-4 justify-center">
          <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition shadow-lg">
            📥 데이터 내보내기
          </button>
          <button className="px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition">
            🗑️ 기록 초기화
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
