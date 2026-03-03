// src/components/HospitalFinder.jsx
// 임시 버전: Google Maps API 없이 기본 병원 정보 표시
// 추후 Google Maps 통합으로 보완 예정

import React, { useState } from 'react';

const HospitalFinder = () => {
  const [showInfo, setShowInfo] = useState(false);

  // 임시 병원 목록 데이터
  const hospitalList = [
    { id: 1, name: '24시간 응급동물병원', address: '서울시 강남구', phone: '02-XXXX-XXXX', type: '응급' },
    { id: 2, name: '종로 동물의료센터', address: '서울시 종로구', phone: '02-XXXX-XXXX', type: '종합' },
    { id: 3, name: '반려동물 건강검진원', address: '서울시 마포구', phone: '02-XXXX-XXXX', type: '검진' },
    { id: 4, name: '펫 케어 수의원', address: '서울시 송파구', phone: '02-XXXX-XXXX', type: '일반' },
    { id: 5, name: '동물보건센터', address: '서울시 성동구', phone: '02-XXXX-XXXX', type: '예방' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">🏥 동물병원 검색</h1>
          <p className="text-gray-600 text-lg">
            반려동물 건강관리를 위한 최적의 동물병원을 찾아보세요
          </p>
        </div>

        {/* 안내 메시지 */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-8">
          <div className="flex items-start gap-4">
            <span className="text-3xl">🔄</span>
            <div>
              <h3 className="font-bold text-blue-900 mb-2">병원 검색 기능 개선 중</h3>
              <p className="text-blue-800">
                현재 Google Maps API를 통합하여 실시간 위치 기반 병원 검색 기능을 개발 중입니다.
              </p>
              <p className="text-blue-700 text-sm mt-2">
                ✨ 다음 업데이트에서는 현재 위치 기반 주변 병원 검색, 실시간 지도, 병원별 상세 정보를 제공할 예정입니다.
              </p>
            </div>
          </div>
        </div>

        {/* 기본 병원 정보 */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-blue-500 p-6">
            <h2 className="text-white text-2xl font-bold flex items-center gap-2">
              📋 주요 동물병원 목록
            </h2>
          </div>

          <div className="p-6">
            <div className="grid gap-4">
              {hospitalList.map((hospital) => (
                <div
                  key={hospital.id}
                  className="border border-gray-200 rounded-lg p-5 hover:shadow-md hover:border-blue-300 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">{hospital.name}</h3>
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full mt-1">
                        {hospital.type}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 text-gray-600">
                    <p className="flex items-center gap-2">
                      <span className="text-lg">📍</span> {hospital.address}
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="text-lg">📞</span> {hospital.phone}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 다음 단계 안내 */}
        <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="font-bold text-green-900 mb-3">🚀 다음 업데이트 예정</h3>
          <ul className="space-y-2 text-green-800">
            <li>✅ 현재 위치 기반 반경 2km 이내 병원 검색</li>
            <li>✅ Google Maps 통합으로 실시간 지도 표시</li>
            <li>✅ 병원별 진료 시간, 의료진 정보</li>
            <li>✅ 사용자 후기 및 방문 예약</li>
          </ul>
        </div>

        {/* CTA */}
        <div className="mt-8 text-center">
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-3 px-8 rounded-lg transition-all shadow-lg"
          >
            🏥 병원 검색 기능 알아보기
          </button>
        </div>

        {showInfo && (
          <div className="mt-8 bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="font-bold text-gray-800 mb-4">병원 검색 기능 정보</h3>
            <div className="space-y-4 text-gray-700">
              <p>
                <strong>🎯 현재 상태:</strong> 기본 병원 정보 제공 (임시 버전)
              </p>
              <p>
                <strong>📍 위치 기반 검색:</strong> Google Maps API 통합을 통해 실시간 위치 기반 병원 검색 지원 예정
              </p>
              <p>
                <strong>🗓️ 예상 업데이트:</strong> 2주 이내로 완전한 지도 기능 및 검색 기능 지원
              </p>
              <p>
                <strong>💬 피드백:</strong> 원하시는 기능이 있으신가요? 우측 하단 ChatBot에서 의견을 주세요!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HospitalFinder;
