import { useEffect, useMemo, useState } from 'react';
import { LandingPage } from './pages/landing/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { SignupPage as SignupPage2 } from './pages/auth/SignupPage2';
import { ManagerDashboard } from './pages/dashboard/ManagerDashboard';
import { AuthorDashboard } from './pages/dashboard/AuthorDashboard';
import { AdminDashboard } from './pages/dashboard/AdminDashboard';
import {
  Routes,
  Route,
  useLocation,
  useNavigate,
  Navigate,
} from 'react-router-dom';
import RedirectURI from './pages/auth/RedirectURI';

type Screen = 'landing' | 'login' | 'signup' | 'dashboard';
type UserType = 'Manager' | 'Author' | 'Admin' | null;

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing');
  const [userType, setUserType] = useState<UserType>(null);
  const [pendingSignupData, setPendingSignupData] = useState<Record<
    string,
    any
  > | null>(null);

  const location = useLocation();
  const navigate = useNavigate();

  const handleSignInClick = () => navigate('/login');
  const handleSignupClick = () => navigate('/signup');
  const handleGoHome = () => navigate('/');
  const handleLogout = () => {
    setUserType(null);
    localStorage.removeItem('userRole');
    localStorage.removeItem('accessToken');
    navigate('/login');
  };

  const handleSignupComplete = () => {
    setPendingSignupData(null);
    navigate('/login');
  };

  const handleLogin = (type: 'Manager' | 'Author' | 'Admin') => {
    // 1. 상태 업데이트 (UI 즉시 반응)
    setUserType(type);
    // 2. 저장
    localStorage.setItem('userRole', type);
    // 3. 이동 (replace: true로 인증 기록 제거)
    navigate('/', { replace: true });
  };

  const handleRequireSignup = (profile: Record<string, any>) => {
    setPendingSignupData(profile);
    navigate('/signup2');
  };

  useEffect(() => {
    const role = localStorage.getItem('userRole') as UserType | null;
    const token = localStorage.getItem('accessToken');

    // 토큰과 역할이 모두 있을 때만 로그인 상태로 인정
    if (role && token) {
      setUserType(role);
    } else {
      setUserType(null);
    }
  }, [location.pathname]); // 경로가 바뀔 때마다 체크

  return (
    <div className="min-h-screen bg-background">
      <Routes>
        <Route
          path="/"
          element={
            userType === 'Manager' ? (
              <ManagerDashboard onLogout={handleLogout} onHome={handleGoHome} />
            ) : userType === 'Author' ? (
              <AuthorDashboard onLogout={handleLogout} onHome={handleGoHome} />
            ) : userType === 'Admin' ? (
              <AdminDashboard onLogout={handleLogout} onHome={handleGoHome} />
            ) : (
              <LandingPage onSignInClick={handleSignInClick} />
            )
          }
        />
        <Route
          path="/login"
          element={
            // [추가] 이미 로그인된 유저가 뒤로가기로 로그인 페이지에 오면 메인으로 튕김
            userType ? (
              <Navigate to="/" replace />
            ) : (
              <LoginPage
                onLogin={handleLogin}
                onBack={handleGoHome}
                onSignup={handleSignupClick}
              />
            )
          }
        />
        <Route
          path="/signup"
          element={
            <SignupPage2
              initialData={pendingSignupData || undefined}
              onSignupComplete={handleSignupComplete}
              onBack={() => navigate('/login')}
            />
          }
        />
        <Route
          path="/signup2"
          element={
            <SignupPage2
              initialData={pendingSignupData || undefined}
              onSignupComplete={handleSignupComplete}
              onBack={() => navigate('/login')}
            />
          }
        />
        <Route
          path="/auth/naver/callback"
          element={
            <RedirectURI
              onLoginSuccess={handleLogin}
              onRequireSignup={handleRequireSignup}
              onFail={() => navigate('/login')}
            />
          }
        />
      </Routes>
    </div>
  );
}
