import React, { useState, useEffect } from 'react';
import { Brain, Mail, ArrowLeft, Phone } from 'lucide-react';
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

  // 백엔드 리다이렉트 시 넘어온 데이터 추출
  const token = searchParams.get('token');
  const naverEmail = searchParams.get('email');
  const naverName = searchParams.get('name');
  const naverGender = searchParams.get('gender');
  const naverBirthday = searchParams.get('birthday');
  const naverBirthYear = searchParams.get('birthYear');
  const naverMobile = searchParams.get('mobile');

  // 네이버 로그인 흐름인지 확인
  const isNaverFlow = Boolean(token);

  // 초기 상태 설정 (Pre-fill)
  const [formData, setFormData] = useState({
    name: naverName ?? '',
    email: naverEmail ?? '',
    password: '',
    passwordConfirm: '',
    gender: naverGender ?? '',
    mobile: naverMobile ?? '',
    birthday: naverBirthday ?? '',
    birthYear: naverBirthYear ?? '',
  });

  const [termsAgree, setTermsAgree] = useState(false);
  const [privacyAgree, setPrivacyAgree] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 유효성 검사
    if (!termsAgree || !privacyAgree) {
      alert('필수 약관에 동의해주세요.');
      return;
    }
    if (formData.password !== formData.passwordConfirm) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    if (!formData.mobile) {
      alert('연락처를 입력해주세요.');
      return;
    }

    try {
      // 최종 가입 API 호출
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/signup/complete`,
        formData,
        {
          headers: isNaverFlow ? { Authorization: `Bearer ${token}` } : {},
        },
      );

      if (response.status === 200 || response.status === 201) {
        alert('회원가입이 완료되었습니다. 로그인해 주세요.');
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
          <span className="text-sm font-medium">이전으로 돌아가기</span>
        </button>

        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl shadow-lg mb-6">
            <Brain className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">회원가입</h1>
          <p className="text-muted-foreground">
            {isNaverFlow
              ? '네이버 인증 정보를 기반으로 프로필을 완성하세요'
              : '작가 활동을 위한 계정 정보를 입력하세요'}
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {/* 이메일 (네이버 가입시 수정 불가) */}
              <div className="space-y-2">
                <Label htmlFor="email" className="flex justify-between">
                  이메일 <span className="text-xs text-destructive">필수</span>
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className={`pl-10 h-12 ${isNaverFlow && naverEmail ? 'bg-muted cursor-not-allowed' : ''}`}
                    readOnly={isNaverFlow && Boolean(naverEmail)}
                    required
                  />
                </div>
              </div>

              {/* 비밀번호 */}
              <div className="space-y-2">
                <Label htmlFor="password">
                  비밀번호{' '}
                  <span className="text-xs text-destructive">필수</span>
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
                <Label htmlFor="passwordConfirm">비밀번호 확인</Label>
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

            <hr className="border-border" />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">이름</Label>
                <Input
                  id="name"
                  value={formData.name}
                  readOnly={isNaverFlow && Boolean(naverName)}
                  className={`h-12 ${isNaverFlow && naverName ? 'bg-muted cursor-not-allowed border-none' : ''}`}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mobile">
                  연락처 <span className="text-xs text-destructive">필수</span>
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

            {/* 약관 동의 섹션 */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <Checkbox
                  id="terms"
                  checked={termsAgree}
                  onCheckedChange={(v) => setTermsAgree(Boolean(v))}
                />
                <label
                  htmlFor="terms"
                  className="text-sm text-muted-foreground flex-1 cursor-pointer"
                >
                  서비스 이용약관 동의 (필수)
                </label>
                <Link
                  to="/terms"
                  className="text-xs text-primary hover:underline"
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
                  className="text-sm text-muted-foreground flex-1 cursor-pointer"
                >
                  개인정보처리방침 동의 (필수)
                </label>
                <Link
                  to="/privacy"
                  className="text-xs text-primary hover:underline"
                >
                  보기
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-lg font-bold shadow-md hover:scale-[1.01] transition-transform"
              disabled={!termsAgree || !privacyAgree}
            >
              IP.AI 작가 가입 완료
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
