// src/App.jsx
// PetCare+ 메인 애플리케이션 - Global Standard UI (2026.03.06)
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
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [formData, setFormData] = useState({
    name: '', phone: '', email: '', petName: '', petAge: '', message: ''
  });
  const [submitStatus, setSubmitStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleConsultationSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          petType: formData.petName,
          petAge: formData.petAge,
          message: formData.message
        })
      });

      if (response.ok) {
        setSubmitStatus({ type: 'success', message: '상담 신청이 완료되었습니다! 24시간 내에 연락드리겠습니다.' });
        setFormData({ name: '', phone: '', email: '', petName: '', petAge: '', message: '' });
      } else {
        setSubmitStatus({ type: 'error', message: '전송 중 오류가 발생했습니다. 다시 시도해주세요.' });
      }
    } catch (error) {
      console.error('상담 신청 오류:', error);
      setSubmitStatus({ type: 'error', message: '네트워크 오류가 발생했습니다.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const HomePage = () => (
    <div className="min-h-screen">
      {/* Hero Section - Global Standard */}
      <section className="relative min-h-[90vh] bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Trust badges */}
            <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-6 mb-8">
              <span className="bg-white/20 backdrop-blur-sm text-white px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium">
                ⭐ 4.9/5 고객 만족도
              </span>
              <span className="bg-white/20 backdrop-blur-sm text-white px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium">
                🏆 8개 보험사 제휴
              </span>
              <span className="hidden sm:block bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
                🤖 Claude AI 기반
              </span>
            </div>

            <h1 className="text-5xl sm:text-7xl font-black text-white mb-6 tracking-tight">
              🐾 PetCare<span className="text-yellow-300">+</span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-white/90 mb-4 max-w-3xl mx-auto">
              AI가 찾아주는 <span className="text-yellow-300 font-bold">내 반려동물 맞춤 보험</span>
            </p>
            
            <p className="text-base sm:text-lg text-white/70 mb-10 max-w-2xl mx-auto">
              8개 보험사 실시간 비교 · 24시간 무료 AI 상담 · 30초만에 견적 확인
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button onClick={() => setActiveSection('recommendation')}
                className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 px-8 sm:px-10 py-4 sm:py-5 rounded-2xl font-bold text-lg sm:text-xl transition transform hover:scale-105 shadow-2xl">
                🚀 무료 맞춤 견적 받기
              </button>
              <button onClick={() => setShowChatBot(true)}
                className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-2 border-white/30 px-8 sm:px-10 py-4 sm:py-5 rounded-2xl font-bold text-lg sm:text-xl transition">
                💬 AI 상담 시작하기
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-2xl sm:text-4xl font-black text-white">8개</div>
                <div className="text-white/70 text-xs sm:text-sm">제휴 보험사</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-4xl font-black text-white">24시간</div>
                <div className="text-white/70 text-xs sm:text-sm">AI 상담</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-4xl font-black text-white">30초</div>
                <div className="text-white/70 text-xs sm:text-sm">견적 소요</div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating pets illustration */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-6xl sm:text-8xl opacity-30">
          🐕 🐈 🐾
        </div>
      </section>

      {/* How It Works - 3 Steps */}
      <section className="py-16 sm:py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4 text-center">
            간단 3단계로 최적의 보험 찾기
          </h2>
          <p className="text-gray-600 text-center mb-12 sm:mb-16 text-base sm:text-lg">Pawlicy, MoneySuperMarket처럼 쉽고 빠르게</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              { step: '01', icon: '📝', title: '정보 입력', desc: '반려동물 종류, 나이, 품종만 입력하세요', color: 'from-blue-500 to-blue-600' },
              { step: '02', icon: '🤖', title: 'AI 분석', desc: 'Claude AI가 8개 보험사를 실시간 비교 분석', color: 'from-purple-500 to-purple-600' },
              { step: '03', icon: '✅', title: '맞춤 추천', desc: '최적의 보험상품 3개를 즉시 추천받기', color: 'from-green-500 to-green-600' }
            ].map((item, idx) => (
              <div key={idx} className="relative">
                <div className={`bg-gradient-to-br ${item.color} rounded-3xl p-6 sm:p-8 text-white h-full`}>
                  <div className="text-5xl sm:text-6xl mb-4">{item.icon}</div>
                  <div className="text-sm font-bold opacity-70 mb-2">STEP {item.step}</div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-3">{item.title}</h3>
                  <p className="text-white/80 text-sm sm:text-base">{item.desc}</p>
                </div>
                {idx < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-4xl text-gray-300">→</div>
                )}
              </div>
            ))}
          </div>
          
          <div className="text-center mt-10 sm:mt-12">
            <button onClick={() => setActiveSection('recommendation')}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-10 sm:px-12 py-4 rounded-xl font-bold text-base sm:text-lg hover:shadow-xl transition">
              지금 바로 시작하기 →
            </button>
          </div>
        </div>
      </section>

      {/* Insurance Companies */}
      <section className="py-16 sm:py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4 text-center">
            🏢 8개 메이저 보험사 한눈에 비교
          </h2>
          <p className="text-gray-600 text-center mb-10 sm:mb-12 text-base sm:text-lg">국내 주요 펫보험사를 모두 비교해보세요</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {[
              { name: '메리츠화재', product: '펫퍼민트', color: 'bg-red-50 border-red-200', rating: '4.8' },
              { name: '삼성화재', product: '위풍댕댕', color: 'bg-blue-50 border-blue-200', rating: '4.7' },
              { name: 'DB손해보험', product: '아이러브펫', color: 'bg-green-50 border-green-200', rating: '4.6' },
              { name: '현대해상', product: '굿앤굿', color: 'bg-orange-50 border-orange-200', rating: '4.7' },
              { name: 'KB손해보험', product: '금쪽같은펫', color: 'bg-yellow-50 border-yellow-200', rating: '4.5' },
              { name: '한화손해보험', product: '펫함께', color: 'bg-indigo-50 border-indigo-200', rating: '4.4' },
              { name: '농협손해보험', product: '펫케어', color: 'bg-emerald-50 border-emerald-200', rating: '4.5' },
              { name: '롯데손해보험', product: '펫건강', color: 'bg-pink-50 border-pink-200', rating: '4.3' }
            ].map((company, idx) => (
              <div key={idx} className={`${company.color} border-2 rounded-2xl p-4 sm:p-5 hover:shadow-lg transition cursor-pointer`}
                onClick={() => setActiveSection('comparison')}>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xl sm:text-2xl">🏦</span>
                  <span className="text-xs sm:text-sm text-yellow-600 font-bold">⭐ {company.rating}</span>
                </div>
                <h4 className="font-bold text-gray-900 text-sm sm:text-base">{company.name}</h4>
                <p className="text-xs sm:text-sm text-gray-600">{company.product}</p>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8 sm:mt-10">
            <button onClick={() => setActiveSection('comparison')}
              className="text-blue-600 font-bold hover:underline text-base sm:text-lg">
              상세 비교표 보기 →
            </button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 sm:py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4 text-center">
            🛠️ 강력한 분석 도구
          </h2>
          <p className="text-gray-600 text-center mb-10 sm:mb-12 text-base sm:text-lg">글로벌 펫보험 플랫폼 수준의 기능 제공</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[
              { icon: '🤖', title: 'AI 맞춤 추천', desc: 'Claude AI가 당신의 반려동물에 최적화된 보험 추천', action: () => setActiveSection('recommendation'), badge: 'BEST' },
              { icon: '📊', title: '8개사 비교', desc: '보험료, 보장내용, 자기부담금 한눈에 비교', action: () => setActiveSection('comparison') },
              { icon: '📈', title: '차트 분석', desc: '레이더/막대/라인 차트로 다차원 비교', action: () => setActiveSection('chart') },
              { icon: '🔍', title: '고급 필터', desc: '7가지 조건으로 맞춤 보험 검색', action: () => setActiveSection('filter') },
              { icon: '🧠', title: '성향 분석', desc: '5가지 질문으로 보험 성향 파악', action: () => setActiveSection('personality') },
              { icon: '📚', title: '교육 센터', desc: '펫보험 용어, FAQ, 청구 가이드', action: () => setActiveSection('education') },
              { icon: '💰', title: '의료비 계산', desc: '월 예상 진료비 자동 계산기', action: () => setActiveSection('calculator') },
              { icon: '🏥', title: '병원 검색', desc: '현재 위치 기반 동물병원 찾기', action: () => setActiveSection('hospital') },
              { icon: '📋', title: '청구 가이드', desc: '6단계 보험금 청구 절차 안내', action: () => setActiveSection('claim') }
            ].map((item, idx) => (
              <button key={idx} onClick={item.action} 
                className="relative bg-white border-2 border-gray-100 hover:border-blue-300 hover:shadow-xl p-5 sm:p-6 rounded-2xl transition text-left group">
                {item.badge && (
                  <span className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-400 to-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {item.badge}
                  </span>
                )}
                <div className="text-3xl sm:text-4xl mb-3 sm:mb-4 group-hover:scale-110 transition">{item.icon}</div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4">{item.desc}</p>
                <span className="text-blue-500 font-semibold text-xs sm:text-sm group-hover:text-blue-600">시작하기 →</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Consultation Form */}
      <section id="consultation" className="py-16 sm:py-20 px-4 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-black text-gray-800 mb-4 text-center">💬 무료 전문 상담</h2>
          <p className="text-center text-gray-600 mb-8 sm:mb-12 text-sm sm:text-base">전문가와의 무료 상담을 신청하세요. 24시간 내에 연락드리겠습니다.</p>

          <form onSubmit={handleConsultationSubmit} className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-8 space-y-5 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">이름 *</label>
                <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="홍길동" className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 outline-none text-sm sm:text-base" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">연락처 *</label>
                <input type="tel" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="010-0000-0000" className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 outline-none text-sm sm:text-base" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">이메일 *</label>
                <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@example.com" className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 outline-none text-sm sm:text-base" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">반려동물 이름</label>
                <input type="text" value={formData.petName} onChange={(e) => setFormData({ ...formData, petName: e.target.value })}
                  placeholder="뽀삐" className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 outline-none text-sm sm:text-base" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">나이</label>
                <input type="number" value={formData.petAge} onChange={(e) => setFormData({ ...formData, petAge: e.target.value })}
                  placeholder="3" className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 outline-none text-sm sm:text-base" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">상담 내용</label>
              <textarea value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="궁금하신 사항을 입력해주세요..." rows="4"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 outline-none text-sm sm:text-base"></textarea>
            </div>

            {submitStatus && (
              <div className={`p-4 rounded-xl ${submitStatus.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>
                {submitStatus.message}
              </div>
            )}

            <button type="submit" disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow-lg text-white py-4 rounded-xl font-bold text-base sm:text-lg transition disabled:opacity-50 disabled:cursor-not-allowed">
              {isSubmitting ? '전송 중...' : '✉️ 무료 상담 신청하기'}
            </button>

            <p className="text-xs text-gray-500 text-center">본 서비스는 정보 제공용이며 보험 권유가 아닙니다. 개인정보는 상담 목적으로만 사용됩니다.</p>
          </form>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 sm:py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4 text-center">❓ 자주 묻는 질문</h2>
          <p className="text-gray-600 text-center mb-10 sm:mb-12 text-base sm:text-lg">펫보험에 대해 궁금한 점을 확인하세요</p>
          
          <div className="space-y-4">
            {[
              { q: '펫보험은 언제 가입하는 게 좋나요?', a: '반려동물이 어릴 때 가입할수록 보험료가 저렴하고 보장 범위도 넓습니다. 보통 생후 8주~10세 사이에 가입이 가능합니다.' },
              { q: '기존 질병이 있어도 가입할 수 있나요?', a: '대부분의 보험사에서 기존 질병(기왕증)은 보장에서 제외됩니다. 가입 전 반려동물의 건강 상태를 정확히 알려주셔야 합니다.' },
              { q: '보험료는 얼마 정도 하나요?', a: '반려동물의 종류, 나이, 품종에 따라 월 1만원~5만원 사이입니다. AI 추천 기능으로 맞춤 견적을 받아보세요.' },
              { q: '어떤 항목이 보장되나요?', a: '일반적으로 수술비, 입원비, 통원비, 진단검사비 등이 보장됩니다. 상품마다 보장 범위가 다르니 비교해보세요.' }
            ].map((item, idx) => (
              <details key={idx} className="bg-gray-50 rounded-2xl p-5 sm:p-6 group">
                <summary className="font-bold text-gray-900 cursor-pointer flex justify-between items-center text-sm sm:text-base">
                  {item.q}
                  <span className="text-blue-500 group-open:rotate-180 transition">▼</span>
                </summary>
                <p className="mt-4 text-gray-600 text-sm sm:text-base leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
          
          <div className="text-center mt-8 sm:mt-10">
            <button onClick={() => setActiveSection('education')}
              className="text-blue-600 font-bold hover:underline text-base sm:text-lg">
              더 많은 FAQ 보기 →
            </button>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-10 sm:py-12 px-4 bg-amber-50 border-t-4 border-amber-300">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">⚠️ 면책 공고</h3>
          <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
            본 플랫폼은 펫보험 가입을 권유하는 것이 아니며, <strong>정보 제공</strong> 목적입니다.
            정확한 가입 조건, 보장 내용, 보험료는 각 보험사에 직접 문의하시기 바랍니다.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 sm:py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="font-bold text-xl sm:text-2xl mb-4">🐾 PetCare+</h4>
              <p className="text-gray-400 text-sm sm:text-base">AI 기반 펫보험 비교 플랫폼<br />24시간 무료 Claude AI 상담 서비스</p>
              <div className="flex gap-2 mt-4">
                <span className="bg-white/10 px-3 py-1 rounded-full text-xs">⭐ 4.9/5</span>
                <span className="bg-white/10 px-3 py-1 rounded-full text-xs">🏆 8개사 제휴</span>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4">제휴 보험사 (8개)</h4>
              <ul className="space-y-1 text-sm text-gray-400">
                <li>• 메리츠화재 (펫퍼민트)</li>
                <li>• 삼성화재 (위풍댕댕)</li>
                <li>• DB손보 (아이러브펫)</li>
                <li>• 현대해상 (굿앤굿)</li>
                <li>• KB손보 (금쪽같은펫)</li>
                <li>• 한화손보 / 농협손보 / 롯데손보</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4">📧 연락처</h4>
              <p className="text-gray-400 text-sm">
                {COMPANY_INFO.email}<br />
                <span className="text-xs">💬 우측 하단 AI 챗봇에서 24시간 무료 상담 가능</span>
              </p>
              <button onClick={() => setShowChatBot(true)}
                className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition">
                💬 AI 상담 시작
              </button>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8 text-center text-gray-500 text-xs">
            <p>
              {COMPANY_INFO.name} | 
              사업자등록번호: {COMPANY_INFO.businessNumber} | 
              대표전화: {COMPANY_INFO.phone}
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
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button onClick={() => setActiveSection('home')} className="text-xl sm:text-2xl font-black text-blue-600 flex items-center gap-2 hover:text-blue-700">
              🐾 PetCare<span className="text-yellow-500">+</span>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-4 xl:gap-6">
              <button onClick={() => setActiveSection('recommendation')} className="text-gray-700 hover:text-blue-600 font-medium text-sm">AI 추천</button>
              <button onClick={() => setActiveSection('comparison')} className="text-gray-700 hover:text-blue-600 font-medium text-sm">보험 비교</button>
              <button onClick={() => setActiveSection('chart')} className="text-gray-700 hover:text-blue-600 font-medium text-sm">차트</button>
              <button onClick={() => setActiveSection('filter')} className="text-gray-700 hover:text-blue-600 font-medium text-sm">필터</button>
              <button onClick={() => setActiveSection('personality')} className="text-gray-700 hover:text-blue-600 font-medium text-sm">성향</button>
              <button onClick={() => setActiveSection('education')} className="text-gray-700 hover:text-blue-600 font-medium text-sm">교육</button>
              <button onClick={() => setActiveSection('calculator')} className="text-gray-700 hover:text-blue-600 font-medium text-sm">계산기</button>
              <button onClick={() => setActiveSection('hospital')} className="text-gray-700 hover:text-blue-600 font-medium text-sm">병원</button>
              <button onClick={() => setActiveSection('claim')} className="text-gray-700 hover:text-blue-600 font-medium text-sm">청구</button>
              <button onClick={() => setActiveSection('mypage')} className="text-gray-700 hover:text-blue-600 font-medium text-sm">마이페이지</button>
              <button onClick={() => setShowChatBot(true)} className="bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-lg text-white px-4 py-2 rounded-xl font-medium text-sm transition">💬 AI 상담</button>
            </div>

            {/* Mobile Menu Button */}
            <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="lg:hidden text-gray-700 p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {showMobileMenu ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Navigation - Vertical */}
          {showMobileMenu && (
            <div className="lg:hidden py-4 border-t border-gray-100">
              <div className="flex flex-col space-y-1">
                <button onClick={() => { setActiveSection('recommendation'); setShowMobileMenu(false); }} className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium py-3 px-4 rounded-xl text-left text-sm">🤖 AI 추천</button>
                <button onClick={() => { setActiveSection('comparison'); setShowMobileMenu(false); }} className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium py-3 px-4 rounded-xl text-left text-sm">📊 보험 비교</button>
                <button onClick={() => { setActiveSection('chart'); setShowMobileMenu(false); }} className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium py-3 px-4 rounded-xl text-left text-sm">📈 차트 분석</button>
                <button onClick={() => { setActiveSection('filter'); setShowMobileMenu(false); }} className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium py-3 px-4 rounded-xl text-left text-sm">🔍 고급 필터</button>
                <button onClick={() => { setActiveSection('personality'); setShowMobileMenu(false); }} className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium py-3 px-4 rounded-xl text-left text-sm">🧠 성향 분석</button>
                <button onClick={() => { setActiveSection('education'); setShowMobileMenu(false); }} className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium py-3 px-4 rounded-xl text-left text-sm">📚 교육 센터</button>
                <button onClick={() => { setActiveSection('calculator'); setShowMobileMenu(false); }} className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium py-3 px-4 rounded-xl text-left text-sm">💰 의료비 계산</button>
                <button onClick={() => { setActiveSection('hospital'); setShowMobileMenu(false); }} className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium py-3 px-4 rounded-xl text-left text-sm">🏥 병원 검색</button>
                <button onClick={() => { setActiveSection('claim'); setShowMobileMenu(false); }} className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium py-3 px-4 rounded-xl text-left text-sm">📋 청구 가이드</button>
                <button onClick={() => { setActiveSection('mypage'); setShowMobileMenu(false); }} className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium py-3 px-4 rounded-xl text-left text-sm">👤 마이페이지</button>
                <button onClick={() => { setShowChatBot(true); setShowMobileMenu(false); }} className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium py-3 px-4 rounded-xl text-left mt-2 text-sm">💬 AI 상담 시작</button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      {activeSection === 'home' ? <HomePage /> : sections[activeSection]}
      
      {/* ChatBot */}
      {showChatBot && <ChatBot onClose={() => setShowChatBot(false)} />}

      {/* Scroll to Top Button */}
      <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-24 right-6 bg-gray-800 hover:bg-gray-700 text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center z-30 transition">
        ↑
      </button>

      {/* Floating Chat Button (when chatbot is closed) */}
      {!showChatBot && (
        <button onClick={() => setShowChatBot(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-2xl text-white w-16 h-16 rounded-full shadow-xl flex items-center justify-center z-30 transition transform hover:scale-110">
          <span className="text-2xl">💬</span>
        </button>
      )}
    </div>
  );
};

export default App;
