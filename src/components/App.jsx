import React from "react";
import "../index.css";

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      {/* 헤더 */}
      <header className="w-full bg-blue-900 text-white py-6 shadow">
        <div className="container mx-auto flex flex-col items-center">
          <h1 className="text-3xl font-bold">새론대부금융중개(주)</h1>
          <div className="text-lg font-medium mt-1">Saeloan Financial</div>
          <p className="mt-2">대표자: 김덕진 | 등록번호: 2026-XXXX-0000 | 대표전화: 010-XXXX-XXXX</p>
        </div>
      </header>

      {/* 메인 */}
      <main className="flex-1 w-full container mx-auto py-10 px-4">
        {/* 서비스 소개 */}
        <section className="mb-10 text-center">
          <h2 className="text-2xl font-semibold mb-4">합리적 한도, 신속한 상담</h2>
          <p className="mb-2">전국 대형 대부사 비교, AI 한도조회, 빠른 승인 안내</p>
          <button className="mt-4 px-6 py-3 bg-blue-700 text-white rounded shadow hover:bg-blue-800">
            한도조회/상담신청
          </button>
        </section>

        {/* 회사 소개 */}
        <section className="mb-10">
          <h3 className="text-xl font-bold mb-2">회사 소개</h3>
          <ul className="list-disc ml-6 text-gray-700">
            <li>상호: 새론대부금융중개(주)</li>
            <li>대표자: 김덕진</li>
            <li>등록번호: 2026-XXXX-0000</li>
            <li>대표전화: 010-XXXX-XXXX</li>
            <li>주소: (입력)</li>
          </ul>
        </section>

        {/* 법정 고지사항 */}
        <section className="mb-10 bg-gray-100 p-4 rounded">
          <h4 className="font-semibold mb-2">법정 고지사항</h4>
          <ul className="list-disc ml-6 text-sm text-gray-600">
            <li>이자율: 연 20% 이내(법정최고금리)</li>
            <li>중개수수료: 없음</li>
            <li>대출 시 귀하의 신용등급이 하락할 수 있습니다.</li>
            <li>과도한 대출은 개인신용평점 하락 및 금융거래 제한의 원인이 될 수 있습니다.</li>
            <li>새론대부금융중개(주)는 대부중개업체로, 직접 대출을 실행하지 않습니다.</li>
          </ul>
        </section>

        {/* 개인정보처리방침/이용약관 */}
        <section className="mb-10">
          <a href="#" className="text-blue-700 underline mr-4">개인정보처리방침</a>
          <a href="#" className="text-blue-700 underline">이용약관</a>
        </section>
      </main>

      {/* 푸터 */}
      <footer className="w-full bg-gray-800 text-gray-200 py-4 text-center text-xs">
        &copy; 2026 새론대부금융중개(주). 모든 권리 보유. | 광고·상담·신고: 관할 지자체
      </footer>
    </div>
  );
}

export default App;
