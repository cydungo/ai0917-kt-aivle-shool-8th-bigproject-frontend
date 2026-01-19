import React, { useState, useEffect } from 'react';
import { Brain, Mail, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import axios from 'axios';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Checkbox } from '../../components/ui/checkbox';

interface SignupPageProps {
  onSignupComplete: () => void;
  onBack: () => void;
}

export function SignupPage({ onSignupComplete, onBack }: SignupPageProps) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // 1. URL 파라미터에서 데이터 추출
  const token = searchParams.get('token');
  const naverEmail = searchParams.get('email');
  const naverName = searchParams.get('name');
  const naverMobile = searchParams.get('mobile');

  // 2. 보안 로직: 토큰이 없으면 비정상 접근으로 간주
  useEffect(() => {
    if (!token) {
      alert('네이버 인증 정보가 없습니다. 다시 로그인 해주세요.');
      navigate('/login', { replace: true });
    }
  }, [token, navigate]);

  // 초기 상태 설정
  const [formData, setFormData] = useState({
    name: naverName ?? '',
    email: naverEmail ?? '',
    password: '',
    passwordConfirm: '',
    mobile: naverMobile ?? '',
    gender: searchParams.get('gender') ?? '',
    birthday: searchParams.get('birthday') ?? '',
    birthYear: searchParams.get('birthYear') ?? '',
  });

  const [termsAgree, setTermsAgree] = useState(false);
  const [privacyAgree, setPrivacyAgree] = useState(false);

  // 토큰 검사 중일 때 깜빡임 방지
  if (!token) return null;

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!termsAgree || !privacyAgree) {
      alert('필수 약관에 동의해주세요.');
      return;
    }
    if (formData.password !== formData.passwordConfirm) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL.replace(/\/$/, '');
      const response = await axios.post(
        `${backendUrl}/api/v1/auth/signup/complete`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.status === 200 || response.status === 201) {
        alert(
          '회원가입 신청이 완료되었습니다. 관리자 승인 후 이용 가능합니다.',
        );
        onSignupComplete();
      }
    } catch (err) {
      console.error(err);
      alert('회원가입 처리 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-10 md:px-6 md:py-12">
      <div className="w-full max-w-md">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">로그인으로 돌아가기</span>
        </button>

        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl shadow-lg mb-6">
            <Brain className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            프로필 완성
          </h1>
          <p className="text-muted-foreground text-sm">
            네이버 인증이 완료되었습니다. <br /> 추가 정보를 입력하여 작가
            가입을 완료하세요.
          </p>
        </div>

        <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {/* 이메일 (수정 불가) */}
              <div className="space-y-2">
                <Label className="text-xs font-bold ml-1">인증된 이메일</Label>
                <Input
                  value={formData.email}
                  readOnly
                  className="bg-muted cursor-not-allowed h-12"
                />
              </div>

              {/* 비밀번호 설정 */}
              <div className="space-y-2">
                <Label
                  htmlFor="password font-bold"
                  className="text-xs font-bold ml-1"
                >
                  비밀번호 설정
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="8자 이상 입력하세요"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  className="h-12"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="passwordConfirm"
                  className="text-xs font-bold ml-1"
                >
                  비밀번호 확인
                </Label>
                <Input
                  id="passwordConfirm"
                  type="password"
                  value={formData.passwordConfirm}
                  onChange={(e) =>
                    handleChange('passwordConfirm', e.target.value)
                  }
                  className="h-12"
                  required
                />
              </div>
            </div>

            <hr className="border-border/60" />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs font-bold ml-1">
                  이름
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  readOnly={Boolean(naverName)}
                  className={`h-12 ${naverName ? 'bg-muted cursor-not-allowed' : ''}`}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mobile" className="text-xs font-bold ml-1">
                  연락처
                </Label>
                <Input
                  id="mobile"
                  value={formData.mobile}
                  onChange={(e) => handleChange('mobile', e.target.value)}
                  className="h-12"
                  required
                />
              </div>
            </div>

            {/* 약관 동의 */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <Checkbox
                  id="terms"
                  checked={termsAgree}
                  onCheckedChange={(v) => setTermsAgree(Boolean(v))}
                />
                <label
                  htmlFor="terms"
                  className="text-[13px] text-muted-foreground flex-1 cursor-pointer"
                >
                  서비스 이용약관 동의 (필수)
                </label>
                <Link
                  to="/terms"
                  className="text-xs text-primary hover:underline font-medium"
                >
                  보기
                </Link>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox
                  id="privacy"
                  checked={privacyAgree}
                  onCheckedChange={(v) => setPrivacyAgree(Boolean(v))}
                />
                <label
                  htmlFor="privacy"
                  className="text-[13px] text-muted-foreground flex-1 cursor-pointer"
                >
                  개인정보처리방침 동의 (필수)
                </label>
                <Link
                  to="/privacy"
                  className="text-xs text-primary hover:underline font-medium"
                >
                  보기
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-13 text-base font-bold shadow-md active:scale-[0.98] transition-all"
              disabled={!termsAgree || !privacyAgree}
            >
              IP.AI 작가 신청 완료
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
