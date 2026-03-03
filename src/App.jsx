// src/App.jsx
// PetCare+ 메인 애플리케이션
// 랜딩페이지, 무료상담 폼, 모든 섹션 통합

import React, { useState, useEffect } from 'react';
import AIRecommendation from './components/AIRecommendation';
import ChatBot from './components/ChatBot';
import InsuranceComparison from './components/InsuranceComparison';
import HospitalFinder from './components/HospitalFinder';
import ClaimProcess from './components/ClaimProcess';
import ComparisonChart from './components/ComparisonChart';
import InsuranceEducation from './components/InsuranceEducation';
import AdvancedFilter from './components/AdvancedFilter';
import InsurancePersonality from './components/InsurancePersonality';
import HealthCalculator from './components/HealthCalculator';
import MyPage from './components/MyPage';
import { COMPANY_INFO } from './constants/company';

const App = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [showChatBot, setShowChatBot] = useState(false);

  const sections = {
    home: null,
    recommendation: <AIRecommendation />,
    comparison: <InsuranceComparison />,
    chart: <ComparisonChart />,
    filter: <AdvancedFilter />,
    personality: <InsurancePersonality />,
    education: <InsuranceEducation />,
    calculator: <HealthCalculator />,
    hospital: <HospitalFinder />,
    claim: <ClaimProcess />,
    mypage: <MyPage />
  };

  };

  const HomePage = () => (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 leading-tight">
                🐾 우리 반려동물을 위한<br />
                <span className="text-gradient">AI 펫보험 비교</span>
              </h1>

              <p className="text-xl text-gray-700 leading-relaxed">
                Claude AI가 당신의 반려동물에게 최적의 보험을 찾아드립니다.<br />
                <strong>8개 보험사 실시간 비교 + 24시간 무료 AI 상담</strong>
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={() => setActiveSection('recommendation')}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-lg text-white px-8 py-4 rounded-lg font-bold text-lg transition transform hover:scale-105">
                  🤖 AI 맞춤형 추천받기
                </button>
                <button onClick={() => setActiveSection('comparison')}
                  className="border-2 border-blue-500 text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-lg font-bold text-lg transition">
                  🔍 8개사 비교 보기
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-8 border-t border-gray-200">
                {[
                  { icon: '✨', title: 'AI 분석', desc: '고급 AI가 맞춤형 추천' },
                  { icon: '⚡', title: '실시간 비교', desc: '8개 보험사 한눈에 비교' },
                  { icon: '💬', title: '24시간 상담', desc: 'AI 챗봇 언제든 상담' },
                  { icon: '🏥', title: '병원 검색', desc: '근처 동물병원 찾기' }
                ].map((item, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="text-3xl">{item.icon}</div>
                    <h3 className="font-bold text-gray-900">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="hidden lg:block relative h-96">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-600 rounded-2xl opacity-80 shadow-2xl flex items-center justify-center text-6xl">
                🐕‍🦺
              </div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-yellow-300 rounded-full opacity-50"></div>
              <div className="absolute top-10 -left-4 w-24 h-24 bg-pink-300 rounded-full opacity-50"></div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Consultation CTA */}
      <section id="consultation" className="py-20 px-4 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-8">💬 전문가 무료 상담</h2>
          <p className="text-xl text-gray-700 mb-8">이희전 보험상담사와의 맞춤형 상담을 받으세요</p>
          <p className="text-gray-600 mb-12">25년 금융보험 경력 & 미래에셋 파트너<br />24시간 내 연락드리겠습니다</p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button onClick={() => window.location.href = 'https://insurance-consultant-landing.vercel.app/'}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow-lg text-white px-8 py-4 rounded-lg font-bold text-lg transition transform hover:scale-105">
              📋 전문가 상담 신청
            </button>
            <button onClick={() => setShowChatBot(true)}
              className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:shadow-lg text-white px-8 py-4 rounded-lg font-bold text-lg transition transform hover:scale-105">
              🤖 AI 챗봇 즉시 상담
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-8">본 서비스는 정보 제공용이며 보험 권유가 아닙니다.</p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">🎯 지금 바로 시작하세요</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: '🤖', title: 'AI 맞춤형 추천', desc: '반려동물 정보 입력 → AI 분석 → 맞춤 보험 추천', action: () => setActiveSection('recommendation') },
              { icon: '🔍', title: '8개사 상세 비교', desc: '보험료, 보장, 평점 한눈에 비교하기', action: () => setActiveSection('comparison') },
              { icon: '�', title: '차트 분석', desc: '다차원 레이더/막대/라인 차트 비교', action: () => setActiveSection('chart') },
              { icon: '🔬', title: '고급 필터', desc: '7가지 필터로 최적의 보험사 찾기', action: () => setActiveSection('filter') },
              { icon: '🧠', title: '성향 분석', desc: '5가지 질문으로 당신의 성향 분석', action: () => setActiveSection('personality') },
              { icon: '📚', title: '교육 센터', desc: '용어, 견종, 청구절차, FAQ 학습', action: () => setActiveSection('education') },
              { icon: '💚', title: '의료비 계산', desc: '월 예상 진료비 자동 계산', action: () => setActiveSection('calculator') },
              { icon: '🏥', title: '병원 검색', desc: '현재 위치 기반 근처 병원 찾기', action: () => setActiveSection('hospital') },
              { icon: '📋', title: '청구 가이드', desc: '6단계 청구 절차 상세 설명', action: () => setActiveSection('claim') }
            ].map((item, idx) => (
              <button key={idx} onClick={item.action} className="bg-gradient-to-br from-gray-50 to-gray-100 hover:shadow-lg p-6 rounded-xl transition text-left">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-gray-600 mb-4 text-sm">{item.desc}</p>
                <span className="inline-block bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold text-sm">시작하기 →</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-12 px-4 bg-yellow-50 border-t-4 border-yellow-200">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">⚠️ 면책 공고</h3>
          <p className="text-gray-700 leading-relaxed">
            본 플랫폼은 펫보험 가입을 권유하는 것이 아니며, <strong>정보 제공</strong> 목적입니다.
            정확한 가입 조건, 보장 내용, 보험료는 각 보험사에 직접 문의하시기 바랍니다.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="font-bold text-lg mb-4">🐾 PetCare+</h4>
              <p className="text-gray-400 text-sm">AI 기반 펫보험 비교 플랫폼<br />24시간 무료 상담 서비스</p>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4">빠른 링크</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><button onClick={() => setActiveSection('recommendation')} className="hover:text-white">🤖 AI 추천</button></li>
                <li><button onClick={() => setActiveSection('comparison')} className="hover:text-white">📊 보험 비교</button></li>
                <li><button onClick={() => setActiveSection('chart')} className="hover:text-white">📈 차트 분석</button></li>
                <li><button onClick={() => setActiveSection('filter')} className="hover:text-white">🔍 고급 필터</button></li>
                <li><button onClick={() => setActiveSection('personality')} className="hover:text-white">🧠 성향 분석</button></li>
                <li><button onClick={() => setActiveSection('education')} className="hover:text-white">📚 교육 센터</button></li>
                <li><button onClick={() => setActiveSection('calculator')} className="hover:text-white">💚 의료비 계산</button></li>
                <li><button onClick={() => setActiveSection('hospital')} className="hover:text-white">🏥 병원 검색</button></li>
                <li><button onClick={() => setActiveSection('claim')} className="hover:text-white">📋 청구 가이드</button></li>
                <li><button onClick={() => setActiveSection('mypage')} className="hover:text-white">👤 마이페이지</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4">� 연락처</h4>
              <p className="text-gray-400 text-sm">
                {COMPANY_INFO.email}<br />
                <span style={{fontSize: '12px'}}>💬 우측 하단 AI 챗봇에서 24시간 무료 상담 가능</span>
              </p>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8 text-center text-gray-500 text-xs">
            <p>
              {COMPANY_INFO.name} | 
              사업자등록번호: {COMPANY_INFO.businessNumber} | 
              📞 {COMPANY_INFO.phone}
            </p>
            <p className="mt-2">
              © {new Date().getFullYear()} PetCare+. All rights reserved. | 
              <button className="hover:text-white ml-2">개인정보처리방침</button> | 
              <button className="hover:text-white ml-2">서비스이용약관</button>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <nav className="sticky top-0 z-40 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button onClick={() => setActiveSection('home')} className="text-2xl font-bold text-blue-600 flex items-center gap-2 hover:text-blue-700">
              🐾 PetCare+
            </button>

            <div className="hidden md:flex items-center gap-8">
              <button onClick={() => setActiveSection('recommendation')} className="text-gray-700 hover:text-blue-600 font-medium">AI 추천</button>
              <button onClick={() => setActiveSection('comparison')} className="text-gray-700 hover:text-blue-600 font-medium">보험 비교</button>
              <button onClick={() => setActiveSection('chart')} className="text-gray-700 hover:text-blue-600 font-medium">차트 분석</button>
              <button onClick={() => setActiveSection('filter')} className="text-gray-700 hover:text-blue-600 font-medium">고급 필터</button>
              <button onClick={() => setActiveSection('personality')} className="text-gray-700 hover:text-blue-600 font-medium">성향 분석</button>
              <button onClick={() => setActiveSection('education')} className="text-gray-700 hover:text-blue-600 font-medium">교육</button>
              <button onClick={() => setActiveSection('calculator')} className="text-gray-700 hover:text-blue-600 font-medium">계산기</button>
              <button onClick={() => setActiveSection('hospital')} className="text-gray-700 hover:text-blue-600 font-medium">병원 검색</button>
              <button onClick={() => setActiveSection('claim')} className="text-gray-700 hover:text-blue-600 font-medium">청구 가이드</button>
              <button onClick={() => setActiveSection('mypage')} className="text-gray-700 hover:text-blue-600 font-medium">마이페이지</button>
              <button onClick={() => setShowChatBot(true)} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium">💬 상담</button>
            </div>
          </div>
        </div>
      </nav>

      {activeSection === 'home' ? <HomePage /> : sections[activeSection]}
      {showChatBot && <ChatBot onClose={() => setShowChatBot(false)} />}

      <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 bg-blue-500 hover:bg-blue-600 text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center z-30">
        ↑
      </button>
    </div>
  );
};

export default App;
