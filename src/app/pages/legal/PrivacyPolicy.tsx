import { Button } from '../../components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ThemeToggle } from '../../components/ui/theme-toggle';

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-7xl bg-card border border-border rounded-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="p-0 h-auto hover:bg-transparent hover:text-primary"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span className="text-base font-medium">돌아가기</span>
          </Button>
          <ThemeToggle />
        </div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl md:text-2xl text-foreground font-semibold">
            개인정보처리방침
          </h1>
        </div>
        <div className="space-y-6 text-sm md:text-base leading-relaxed text-foreground">
          <p className="text-xs md:text-sm text-muted-foreground">
            최종 업데이트: 2026년 1월 19일
          </p>
          <p>
            IP.AI(이하 &quot;회사&quot;)는 「개인정보 보호법」 및 관련 법령을
            준수하며, 이용자의 개인정보를 안전하게 보호하기 위해 최선을 다하고
            있습니다. 본 개인정보처리방침은 회사가 제공하는 웹 서비스 및 관련
            기능(이하 &quot;서비스&quot;)에서 처리되는 개인정보에 대해
            적용됩니다.
          </p>
          <p>
            본 개인정보처리방침을 통해 회사가 어떤 개인정보를 어떤 목적과
            방법으로 수집·이용·보관·제공하는지, 그리고 이용자가 가지는 권리와 그
            행사 방법을 안내드립니다.
          </p>

          <h2 id="article-1" className="text-base md:text-lg font-semibold">
            1. 수집하는 개인정보 항목
          </h2>
          <p>
            회사는 회원가입, 네이버 로그인 연동, 서비스 제공 과정에서 다음과
            같은 개인정보를 수집할 수 있습니다.
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <strong>회원가입 및 서비스 이용 시 직접 입력</strong>: 이메일
              주소, 비밀번호, 이름, 휴대전화번호 등
            </li>
            <li>
              <strong>네이버 로그인 연동 시 제공</strong>: 네이버 계정
              식별자(ID), 이름, 성별, 생일(MM-DD), 출생연도(YYYY), 휴대전화번호,
              이메일 주소
            </li>
            <li>
              <strong>자동 수집 정보</strong>: 서비스 이용 기록, 접속 로그, IP
              주소, 기기 정보(브라우저 종류, OS 정보 등)
            </li>
          </ul>
          <p>
            수집되는 구체적인 항목은 서비스 내 개별 화면(회원가입, 연동 동의
            화면 등)에 별도로 안내되며, 필수 항목과 선택 항목을 구분하여
            고지합니다.
          </p>

          <h2 id="article-2" className="text-base md:text-lg font-semibold">
            2. 개인정보 수집 방법
          </h2>
          <p>회사는 다음과 같은 방법으로 개인정보를 수집합니다.</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              서비스 회원가입 및 이용 과정에서 이용자가 직접 입력하는 경우
            </li>
            <li>
              네이버 로그인 등 외부 계정 연동 시, 이용자가 동의한 범위 내에서
              제3자로부터 제공받는 경우
            </li>
            <li>
              웹 페이지 접속 및 서비스 이용 과정에서 자동으로 생성·수집되는
              경우(쿠키, 로그 등)
            </li>
          </ul>

          <h2 id="article-3" className="text-base md:text-lg font-semibold">
            3. 개인정보의 이용 목적
          </h2>
          <p>회사는 수집한 개인정보를 다음의 목적을 위해 이용합니다.</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>회원 가입 의사 확인, 본인 확인, 회원 식별 및 관리</li>
            <li>서비스 제공, 콘텐츠 추천, 사용 이력 기반 기능 제공</li>
            <li>네이버 로그인 연동을 통한 간편 인증 및 계정 연결 관리</li>
            <li>
              서비스 이용 통계, 품질 개선, 신규 기능 개발 및 맞춤형 서비스 제공
            </li>
            <li>고객 문의 대응, 민원 처리, 공지·안내 사항 전달</li>
            <li>서비스 이용 약관 및 관련 법령 위반 행위에 대한 방지·제재</li>
            <li>보안, 프라이버시 보호, 안전한 서비스 환경 구축</li>
          </ul>

          <h2 id="article-4" className="text-base md:text-lg font-semibold">
            4. 개인정보의 보유 및 이용 기간
          </h2>
          <p>
            회사는 법령에서 정한 기간 또는 이용자로부터 개인정보를 수집할 때
            동의받은 기간 내에서만 개인정보를 보유·이용합니다.
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              회원 탈퇴 시: 관련 법령에 따라 일정 기간 보관이 요구되는 경우를
              제외하고, 지체 없이 파기합니다.
            </li>
            <li>
              <strong>서비스 접속 로그</strong>:<strong>3개월</strong> 보관(
              <strong>통신비밀보호법</strong>)
            </li>
            <li>
              <strong>소비자의 불만 또는 분쟁처리에 관한 기록</strong>:
              <strong>3년</strong> 보관(
              <strong>전자상거래 등에서의 소비자 보호에 관한 법률</strong>)
            </li>
            <li>
              <strong>계약 또는 청약철회 등에 관한 기록</strong>:
              <strong>5년</strong> 보관(
              <strong>전자상거래 등에서의 소비자 보호에 관한 법률</strong>)
            </li>
          </ul>
          <p>
            회사는 보유 기간이 종료되거나 처리 목적이 달성된 개인정보에 대해서는
            복구 또는 재생이 불가능한 방법으로 안전하게 파기합니다.
          </p>

          <h2 id="article-5" className="text-base md:text-lg font-semibold">
            5. 개인정보의 제3자 제공
          </h2>
          <p>
            회사는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다.
            다만, 다음의 경우에는 예외적으로 제3자에게 제공할 수 있습니다.
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>이용자가 사전에 제3자 제공에 명시적으로 동의한 경우</li>
            <li>
              법령에 근거가 있거나, 수사기관·감독기관이 법령에 따른 절차에 따라
              요청한 경우
            </li>
            <li>
              서비스 제공에 반드시 필요한 범위 내에서 최소한의 개인정보를
              제공하는 경우
            </li>
          </ul>

          <h2 id="article-6" className="text-base md:text-lg font-semibold">
            6. 개인정보 처리의 위탁 및 외부 서비스 이용
          </h2>
          <p>
            회사는 서비스의 안정적인 제공을 위해 필요한 경우 개인정보 처리
            업무의 일부를 외부 전문 업체에 위탁할 수 있습니다. 이 경우 위탁받는
            자와 위탁 업무의 내용, 위탁 기간 등을 서비스 화면 또는 공지사항을
            통해 안내하고, 관련 법령에 따라 계약과 관리·감독을 수행합니다.
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <strong>Amazon Web Services Inc. (AWS)</strong>: 클라우드 인프라
              제공 및 서비스 데이터 보관 (보유 기간: 회원 탈퇴 시 또는 위탁 계약
              종료 시까지)
            </li>
          </ul>
          <p>
            회사는 네이버 로그인 연동 기능을 제공하며, 네이버를 통해 제공되는
            개인정보의 처리에 관해서는 네이버의 개인정보처리방침이 적용됩니다.
            자세한 내용은 네이버의 개인정보처리방침을 참고하시기 바랍니다.
          </p>
          <p>
            네이버 개인정보처리방침:{' '}
            <a
              href="https://policy.naver.com/policy/privacy.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline-offset-4 hover:underline"
            >
              https://policy.naver.com/policy/privacy.html
            </a>
          </p>

          <h2 id="article-7" className="text-base md:text-lg font-semibold">
            7. 이용자 및 법정대리인의 권리와 행사 방법
          </h2>
          <p>
            이용자 및 법정대리인은 언제든지 자신 또는 만 14세 미만 아동의
            개인정보에 대해 열람, 정정, 삭제, 처리정지 요구를 할 수 있습니다.
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              서비스 내 계정 설정 메뉴를 통해 일부 정보를 직접 조회·수정할 수
              있습니다.
            </li>
            <li>
              전자우편 등으로 개인정보 열람·정정·삭제·처리정지 요청을 하실 수
              있습니다.
            </li>
            <li>
              법령에서 별도로 정한 경우 회사는 관련 법령에 따라 조치를 제한할 수
              있습니다.
            </li>
          </ul>

          <h2 id="article-8" className="text-base md:text-lg font-semibold">
            8. 쿠키(Cookie) 등의 사용
          </h2>
          <p>
            회사는 이용자의 편의성과 서비스 품질 향상을 위해 쿠키 등 온라인
            식별자를 사용할 수 있습니다. 쿠키는 웹 사이트 이용 시 서버가
            이용자의 브라우저에 전송하는 작은 텍스트 파일입니다.
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>로그인 상태 유지, 이용 환경 설정 저장 등 서비스 기능 제공</li>
            <li>서비스 이용 통계 분석 및 서비스 개선</li>
          </ul>
          <p>
            이용자는 브라우저 설정을 통해 쿠키 저장을 거부하거나 삭제할 수
            있습니다. 다만, 쿠키 사용을 제한하는 경우 일부 서비스 이용에 제한이
            발생할 수 있습니다.
          </p>

          <h2 id="article-9" className="text-base md:text-lg font-semibold">
            9. 개인정보의 안전성 확보 조치
          </h2>
          <p>
            회사는 개인정보의 안전한 처리를 위하여 다음과 같은 보호 조치를
            취하고 있습니다.
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>개인정보에 대한 접근 권한 최소화 및 접근 통제</li>
            <li>비밀번호 등 중요 정보의 암호화 저장</li>
            <li>접속 로그 보관 및 위·변조 방지</li>
            <li>보안 프로그램 설치 및 정기적인 업데이트</li>
            <li>임직원에 대한 정기적인 개인정보 보호 교육</li>
          </ul>

          <h2 id="article-10" className="text-base md:text-lg font-semibold">
            10. 만 14세 미만 아동의 개인정보 처리
          </h2>
          <p>
            회사의 서비스는 원칙적으로 만 14세 이상의 이용자를 대상으로 합니다.
            회사는 만 14세 미만 아동의 개인정보를 법정대리인의 동의 없이
            수집하지 않으며, 만 14세 미만 아동의 정보가 수집된 것이 확인되는
            경우 지체 없이 이를 파기합니다.
          </p>

          <h2 id="article-11" className="text-base md:text-lg font-semibold">
            11. 개인정보 보호책임자 및 연락처
          </h2>
          <p>
            회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 관련
            문의 및 불만 처리, 피해 구제 등을 위해 아래와 같이 개인정보
            보호책임자를 지정하고 있습니다.
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>개인정보 보호책임자: IP.AI 개인정보 보호 담당자</li>
            <li>이메일: ipai0917@naver.com</li>
          </ul>
          <p>
            이용자는 서비스 이용 중 발생하는 모든 개인정보 보호 관련 문의, 불만
            처리, 피해 구제 등에 관한 사항을 개인정보 보호책임자에게 문의하실 수
            있습니다. 회사는 이용자의 문의에 대해 신속하고 성실하게
            답변·처리하겠습니다.
          </p>

          <h2 id="article-12" className="text-base md:text-lg font-semibold">
            12. 개인정보처리방침의 변경
          </h2>
          <p>
            회사는 관련 법령, 서비스 내용의 변경 등을 반영하기 위하여
            개인정보처리방침을 개정할 수 있습니다. 개인정보처리방침을 개정하는
            경우, 개정 내용과 시행일자를 명시하여 서비스 내 화면(공지사항 등)에
            최소 7일 전부터 공지합니다. 다만, 이용자의 권리에 중대한 변경이 있는
            경우에는 최소 30일 전에 공지합니다.
          </p>
          <p>
            변경된 개인정보처리방침은 공지한 시행일로부터 효력이 발생합니다.
            이용자는 개인정보 처리 현황을 확인하기 위하여 수시로 본
            개인정보처리방침을 확인해 주시기 바랍니다.
          </p>
        </div>
      </div>
    </div>
  );
}
