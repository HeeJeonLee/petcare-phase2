// src/components/HospitalFinder.jsx
// Google Maps API 기반 주변 동물병원 검색
// 위치 기반 서비스 + 병원 정보 표시

import React, { useState, useRef, useEffect } from 'react';

const HospitalFinder = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  // Google Maps API 스크립트 로드
  useEffect(() => {
    const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    if (!googleMapsApiKey) {
      setError('Google Maps API 키가 설정되지 않았습니다');
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=places,marker`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      setMapLoaded(true);
      console.log('✅ Google Maps API 로드됨');
    };

    script.onerror = () => {
      setError('Google Maps API 로드 실패');
      console.error('❌ Google Maps API 로드 실패');
    };

    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setError('브라우저에서 위치 정보를 지원하지 않습니다');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        searchHospitals(latitude, longitude);
      },
      (err) => {
        setError(`위치 정보 접근 실패: ${err.message}`);
        setLoading(false);
      }
    );
  };

  const searchHospitals = async (lat, lng) => {
    if (!mapLoaded || !window.google) {
      setError('Google Maps API가 아직 로드되지 않았습니다');
      return;
    }

    const location = { lat, lng };
    const service = new window.google.maps.places.PlacesService(
      document.createElement('div')
    );

    const request = {
      location: location,
      radius: 2000,
      keyword: '동물병원',
      language: 'ko'
    };

    service.nearbySearch(request, (results, status) => {
      setLoading(false);

      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        const formattedHospitals = results
          .filter(place => place.name.includes('동물병원') || place.name.includes('수의'))
          .map(place => ({
            id: place.place_id,
            name: place.name,
            address: place.vicinity || '주소 정보 없음',
            rating: place.rating || 0,
            reviewCount: place.user_ratings_total || 0,
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
            openNow: place.opening_hours?.open_now,
            types: place.types || [],
            photos: place.photos || [],
            distance: calculateDistance(lat, lng, place.geometry.location.lat(), place.geometry.location.lng())
          }))
          .sort((a, b) => a.distance - b.distance)
          .slice(0, 15);

        setHospitals(formattedHospitals);

        if (formattedHospitals.length > 0) {
          initializeMap(formattedHospitals, location);
        }
      } else {
        setError(`병원 검색 실패: ${status}`);
      }
    });
  };

  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const initializeMap = (hospitalList, center) => {
    if (!mapRef.current || !window.google) return;

    mapInstance.current = new window.google.maps.Map(mapRef.current, {
      zoom: 15,
      center: center,
      mapTypeControl: true,
      fullscreenControl: true,
      streetViewControl: false
    });

    new window.google.maps.Marker({
      position: center,
      map: mapInstance.current,
      title: '내 위치',
      icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
    });

    hospitalList.forEach((hospital, index) => {
      const marker = new window.google.maps.Marker({
        position: { lat: hospital.lat, lng: hospital.lng },
        map: mapInstance.current,
        title: hospital.name,
        label: {
          text: (index + 1).toString(),
          color: 'white',
          fontSize: '14px',
          fontWeight: 'bold'
        }
      });

      marker.addListener('click', () => {
        setSelectedHospital(hospital);
      });
    });
  };

  const getHospitalPhoto = (hospital) => {
    if (hospital.photos && hospital.photos.length > 0) {
      return hospital.photos[0].getUrl({ maxWidth: 400, maxHeight: 300 });
    }
    return 'https://via.placeholder.com/400x300?text=병원+이미지+없음';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">🏥 주변 동물병원 찾기</h1>
          <p className="text-lg text-gray-600">현재 위치 기반으로 신뢰할 수 있는 동물병원을 추천합니다</p>
        </div>

        {!userLocation && (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">📍 위치 허용이 필요합니다</h2>
            <p className="text-gray-600 mb-6">가장 가까운 동물병원을 찾기 위해 위치 정보가 필요합니다</p>
            <button
              onClick={handleGetLocation}
              disabled={loading}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-lg font-bold text-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? '위치 확인 중...' : '📍 위치 허용 및 병원 검색'}
            </button>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg mb-8">
            {error}
          </div>
        )}

        {userLocation && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div
                ref={mapRef}
                className="w-full h-96 lg:h-[600px] rounded-2xl shadow-lg border border-gray-200"
              ></div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800">
                  {hospitals.length}개 병원 발견
                </h3>
                <button
                  onClick={handleGetLocation}
                  className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg transition"
                >
                  재검색
                </button>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {hospitals.map((hospital, index) => (
                  <div
                    key={hospital.id}
                    onClick={() => setSelectedHospital(hospital)}
                    className={`p-4 rounded-lg cursor-pointer transition border-2 ${
                      selectedHospital?.id === hospital.id
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 bg-white hover:border-green-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-800 truncate">{hospital.name}</h4>
                        <p className="text-sm text-gray-600 truncate">{hospital.address}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-yellow-400">★</span>
                          <span className="text-sm font-semibold text-gray-700">
                            {hospital.rating.toFixed(1)} ({hospital.reviewCount})
                          </span>
                          <span className="text-xs text-gray-500">
                            {hospital.distance.toFixed(1)}km
                          </span>
                        </div>
                        {hospital.openNow !== undefined && (
                          <span className={`text-xs font-bold mt-1 inline-block px-2 py-1 rounded ${
                            hospital.openNow
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {hospital.openNow ? '영업중' : '영업시간 확인'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedHospital && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">{selectedHospital.name}</h2>
                <button
                  onClick={() => setSelectedHospital(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ✕
                </button>
              </div>

              <div className="p-6 space-y-6">
                <img
                  src={getHospitalPhoto(selectedHospital)}
                  alt={selectedHospital.name}
                  className="w-full h-64 object-cover rounded-lg"
                />

                <div>
                  <h3 className="font-bold text-gray-800 mb-2">📍 주소</h3>
                  <p className="text-gray-600">{selectedHospital.address}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-bold text-gray-800 mb-2">⭐ 평점</h3>
                    <p className="text-2xl font-bold text-yellow-500">
                      {selectedHospital.rating.toFixed(1)}
                    </p>
                    <p className="text-sm text-gray-600">리뷰 {selectedHospital.reviewCount}개</p>
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-800 mb-2">📏 거리</h3>
                    <p className="text-2xl font-bold text-blue-600">
                      {selectedHospital.distance.toFixed(1)} km
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${selectedHospital.lat},${selectedHospital.lng}`;
                      window.open(mapsUrl, '_blank');
                    }}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-bold transition"
                  >
                    🗺️ 길찾기
                  </button>

                  <button
                    onClick={() => {
                      const mapsUrl = `https://www.google.com/maps/search/${selectedHospital.name}`;
                      window.open(mapsUrl, '_blank');
                    }}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-bold transition"
                  >
                    📞 더 보기
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HospitalFinder;
