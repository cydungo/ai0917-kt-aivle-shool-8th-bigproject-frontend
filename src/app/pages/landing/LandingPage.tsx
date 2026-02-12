import {
  Brain,
  Users,
  Globe,
  ArrowRight,
  Menu,
  X,
  BookMarked,
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { useState } from 'react';
import { ThemeToggle } from '../../components/ui/theme-toggle';
import { Link } from 'react-router-dom';
import { Logo } from '../../components/common/Logo';

interface LandingPageProps {
  onSignInClick: () => void;
}

export function LandingPage({ onSignInClick }: LandingPageProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="bg-background min-h-screen transition-colors duration-300 selection:bg-primary/20">
      {/* Navigation Bar */}
      <nav className="bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Logo onClick={() => (window.location.href = '#')} />

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <a
                href="#features"
                className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
              >
                Features
              </a>
              <a
                href="#pricing"
                className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
              >
                Pricing
              </a>
            </div>

            {/* Desktop Right Side - Dark Mode Toggle + CTA */}
            <div className="hidden md:flex items-center gap-4">
              <ThemeToggle />
              <Button
                onClick={onSignInClick}
                className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all h-10 px-6 rounded-xl font-bold"
              >
                Get Started
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-foreground" />
              ) : (
                <Menu className="w-6 h-6 text-foreground" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-border/50 animate-in slide-in-from-top-2 duration-200">
              <div className="flex flex-col gap-4">
                <a
                  href="#features"
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium px-2 py-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Features
                </a>
                <a
                  href="#pricing"
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium px-2 py-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Pricing
                </a>
                <a
                  href="#about"
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium px-2 py-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About
                </a>
                <div className="flex items-center justify-between px-2 py-2 border-t border-border/50 mt-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    Appearance
                  </span>
                  <ThemeToggle />
                </div>
                <Button
                  onClick={onSignInClick}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-11 rounded-xl font-bold mt-2"
                >
                  Get Started
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-[1200px] mx-auto px-6 py-24 md:py-32">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left: Text Content */}
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-foreground mb-6">
              하나뿐인 IP의
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6C5CE7] to-[#0984E3] animate-in fade-in duration-1000">
                무한한 가능성
              </span>
              을 열다
            </h1>
            <p className="text-xl md:text-2xl font-bold text-foreground/80 mb-4">
              집필로 시작해 확장까지
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8 text-lg max-w-lg">
              AI가 복잡한 설정 관리와 오류 검사를 대신합니다.
              <br />
              작가는 오직 <strong>집필</strong>에만 집중하세요.
            </p>
            <div className="flex items-center gap-4">
              <Button
                onClick={onSignInClick}
                className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8 rounded-xl font-bold text-lg shadow-lg shadow-primary/20 transition-transform active:scale-95"
              >
                무료로 시작하기
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                variant="ghost"
                className="text-foreground hover:bg-muted h-12 px-8 rounded-xl font-medium text-lg border border-border/50"
              >
                데모 보기
              </Button>
            </div>
          </div>

          {/* Right: Wireframe UI Mockup */}
          <div className="relative">
            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 shadow-2xl dark:shadow-primary/5">
              {/* Mockup Header */}
              <div className="flex items-center gap-3 mb-8">
                <div className="w-3 h-3 rounded-full bg-red-400/80"></div>
                <div className="w-3 h-3 rounded-full bg-amber-400/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-400/80"></div>
              </div>

              {/* Mockup Content */}
              <div className="space-y-6">
                <div className="h-4 bg-primary/20 rounded w-1/3 animate-pulse"></div>
                <div className="space-y-3">
                  <div className="h-3 bg-muted rounded w-full"></div>
                  <div className="h-3 bg-muted rounded w-5/6"></div>
                  <div className="h-3 bg-muted rounded w-4/6"></div>
                </div>
                <div className="grid grid-cols-3 gap-4 pt-4">
                  <div className="h-24 bg-muted/30 border border-border/50 rounded-xl"></div>
                  <div className="h-24 bg-muted/30 border border-border/50 rounded-xl"></div>
                  <div className="h-24 bg-muted/30 border border-border/50 rounded-xl"></div>
                </div>
              </div>
            </div>

            {/* Floating Card */}
            <div className="absolute -right-4 -bottom-4 bg-card border border-border rounded-xl p-4 shadow-xl w-48">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Brain className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <div className="h-2 bg-muted rounded w-16 mb-1"></div>
                  <div className="h-2 bg-muted rounded w-12"></div>
                </div>
              </div>
              <div className="h-2 bg-muted rounded w-full mb-2"></div>
              <div className="h-2 bg-muted rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="max-w-[1200px] mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-3xl font-bold leading-tight tracking-tight text-foreground mb-4">
            시스템이 기억하고, 매니저가 연결합니다
          </h2>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto">
            IP.SUM은 단순한 도구가 아닙니다.
            <br />
            작가와 플랫폼을 잇는 가장 확실한 파트너입니다.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-card hover:bg-accent/50 transition-colors border border-border/50 rounded-2xl p-8 group">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <BookMarked className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">
              설정 충돌 방지
            </h3>
            <p className="text-muted-foreground leading-[1.6]">
              "이 캐릭터, 3화에서 죽지 않았나요?"
              <br />
              AI가 실시간으로 설정 오류와 모순을 <br />
              찾아냅니다.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-card hover:bg-accent/50 transition-colors border border-border/50 rounded-2xl p-8 group">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">
              1:1 매니저 매칭
            </h3>
            <p className="text-muted-foreground leading-[1.6]">
              IP 확장은 혼자가 아닙니다.
              <br />
              전담 매니저 배정을 통해 IP 확장 기회를 <br />
              제안받으세요.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-card hover:bg-accent/50 transition-colors border border-border/50 rounded-2xl p-8 group">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Globe className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">
              심층 작품 분석
            </h3>
            <p className="text-muted-foreground leading-[1.6]">
              인물 관계도부터 사건 타임라인까지.
              <br />
              작품의 구조를 시각화하여 빈틈없는 세계관을 <br />
              완성합니다.
            </p>
          </div>
        </div>
      </section>

      {/* Social Proof - Removed */}

      {/* Pricing Section */}
      <section id="pricing" className="max-w-[1200px] mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold leading-tight tracking-tight text-foreground mb-4">
            합리적인 가격
          </h2>
          <p className="text-lg text-muted-foreground">
            검증된 IP를 위한 최고의 투자
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-[900px] mx-auto">
          {/* Free Plan */}
          <div className="bg-card border border-border rounded-lg p-8 flex flex-col h-full">
            <div className="mb-8">
              <h3 className="text-2xl text-foreground mb-2">Just IP.SUM</h3>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-4xl md:text-5xl text-foreground">₩0</span>
                <span className="text-muted-foreground">/월</span>
              </div>
              <p className="text-muted-foreground">시작하는 창작자를 위한</p>
            </div>

            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-foreground rounded-full"></div>
                </div>
                <span className="text-foreground">기본 설정 관리</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-foreground rounded-full"></div>
                </div>
                <span className="text-foreground">최대 3개 작품</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-foreground rounded-full"></div>
                </div>
                <span className="text-foreground">기본 인물 관계도</span>
              </li>
            </ul>

            <Button
              onClick={onSignInClick}
              variant="outline"
              className="w-full border-border hover:bg-accent h-12 rounded-lg mt-auto"
            >
              무료로 시작하기
            </Button>
          </div>

          {/* Pro Plan */}
          <div className="bg-primary border border-primary rounded-lg p-8 relative flex flex-col h-full">
            <div className="absolute -top-3 left-8 bg-card border border-border px-3 py-1 rounded-full text-xs text-foreground">
              추천
            </div>

            <div className="mb-8">
              <h3 className="text-2xl text-primary-foreground mb-2">
                IP.SUM More
              </h3>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-4xl md:text-5xl text-primary-foreground">
                  ₩7,700
                </span>
                <span className="text-primary-foreground/70">/월</span>
              </div>
              <p className="text-primary-foreground/70">
                본격적인 탐험가를 위한
              </p>
            </div>

            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-primary-foreground/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-primary-foreground rounded-full"></div>
                </div>
                <span className="text-primary-foreground">
                  1:1 매니저 매칭 (IP 확장 제안)
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-primary-foreground/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-primary-foreground rounded-full"></div>
                </div>
                <span className="text-primary-foreground">
                  심층 작품 분석 (전체 관계도/타임라인)
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-primary-foreground/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-primary-foreground rounded-full"></div>
                </div>
                <span className="text-primary-foreground">
                  무제한 작품 및 설정 관리
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-primary-foreground/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-primary-foreground rounded-full"></div>
                </div>
                <span className="text-primary-foreground">설정 충돌 감지</span>
              </li>
            </ul>

            <Button
              onClick={onSignInClick}
              className="w-full bg-card text-foreground hover:bg-accent h-12 rounded-lg mt-auto"
            >
              지금 시작하기
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-16">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-3">
              <Logo onClick={() => (window.location.href = '#')} />
            </div>

            <div className="flex items-center gap-8 text-sm text-muted-foreground">
              <Link
                to="/terms"
                className="hover:text-foreground transition-colors"
              >
                이용약관
              </Link>
              <Link
                to="/privacy"
                className="hover:text-foreground transition-colors"
              >
                개인정보처리방침
              </Link>
              <a href="#" className="hover:text-foreground transition-colors">
                고객센터
              </a>
            </div>
          </div>

          <div className="mt-8 text-center text-sm text-muted-foreground">
            © 2026 IP.SUM All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
