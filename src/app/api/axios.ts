// import axios from 'axios';

// const apiClient = axios.create({
//   baseURL: import.meta.env.VITE_BACKEND_URL,
//   withCredentials: true,
//   withXSRFToken: true,
//   xsrfCookieName: 'XSRF-TOKEN',
//   xsrfHeaderName: 'X-XSRF-TOKEN',
//   headers: { 'Content-Type': 'application/json' },
// });

// export default apiClient;

import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
  withXSRFToken: true,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
  headers: { 'Content-Type': 'application/json' },
});

// ⭐ 추가된 부분: 요청을 보내기 직전에 토큰을 가로채서 헤더에 삽입합니다.
apiClient.interceptors.request.use(
  (config) => {
    // 로컬 스토리지에서 토큰을 가져옵니다. 
    // 로그인 시 저장했던 키 이름(예: 'accessToken', 'token' 등)을 확인하세요.
    const token = localStorage.getItem('accessToken'); 

    if (token && config.headers) {
      // 헤더에 Authorization: Bearer [토큰] 을 추가합니다.
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
