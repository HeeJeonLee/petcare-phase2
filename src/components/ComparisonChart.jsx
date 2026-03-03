// src/components/ComparisonChart.jsx
// 다차원 보험 비교 차트 (레이더, 막대, 라인, 시나리오)

import React, { useState } from 'react';
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, Area, AreaChart
} from 'recharts';

const ComparisonChart = () => {
  const [chartType, setChartType] = useState('radar');
  const [selectedCompanies, setSelectedCompanies] = useState(['meritz', 'samsung', 'db']);
  const [ageGroup, setAgeGroup] = useState('middle'); // young, middle, senior

  const insuranceDatabase = {
    meritz: {
      name: '메리츠화재',
      premium: { young: 22000, middle: 25000, senior: 38000 },
      coverage: 5000000,
      surgery: 10000000,
      satisfaction: 92,
      renewal: 20,
      features: 95,
      serviceSpeed: 88,
      claims: 2100
    },
    samsung: {
      name: '삼성화재',
      premium: { young: 28000, middle: 32000, senior: 42000 },
      coverage: 4500000,
      surgery: 9000000,
      satisfaction: 88,
      renewal: 22,
      features: 85,
      serviceSpeed: 85,
      claims: 1850
    },
    db: {
      name: 'DB손해보험',
      premium: { young: 23000, middle: 26000, senior: 35000 },
      coverage: 5500000,
      surgery: 11000000,
      satisfaction: 90,
      renewal: 18,
      features: 92,
      serviceSpeed: 90,
      claims: 2300
    },
    hyundai: {
      name: '현대해상',
      premium: { young: 26000, middle: 29000, senior: 40000 },
      coverage: 5000000,
      surgery: 10000000,
      satisfaction: 87,
      renewal: 21,
      features: 88,
      serviceSpeed: 86,
      claims: 1950
    },
    kb: {
      name: 'KB손해보험',
      premium: { young: 30000, middle: 35000, senior: 48000 },
      coverage: 6000000,
      surgery: 12000000,
      satisfaction: 89,
      renewal: 25,
      features: 94,
      serviceSpeed: 87,
      claims: 2200
    }
  };

  // 레이더 차트 데이터
  const getRadarData = () => {
    return [
      {
        category: '월 보험료',
        meritz: 80,
        samsung: 60,
        db: 85,
        hyundai: 70,
        kb: 50
      },
      {
        category: '보장금액',
        meritz: 80,
        samsung: 75,
        db: 88,
        hyundai: 80,
        kb: 95
      },
      {
        category: '만족도',
        meritz: 92,
        samsung: 88,
        db: 90,
        hyundai: 87,
        kb: 89
      },
      {
        category: '갱신한도',
        meritz: 80,
        samsung: 75,
        db: 88,
        hyundai: 79,
        kb: 65
      },
      {
        category: '기능성',
        meritz: 95,
        samsung: 85,
        db: 92,
        hyundai: 88,
        kb: 94
      }
    ];
  };

  // 막대 차트 데이터
  const getBarData = () => {
    return selectedCompanies.map(id => ({
      name: insuranceDatabase[id].name,
      monthly: insuranceDatabase[id].premium[ageGroup],
      medical: insuranceDatabase[id].coverage / 100000,
      surgery: insuranceDatabase[id].surgery / 100000,
      satisfaction: insuranceDatabase[id].satisfaction * 10000
    }));
  };

  // 라인 차트 데이터 (나이별 월 보험료)
  const getLineData = () => {
    const ages = [1, 2, 3, 5, 7, 10, 12, 15];
    return ages.map(age => {
      const data = { age: `${age}세` };
      selectedCompanies.forEach(id => {
        const company = insuranceDatabase[id];
        if (age <= 3) data[id] = company.premium.young;
        else if (age <= 7) data[id] = company.premium.middle;
        else data[id] = company.premium.senior;
      });
      return data;
    });
  };

  // 시나리오 데이터
  const getScenarioData = () => {
    return [
      {
        scenario: '경제형\n(월20K)',
        count: selectedCompanies.filter(id => 
          insuranceDatabase[id].premium[ageGroup] <= 25000
        ).length
      },
      {
        scenario: '표준형\n(월25-35K)',
        count: selectedCompanies.filter(id => {
          const p = insuranceDatabase[id].premium[ageGroup];
          return p > 25000 && p <= 35000;
        }).length
      },
      {
        scenario: '프리미엄\n(월35K+)',
        count: selectedCompanies.filter(id => 
          insuranceDatabase[id].premium[ageGroup] > 35000
        ).length
      }
    ];
  };

  const toggleCompany = (id) => {
    setSelectedCompanies(prev => 
      prev.includes(id)
        ? prev.filter(c => c !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">📊 다차원 보험 비교 차트</h1>
          <p className="text-lg text-gray-600">보험사별 4가지 시각화로 직관적 비교</p>
        </div>

        {/* 컨트롤 패널 */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 보험사 선택 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">보험사 선택</label>
              <div className="space-y-2">
                {Object.entries(insuranceDatabase).map(([id, company]) => (
                  <label key={id} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedCompanies.includes(id)}
                      onChange={() => toggleCompany(id)}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-700">{company.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 나이대 선택 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">반려동물 나이대</label>
              <div className="space-y-2">
                {[
                  { value: 'young', label: '🐕 어린견 (0-3세)' },
                  { value: 'middle', label: '🐕 성견 (4-7세)' },
                  { value: 'senior', label: '🐕 고령견 (8세+)' }
                ].map(option => (
                  <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="ageGroup"
                      value={option.value}
                      checked={ageGroup === option.value}
                      onChange={(e) => setAgeGroup(e.target.value)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 차트 유형 선택 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">차트 유형</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'radar', label: '📡 레이더' },
                  { value: 'bar', label: '📊 막대' },
                  { value: 'line', label: '📈 라인' },
                  { value: 'scenario', label: '🎯 시나리오' }
                ].map(option => (
                  <button
                    key={option.value}
                    onClick={() => setChartType(option.value)}
                    className={`p-2 rounded text-xs font-semibold transition ${
                      chartType === option.value
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 차트 영역 */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {chartType === 'radar' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">📡 레이더 차트 - 다각도 비교</h2>
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={getRadarData()}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="category" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  {selectedCompanies.includes('meritz') && (
                    <Radar
                      name="메리츠"
                      dataKey="meritz"
                      stroke="#FF6B6B"
                      fill="#FF6B6B"
                      fillOpacity={0.3}
                    />
                  )}
                  {selectedCompanies.includes('samsung') && (
                    <Radar
                      name="삼성"
                      dataKey="samsung"
                      stroke="#4ECDC4"
                      fill="#4ECDC4"
                      fillOpacity={0.3}
                    />
                  )}
                  {selectedCompanies.includes('db') && (
                    <Radar
                      name="DB"
                      dataKey="db"
                      stroke="#45B7D1"
                      fill="#45B7D1"
                      fillOpacity={0.3}
                    />
                  )}
                  {selectedCompanies.includes('hyundai') && (
                    <Radar
                      name="현대"
                      dataKey="hyundai"
                      stroke="#F7B801"
                      fill="#F7B801"
                      fillOpacity={0.3}
                    />
                  )}
                  {selectedCompanies.includes('kb') && (
                    <Radar
                      name="KB"
                      dataKey="kb"
                      stroke="#95E1D3"
                      fill="#95E1D3"
                      fillOpacity={0.3}
                    />
                  )}
                  <Legend />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
              <p className="text-sm text-gray-600 mt-4">💡 5가지 지표(월보험료, 보장금액, 만족도, 갱신한도, 기능성)로 종합 비교</p>
            </div>
          )}

          {chartType === 'bar' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">📊 막대 차트 - 세부 지표 비교</h2>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={getBarData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => value.toLocaleString()} />
                  <Legend />
                  <Bar dataKey="monthly" name="월 보험료 (원)" fill="#FF6B6B" />
                  <Bar dataKey="medical" name="기본보장 (100만원)" fill="#4ECDC4" />
                  <Bar dataKey="surgery" name="수술보장 (100만원)" fill="#45B7D1" />
                </BarChart>
              </ResponsiveContainer>
              <p className="text-sm text-gray-600 mt-4">💡 월 보험료와 보장금액을 막대 그래프로 직관적 비교</p>
            </div>
          )}

          {chartType === 'line' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">📈 라인 차트 - 나이별 보험료 추이</h2>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={getLineData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="age" />
                  <YAxis />
                  <Tooltip formatter={(value) => `${value.toLocaleString()}원`} />
                  <Legend />
                  {selectedCompanies.includes('meritz') && (
                    <Line type="monotone" dataKey="meritz" name="메리츠" stroke="#FF6B6B" strokeWidth={2} />
                  )}
                  {selectedCompanies.includes('samsung') && (
                    <Line type="monotone" dataKey="samsung" name="삼성" stroke="#4ECDC4" strokeWidth={2} />
                  )}
                  {selectedCompanies.includes('db') && (
                    <Line type="monotone" dataKey="db" name="DB" stroke="#45B7D1" strokeWidth={2} />
                  )}
                  {selectedCompanies.includes('hyundai') && (
                    <Line type="monotone" dataKey="hyundai" name="현대" stroke="#F7B801" strokeWidth={2} />
                  )}
                  {selectedCompanies.includes('kb') && (
                    <Line type="monotone" dataKey="kb" name="KB" stroke="#95E1D3" strokeWidth={2} />
                  )}
                </LineChart>
              </ResponsiveContainer>
              <p className="text-sm text-gray-600 mt-4">💡 반려동물 나이 증가에 따른 월 보험료 변화 추이</p>
            </div>
          )}

          {chartType === 'scenario' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">🎯 시나리오 분석 - 가격대별 분포</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {getScenarioData().map((item, idx) => (
                  <div key={idx} className="bg-gradient-to-br from-purple-100 to-blue-100 p-6 rounded-lg text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">{item.count}</div>
                    <div className="text-sm font-semibold text-gray-700 whitespace-pre-line">{item.scenario}</div>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>📌 분석:</strong> 선택된 보험사들의 {ageGroup === 'young' ? '어린견' : ageGroup === 'middle' ? '성견' : '고령견'} 기준 가격대별 분포입니다.
                  경제형부터 프리미엄까지 선택지를 확인하세요.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 인사이트 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded">
            <h3 className="font-bold text-yellow-800 mb-2">💡 비교 팁</h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• 최대 3-4개 보험사를 비교하면 객관적</li>
              <li>• 월 보험료뿐 아니라 보장금액 확인 필수</li>
              <li>• 갱신 한도(최대 가입 나이) 꼭 확인</li>
              <li>• 만성질환 있으면 미리 산반 반영된 상품 선택</li>
            </ul>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded">
            <h3 className="font-bold text-blue-800 mb-2">📊 이해하기</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• <strong>레이더:</strong> 종합 점수를 한눈에 비교</li>
              <li>• <strong>막대:</strong> 구체적 금액 비교에 최적</li>
              <li>• <strong>라인:</strong> 나이별 변화 추이 파악</li>
              <li>• <strong>시나리오:</strong> 예산대별 선택 옵션</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonChart;
