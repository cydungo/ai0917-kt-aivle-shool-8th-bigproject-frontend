import { Button } from '../../components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ThemeToggle } from '../../components/ui/theme-toggle';

export default function TermsPage() {
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
            서비스 이용약관
          </h1>
        </div>

        <div className="space-y-6 text-sm md:text-base leading-relaxed text-foreground">
          <p className="text-xs md:text-sm text-muted-foreground">
            최종 업데이트: 2026년 1월 19일
          </p>
          <p>
            본 약관은 IP.AI(이하 &quot;회사&quot;)가 제공하는 웹 서비스 및 관련
            제반 서비스(이하 &quot;서비스&quot;)의 이용과 관련하여 회사와 이용자
            간의 권리·의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로
            합니다.
          </p>

          <h2 id="article-1" className="text-base md:text-lg font-semibold">
            제1조 (약관의 효력 및 변경)
          </h2>
          <p>
            1. 본 약관은 서비스를 이용하고자 하는 모든 이용자에게 그 효력이
            발생합니다.
          </p>
          <p>
            2. 회사는 관련 법령을 위반하지 않는 범위에서 약관을 개정할 수
            있으며, 약관을 개정하는 경우 개정 내용과 시행일자를 명시하여 서비스
            내 공지사항 등을 통해 사전에 공지합니다.
          </p>
          <p>
            3. 이용자가 변경된 약관의 효력 발생일 이후에도 서비스를 계속
            이용하는 경우, 변경된 약관에 동의한 것으로 봅니다.
          </p>

          <h2 id="article-2" className="text-base md:text-lg font-semibold">
            제2조 (용어의 정의)
          </h2>
          <p>본 약관에서 사용하는 용어의 정의는 다음과 같습니다.</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              &quot;서비스&quot;란 회사가 제공하는 IP.AI 관련 웹 서비스를
              의미합니다.
            </li>
            <li>
              &quot;회원&quot;이란 본 약관에 동의하고 회사와 이용 계약을
              체결하여 계정을 부여받은 자를 말합니다.
            </li>
            <li>
              &quot;네이버 로그인&quot;이란 네이버 계정을 이용하여 회사 서비스에
              간편하게 로그인할 수 있도록 제공하는 인증 수단을 말합니다.
            </li>
          </ul>

          <h2 id="article-3" className="text-base md:text-lg font-semibold">
            제3조 (이용 계약의 성립)
          </h2>
          <p>
            1. 이용 계약은 이용자가 본 약관 및 개인정보처리방침에 동의하고,
            회사가 정한 방식에 따라 회원가입을 신청한 후 회사가 이를
            승낙함으로써 성립합니다.
          </p>
          <p>
            2. 회사는 다음 각 호에 해당하는 신청에 대해서는 승낙을 유보하거나
            거절할 수 있습니다.
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>타인의 명의 또는 허위 정보로 신청한 경우</li>
            <li>만 14세 미만 아동이 법정대리인의 동의 없이 신청한 경우</li>
            <li>
              관련 법령, 약관을 위반하여 이용 계약이 해지된 이력이 있는 경우
            </li>
            <li>
              기타 회사의 합리적인 판단에 따라 승낙이 부적절하다고 인정되는 경우
            </li>
          </ul>

          <h2 id="article-4" className="text-base md:text-lg font-semibold">
            제4조 (회원 정보의 관리)
          </h2>
          <p>
            1. 회원은 회원가입 시 기재한 정보가 사실과 일치하도록 관리할 책임이
            있으며, 정보가 변경된 경우에는 지체 없이 수정해야 합니다.
          </p>
          <p>
            2. 계정의 아이디 및 비밀번호, 네이버 계정 등의 관리 책임은 회원에게
            있으며, 제3자에게 양도·대여하거나 공유해서는 안 됩니다.
          </p>
          <p>
            3. 회원은 자신의 계정이 무단 사용되는 사실을 인지한 경우 즉시 회사에
            알려야 하며, 회사는 필요한 조치를 할 수 있습니다.
          </p>

          <h2 id="article-5" className="text-base md:text-lg font-semibold">
            제5조 (서비스의 제공 및 변경)
          </h2>
          <p>회사는 다음과 같은 서비스를 제공합니다.</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>설정집 자동 추출 및 IP 분석 관련 기능</li>
            <li>IP 확장 시뮬레이션 및 관련 리포트 제공</li>
            <li>기타 회사가 정하는 부가 서비스</li>
          </ul>
          <p>
            1. 회사는 서비스의 안정적인 제공을 위해 필요 시 서비스의 내용을
            변경하거나 중단할 수 있습니다.
          </p>
          <p>
            2. 서비스를 종료하거나 중단하는 경우, 회사는 중단 시점 30일 전에
            서비스 내 공지사항을 통해 공지합니다. 단, 유료 서비스의 경우 별도의
            환불 규정에 따라 처리됩니다.
          </p>
          <p>
            3. 정기 점검, 긴급한 시스템 오류 수정 등 운영상 불가피한 사유로
            서비스가 일시 중단될 수 있습니다. 이와 같이 사전에 공지할 수 없는
            부득이한 사유가 있는 경우 회사는 중단 사실 및 주요 내용을 사후에
            서비스 화면 등을 통해 신속하게 공지합니다.
          </p>

          <h2 id="article-6" className="text-base md:text-lg font-semibold">
            제6조 (회원의 의무)
          </h2>
          <p>회원은 다음 각 호의 행위를 하여서는 안 됩니다.</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>타인의 개인정보 또는 계정 정보를 도용하는 행위</li>
            <li>서비스를 이용하여 법령 또는 공공질서에 반하는 행위</li>
            <li>서비스의 정상적인 운영을 방해하는 행위</li>
            <li>
              회사 또는 제3자의 저작권, 상표권 등 지식재산권을 침해하는 행위
            </li>
            <li>허위 정보를 등록하거나 타인을 사칭하는 행위</li>
            <li>
              서비스를 무단으로 크롤링하거나 자동화된 수단(봇, 스크립트 등)을
              이용하여 데이터를 수집하는 행위
            </li>
            <li>회사의 기술적 보호 조치를 무력화하거나 우회하려는 행위</li>
            <li>
              서비스를 통해 생성된 결과물을 회사의 사전 동의 없이 상업적으로
              재판매하거나 대여하는 행위
            </li>
          </ul>

          <h2 id="article-7" className="text-base md:text-lg font-semibold">
            제7조 (회사의 의무)
          </h2>
          <p>
            1. 회사는 관련 법령과 본 약관이 정하는 바에 따라 안정적이고 지속적인
            서비스를 제공하기 위해 최선을 다합니다.
          </p>
          <p>
            2. 회사는 이용자의 개인정보를 개인정보처리방침에서 정한 범위 내에서
            성실히 관리·보호합니다.
          </p>

          <h2 id="article-8" className="text-base md:text-lg font-semibold">
            제8조 (저작권 및 지식재산권)
          </h2>
          <p>
            1. 서비스와 관련된 소프트웨어, 디자인, 로고, 기타 요소에 대한
            지식재산권은 회사 또는 정당한 권리자에게 귀속됩니다.
          </p>
          <p>
            2. 회사는 회원이 입력한 정보 및 생성된 결과물을 서비스 품질 개선 및
            알고리즘 최적화 목적으로 활용할 수 있습니다. 단, 이를 통계 데이터
            작성이나 학술 연구 등 외부에 공개하는 경우에는 개인을 식별할 수
            없도록 비식별화 처리를 거칩니다.
          </p>

          <h2 id="article-9" className="text-base md:text-lg font-semibold">
            제9조 (서비스 이용 제한 및 해지)
          </h2>
          <p>
            1. 회원이 본 약관 또는 관련 법령을 위반하는 경우, 회사는 경고, 이용
            제한, 계약 해지 등의 조치를 취할 수 있습니다.
          </p>
          <p>
            2. 회원은 언제든지 서비스 내 설정 화면 또는 회사가 정한 절차에 따라
            회원 탈퇴를 요청할 수 있으며, 회사는 관련 법령에서 정한 범위 내에서
            필요한 정보를 제외하고 보유 중인 개인정보를 지체 없이 파기합니다.
          </p>

          <h2 id="article-10" className="text-base md:text-lg font-semibold">
            제10조 (면책)
          </h2>
          <p>
            1. 회사는 천재지변, 전쟁, 테러, 정전, 통신 장애 등 불가항력적인
            사유로 인하여 서비스를 제공할 수 없는 경우 책임을 지지 않습니다.
          </p>
          <p>
            2. 회사는 회원의 귀책사유로 인한 서비스 이용 장애에 대하여 책임을
            지지 않습니다.
          </p>
          <p>
            3. 회사는 서비스에서 제공하는 분석 결과 및 리포트의 완전성, 정확성,
            특정 목적에 대한 적합성을 보증하지 않습니다.
          </p>
          <p>
            4. 서비스의 결과물을 바탕으로 행해지는 회원의 주관적인 판단이나
            결정에 대하여 회사는 책임을 지지 않습니다.
          </p>

          <h2 id="article-11" className="text-base md:text-lg font-semibold">
            제11조 (개인정보보호)
          </h2>
          <p>
            회사는 서비스 제공과 관련하여 취득한 개인정보를 개인정보처리방침에
            따라 안전하게 관리하며, 개인정보의 수집·이용·보관·제공에 관한
            구체적인 사항은 별도로 게시한 개인정보처리방침에 따릅니다.
          </p>

          <h2 id="article-12" className="text-base md:text-lg font-semibold">
            제12조 (분쟁 해결 및 관할 법원)
          </h2>
          <p>
            1. 회사와 회원 간에 발생한 분쟁은 상호 협의를 통해 원만히 해결하기
            위해 노력합니다.
          </p>
          <p>
            2. 협의로 해결되지 않는 분쟁에 대해서는 대한민국 법을 준거법으로
            하며, 관할 법원은 민사소송법에서 정한 바에 따릅니다.
          </p>

          <h2 id="article-13" className="text-base md:text-lg font-semibold">
            제13조 (유료 서비스 및 환불)
          </h2>
          <p>
            1. 회사가 제공하는 유료 서비스의 결제 취소 및 환불은
            &apos;전자상거래 등에서의 소비자보호에 관한 법률&apos; 등 관련
            법령을 준수하며, 특별한 규정이 없는 한 결제일 또는 유료 서비스 이용
            가능일로부터 <strong>7일 이내</strong>(이하 &quot;청약철회
            기간&quot;) 에 청약철회를 요청할 수 있습니다.
          </p>
          <p>
            2. 이용자가 유료 서비스를 이미 이용하였거나, 콘텐츠를
            다운로드·스트리밍 등으로 제공받아
            <strong>객관적으로 사용 사실이 확인되는 경우</strong>에는 관련
            법령이 허용하는 범위 내에서 청약철회가 제한되거나, 이용한 기간·분량
            등에 비례하여 환불 금액이 산정될 수 있습니다.
          </p>
          <p>
            3. 회원의 귀책사유로 인한 과오금 발생 시 환불 수수료는 회원이
            부담하며, 회사의 귀책사유로 인한 경우에는 회사가 부담합니다.
          </p>
          <p>
            4. 유료 서비스 이용권은 타인에게 양도하거나 증여할 수 없으며, 질권
            설정의 목적으로 사용할 수 없습니다.
          </p>
        </div>
      </div>
    </div>
  );
}
