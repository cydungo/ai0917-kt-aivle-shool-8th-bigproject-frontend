import React, { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom'; // searchParams 훅 사용 권장
import styled from 'styled-components';
import axios from 'axios';

interface RedirectURIProps {
  onLoginSuccess: (type: 'Manager' | 'Author' | 'Admin') => void;
  onRequireSignup: (profile: Record<string, any>) => void;
  onFail: () => void;
}

const RedirectURI: React.FC<RedirectURIProps> = ({
  onLoginSuccess,
  onRequireSignup,
  onFail,
}) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams(); // URL 파라미터를 더 안정적으로 읽어옴
  const isRequestSent = useRef(false);

  useEffect(() => {
    // 1. 파라미터 추출
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    // [중요] 이미 요청 중이거나 코드가 없으면 로직 실행 안 함
    if (isRequestSent.current) return;

    const authenticateUser = async (
      authCode: string,
      authState: string | null,
    ) => {
      isRequestSent.current = true; // 진입하자마자 Lock

      try {
        console.log('인증 시도 중...', { authCode });

        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/auth/naver/user`,
          { code: authCode, state: authState },
        );

        const { role, isNewMember, accessToken } = response.data;

        // 성공 시 흐름 제어
        if (!isNewMember) {
          if (accessToken) localStorage.setItem('accessToken', accessToken);
          if (role) localStorage.setItem('userRole', role);

          // 부모 상태 업데이트 (이 내부에서 navigate('/')가 실행됨)
          onLoginSuccess(role);
        } else {
          onRequireSignup(response.data);
          // App.tsx의 handleRequireSignup에서 navigate('/signup2')를 처리함
        }
      } catch (error) {
        console.error('백엔드 인증 에러:', error);
        onFail();
        navigate('/login', { replace: true });
      }
    };

    if (code) {
      authenticateUser(code, state);
    } else {
      // 코드가 없는 경우 (이미 처리됐거나 잘못 접근한 경우)
      // 아주 잠깐 대기 후 유저 상태가 있으면 홈으로, 없으면 로그인으로 보냄
      const existingRole = localStorage.getItem('userRole');
      if (existingRole) {
        navigate('/', { replace: true });
      } else {
        console.warn('URL에 인증 코드가 없습니다.');
        // 무조건적인 에러 처리보다는 상황에 맞는 리다이렉트
        // onFail(); // 필요 시 주석 해제
        // navigate('/login', { replace: true });
      }
    }
  }, [searchParams, navigate, onLoginSuccess, onRequireSignup, onFail]);

  return (
    <Container>
      <StatusText>네이버 계정 정보를 확인하고 있습니다...</StatusText>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f8f9fa;
`;

const StatusText = styled.p`
  font-size: 1.1rem;
  color: #333;
  font-weight: 500;
`;

export default RedirectURI;
