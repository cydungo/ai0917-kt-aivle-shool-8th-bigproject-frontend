import { useEffect, useState } from 'react';
import {
  Routes,
  Route,
  useLocation,
  useNavigate,
  Navigate,
} from 'react-router-dom';
import { LandingPage } from './pages/landing/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { SignupPage } from './pages/auth/SignupPage';
import { ManagerDashboard } from './pages/dashboard/ManagerDashboard';
import { AuthorDashboard } from './pages/dashboard/AuthorDashboard';
import { AdminDashboard } from './pages/dashboard/AdminDashboard';
import PrivacyPolicy from './pages/legal/PrivacyPolicy';
import TermsPage from './pages/legal/TermsPage';

// 사용자 타입 정의
type UserType = 'Manager' | 'Author' | 'Admin' | null;

export default function App() {
  const [userType, setUserType] = useState<UserType>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // 1. 초기 로드 및 경로 변경 시 인증 상태 체크
  useEffect(() => {
    const role = localStorage.getItem('userRole') as UserType | null;
    const token = localStorage.getItem('accessToken');

    if (role && token) {
      setUserType(role);
    } else {
      setUserType(null);
    }
  }, [location.pathname]);

  // 2. 로그인 처리 함수
  const handleLogin = (type: UserType, token: string) => {
    if (!type || !token) return;
    setUserType(type);
    localStorage.setItem('userRole', type);
    localStorage.setItem('accessToken', token);
    navigate('/', { replace: true });
  };

  // 3. 로그아웃 처리 함수
  const handleLogout = () => {
    setUserType(null);
    localStorage.removeItem('userRole');
    localStorage.removeItem('accessToken');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background">
      <Routes>
        {/* 메인 경로 (권한별 대시보드 분기) */}
        <Route
          path="/"
          element={
            userType === 'Manager' ? (
              <ManagerDashboard
                onLogout={handleLogout}
                onHome={() => navigate('/')}
              />
            ) : userType === 'Author' ? (
              <AuthorDashboard
                onLogout={handleLogout}
                onHome={() => navigate('/')}
              />
            ) : userType === 'Admin' ? (
              <AdminDashboard
                onLogout={handleLogout}
                onHome={() => navigate('/')}
              />
            ) : (
              <LandingPage onSignInClick={() => navigate('/login')} />
            )
          }
        />

        {/* 로그인 페이지 */}
        <Route
          path="/login"
          element={
            userType ? (
              <Navigate to="/" replace />
            ) : (
              <LoginPage
                onLogin={(type) =>
                  handleLogin(type, localStorage.getItem('accessToken') || '')
                }
                onBack={() => navigate('/')}
                onSignup={() => navigate('/signup')}
              />
            )
          }
        />

        {/* 회원가입 페이지 (네이버 리다이렉트 데이터 수신 포함) */}
        <Route
          path="/signup"
          element={
            <SignupPage
              onSignupComplete={() => navigate('/login')}
              onBack={() => navigate('/login')}
            />
          }
        />

        {/* 법적 약관 페이지 */}
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />

        {/* 404 처리: 정의되지 않은 경로는 메인으로 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
