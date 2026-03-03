// src/main.jsx
// React 애플리케이션 진입점

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// 개발 환경 확인
if (import.meta.env.DEV) {
  console.log('🔧 개발 모드 실행 중...');
  console.log('📦 API URL:', import.meta.env.VITE_API_URL);
}

// 프로덕션 환경 확인
if (import.meta.env.PROD) {
  console.log('🚀 프로덕션 모드 실행 중');
  
  // Google Analytics 로드
  if (import.meta.env.VITE_GA_ID) {
    console.log('📊 Google Analytics 로드됨');
  }
}

// React 렌더링
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
