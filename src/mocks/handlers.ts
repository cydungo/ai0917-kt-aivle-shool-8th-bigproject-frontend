import { http, HttpResponse } from 'msw';

// Define the base URL from environment variables
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';

// ----------------------------------------------------------------------
// Helpers & Mock Data Generators
// ----------------------------------------------------------------------

const generateList = <T>(count: number, generator: (index: number) => T): T[] =>
  Array.from({ length: count }, (_, i) => generator(i + 1));

const getRandomItem = <T>(items: T[]): T =>
  items[Math.floor(Math.random() * items.length)];

const TITLES = [
  '전지적 독자 시점',
  '나 혼자만 레벨업',
  '화산귀환',
  '재벌집 막내아들',
  '전생검신',
  '템빨',
  '광마회귀',
  '데뷔 못 하면 죽는 병 걸림',
  '이번 생은 가주가 되겠습니다',
  '백작가의 망나니가 되었다',
  'SSS급 자살헌터',
  '전생했더니 슬라임이었던 건에 대하여',
  '소드마스터의 막내아들',
  '검술명가 막내아들',
  '닥터 최태수',
  '달빛조각사',
  '나노 마신',
  '마도전생기',
  '무한의 마법사',
  '빌런의 엔딩은 죽음뿐',
  '악녀는 마리오네트',
  '어느 날 공주가 되어버렸다',
  '재혼 황후',
  '황제의 외동딸',
  '픽 미 업',
  '디펜스 게임의 폭군이 되었다',
  '게임 속 바바리안으로 살아남기',
  '천재 타자의 강속구',
  '축구천재가 되다',
  '홈플레이트의 빌런',
  '탑 매니지먼트',
  '배우, 다시 서다',
  '천재 아이돌의 연예계 공략법',
  '상수리나무 아래',
  '울어 봐, 빌어먹을 마왕',
  '시한부 악녀의 해피엔딩',
  '악역의 엔딩은 죽음뿐',
  '폐하, 또 죽이진 말아주세요',
  '남편을 내 편으로 만드는 방법',
  '괴물 공작가의 계약 공녀',
  '악녀가 사랑할 때',
  '이 결혼은 어차피 망하게 되어 있다',
  '약탈혼',
  '튜토리얼이 너무 어렵다',
  '킬 더 히어로',
  '두 번 사는 랭커',
  '도굴왕',
  '서울역 네크로맨서',
  '신과 함께 레벨업',
  '역대급 창기사의 회귀',
  '만년만에 귀환한 플레이어',
  '나 혼자 만렙 뉴비',
  'sss급 랭커 회귀하다',
  '밥만 먹고 레벨업',
  '만렙 영웅님께서 귀환하신다',
  '4000년 만에 귀환한 대마도사',
  '8클래스 마법사의 회귀',
  '마존현세강림기',
  '학사신공',
  '비뢰도',
  '묵향',
  '군림천하',
  '열혈강호',
  '용비불패',
  '고수',
  '아비무쌍',
  '나노 마신',
  '신마경천기',
  '무당기협',
  '화산전생',
  '일타강사 백사부',
  '절대검감',
  '나노마신',
  '천마육성',
  '마도전생기',
  '회귀한 천재 헌터의 슬기로운 청소생활',
  '농사짓는 헌터',
  '요리하는 소드마스터',
  '천재 흑마법사는 힐러가 되었다',
  '이계의 소환자',
  '달빛 조각사: 다크 게이머',
  '검은 머리 미군 대원수',
  '멸망 이후의 세계',
  '나를 죽여줘',
  '회귀자 사용설명서',
  '공작가의 99번째 신부',
  '그녀가 공작저로 가야 했던 사정',
  '폭군을 길들이고 도망쳐버렸다',
  '아빠, 나 이 결혼 안 할래요',
  '악녀는 모래시계를 되돌린다',
  '양판소 주인공의 아내로 살아남기',
  '루시아',
  '황제와 여기사',
  '내 딸은 드래곤',
  '이차원 용병',
  '책 먹는 마법사',
  '더 라이브',
  '해골병사는 던전을 지키지 못했다',
  'FFF급 관심용사',
  '나태 공자, 노력 천재 되다',
  '신입사원 김철수',
  '재벌가 망나니',
  '천재 의사 이무진',
  '중증외상센터: 골든 아워',
  'AI 닥터',
  '쇼닥터',
  '국회의원 이성윤',
  '판사 이한영',
  '검사 김서진',
  '천재 배우의 아우라',
  '이번 생은 우주 대스타',
  '음악 천재의 재림',
  '피아노 치는 변호사',
  '천재 화가의 귀환',
];

const GENRES = [
  '판타지',
  '무협',
  '현대판타지',
  '로맨스판타지',
  '로맨스',
  'SF',
  '스포츠',
  '대체역사',
  '게임판타지',
  '미스터리',
  '스릴러',
  '라이트노벨',
  '드라마',
  '공포',
  '추리',
  '밀리터리',
  '코미디',
  '일상',
  '학원',
  '성장',
];

const NAMES = [
  '김독자',
  '성진우',
  '청명',
  '진도준',
  '그리드',
  '이자하',
  '박문대',
  '피렌티아',
  '케일 헤니투스',
  '김공자',
  '리무루',
  '진 룬칸델',
  '최태수',
  '이현',
  '천여운',
  '천하진',
  '시로네',
  '페넬로페',
  '카예나',
  '아타나시아',
  '나비에',
  '아리아드나',
  '로키',
  '애쉬',
  '비요른',
  '강건우',
  '이현우',
  '정윤호',
  '서준',
  '강우진',
  '온하준',
  '유중혁',
  '한수영',
  '차해인',
  '백윤호',
  '당보',
  '장일소',
  '이성민',
  '서윤',
  '맥시밀리언',
  '리프트',
  '칼리스',
  '세자르',
  '이시아',
  '루비',
  '이즈케',
  '레슬리',
  '아르티제',
  '카셀',
  '이호재',
  '김우진',
  '연우',
  '서주헌',
  '강성구',
  '강현호',
  '이성민',
  '강진호',
  '한비광',
  '용비',
  '강룡',
  '노가장',
  '이민준',
  '박서준',
  '김태형',
  '전정국',
  '민윤기',
  '김남준',
  '정호석',
  '박지민',
  '김석진',
  '이지은',
  '박보영',
  '김고은',
  '한지민',
  '송혜교',
  '전지현',
  '손예진',
  '김태리',
  '박은빈',
  '김유정',
  '김소현',
  '장원영',
  '안유진',
  '카리나',
  '윈터',
  '조이',
  '슬기',
  '웬디',
  '아이린',
  '예리',
  '지수',
  '제니',
  '로제',
  '리사',
];

const LOREBOOK_CATEGORIES = ['인물', '세계', '장소', '사건', '물건', '집단'];

const MOCK_PROPOSALS = generateList(50, (i) => ({
  id: i,
  title:
    i % 4 === 0
      ? `${getRandomItem(TITLES)} - 시네마틱 유니버스 확장`
      : i % 4 === 1
        ? `${getRandomItem(TITLES)} 외전: ${getRandomItem(NAMES)}의 이야기`
        : `${getRandomItem(TITLES)} ${getRandomItem(['웹툰화', '드라마화', '영화화', '게임화'])} 제안`,
  status: getRandomItem(['PENDING', 'REVIEWING', 'APPROVED', 'PROPOSED']),
  statusDescription: getRandomItem([
    '검토 중',
    '작가 제안 완료',
    '제작 확정',
    '기획 단계',
  ]),
  createdAt: new Date(
    Date.now() - Math.floor(Math.random() * 10000000000),
  ).toISOString(),
  authorName: getRandomItem(NAMES),
  workTitle: getRandomItem(TITLES),
  format: getRandomItem(['webtoon', 'drama', 'movie', 'game']),
  content:
    '이 프로젝트는 원작의 깊이 있는 세계관을 바탕으로 새로운 미디어로 확장하는 것을 목표로 합니다. 주요 등장인물의 숨겨진 이야기와 원작에서 다루지 못한 에피소드를 중심으로 전개됩니다.',
  business: {
    targetAge: ['10대', '20대'],
    targetGender: 'all',
    budgetRange: 'medium',
  },
  strategy: {
    genre: getRandomItem(['original', 'varied']),
    universe: getRandomItem(['parallel', 'shared']),
  },
  lorebooks: generateList(Math.floor(Math.random() * 5) + 1, (j) => ({
    id: j,
    keyword: `${getRandomItem(NAMES)} ${getRandomItem(['설정', '비하인드', '프로필'])}`,
    category: getRandomItem(LOREBOOK_CATEGORIES),
    authorName: getRandomItem(NAMES),
    workTitle: getRandomItem(TITLES),
    setting:
      '이 설정집은 캐릭터의 성격, 배경 이야기, 주요 능력을 상세하게 기술하고 있습니다. 원작의 설정을 충실히 반영하면서도 새로운 해석의 여지를 남겨두었습니다.',
  })),
}));

// ----------------------------------------------------------------------
// Stateful Mock Data
// ----------------------------------------------------------------------

let MOCK_WORKS = generateList(5, (i) => ({
  id: i,
  title: TITLES[i % TITLES.length],
  description: '이 작품은...',
  status: (i === 0
    ? 'NEW'
    : i % 3 === 0
      ? 'NEW'
      : i % 3 === 1
        ? 'ONGOING'
        : 'COMPLETED') as
    | 'NEW'
    | 'ONGOING'
    | 'COMPLETED'
    | 'HIATUS'
    | 'DROPPED',
  synopsis: '시놉시스 내용입니다.',
  genre: GENRES[i % GENRES.length],
  coverImageUrl: `https://via.placeholder.com/300?text=Work+${i}`,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  writer: 'Author',
  statusDescription: '상태 설명',
}));

// Map<WorkId, Manuscript[]>
const MOCK_MANUSCRIPTS = new Map<number, any[]>();

// Initialize manuscripts for existing works (except NEW ones)
MOCK_WORKS.forEach((work) => {
  if (work.status !== 'NEW') {
    MOCK_MANUSCRIPTS.set(
      work.id,
      generateList(3, (i) => ({
        id: i,
        workId: work.id,
        episode: i + 1,
        subtitle: `제 ${i + 1}화 - 내용`,
        createdAt: new Date().toISOString(),
        txt: `내용입니다...`,
      })),
    );
  } else {
    MOCK_MANUSCRIPTS.set(work.id, []);
  }
});

// ----------------------------------------------------------------------
// Handlers Definition
// ----------------------------------------------------------------------

export const handlers = [
  // ======================================================================
  // 1. Test API
  // ======================================================================
  http.get(
    `${BACKEND_URL}/api/v1/hello`,
    () =>
      new HttpResponse('helloUser AIVLE SCHOOL 8th', {
        headers: { 'Content-Type': 'text/plain' },
      }),
  ),
  http.get(
    `${BACKEND_URL}/api/v1/auth/naver/hello`,
    () =>
      new HttpResponse('naverhelloUser AIVLE SCHOOL 8th', {
        headers: { 'Content-Type': 'text/plain' },
      }),
  ),
  http.get(`${BACKEND_URL}/api/v1/api/test`, () =>
    HttpResponse.json(
      generateList(30, (i) => ({
        id: i,
        name: `테스트 데이터 ${i}`,
        createdAt: new Date(Date.now() - i * 86400000).toISOString(),
      })),
    ),
  ),

  // ======================================================================
  // 0. Auth
  // ======================================================================

  // Login
  http.post(`${BACKEND_URL}/api/v1/auth/login`, async ({ request }) => {
    const body = (await request.json()) as any;
    const { siteEmail } = body;

    let role = 'Manager';
    if (siteEmail?.includes('admin')) role = 'Admin';
    else if (siteEmail?.includes('author')) role = 'Author';

    console.log('[MSW] Login request:', siteEmail, '-> Assigned Role:', role);

    return HttpResponse.json({
      role: role,
      accessToken: 'mock-access-token-' + Date.now(),
    });
  }),

  // Logout
  http.post(`${BACKEND_URL}/api/v1/auth/logout`, () => {
    return HttpResponse.json({ success: true });
  }),

  // Me (Session)
  http.get(`${BACKEND_URL}/api/v1/auth/me`, () => {
    return HttpResponse.json({
      type: 'AUTH',
      userId: 1,
      integrationId: 'mock-integration-id',
      name: 'Mock Manager',
      email: 'manager@test.com',
      role: 'Manager',
      siteEmail: 'manager@test.com',
    });
  }),

  // ======================================================================
  // 2. Manager - IP Expansion
  // ======================================================================

  // Get Authors for Selection
  http.get(`${BACKEND_URL}/api/v1/manager/authors`, ({ request }) => {
    const url = new URL(request.url);
    const query = url.searchParams.get('q') || '';

    // Generate static list of authors
    const authors = generateList(100, (i) => ({
      id: i,
      name: NAMES[i % NAMES.length],
      workCount: Math.floor(Math.random() * 5) + 1,
    }));

    if (query) {
      return HttpResponse.json(authors.filter((a) => a.name.includes(query)));
    }
    return HttpResponse.json(authors);
  }),

  // Get Works by Author
  http.get(
    `${BACKEND_URL}/api/v1/manager/authors/:authorId/works`,
    ({ params, request }) => {
      const authorId = Number(params.authorId);
      const url = new URL(request.url);
      const query = url.searchParams.get('q') || '';

      const works = generateList(12, (i) => ({
        id: authorId * 100 + i,
        title: TITLES[(authorId + i) % TITLES.length],
        genre: GENRES[(authorId + i) % GENRES.length],
        coverImageUrl: `https://placehold.co/200x300/e2e8f0/1e293b?text=${encodeURIComponent(
          TITLES[(authorId + i) % TITLES.length].slice(0, 2),
        )}`,
        authorId: authorId,
      }));

      if (query) {
        return HttpResponse.json(works.filter((w) => w.title.includes(query)));
      }
      return HttpResponse.json(works);
    },
  ),

  // Get Lorebooks by Work
  http.get(
    `${BACKEND_URL}/api/v1/manager/works/:workId/lorebooks`,
    ({ params, request }) => {
      const workId = Number(params.workId);
      const url = new URL(request.url);
      const query = url.searchParams.get('q') || '';

      const lorebookKeywords = [
        '주인공의 검',
        '마왕의 성',
        '제국 황실',
        '아카데미',
        '마법 체계',
        '히로인 A',
        '히로인 B',
        '악당 조직',
        '전설의 아이템',
        '숨겨진 던전',
        '가문의 비밀',
        '회귀의 비밀',
        '시스템 창',
        '상태창',
        '스킬 목록',
      ];

      const lorebooks = generateList(30, (i) => ({
        id: workId * 1000 + i,
        keyword:
          i < lorebookKeywords.length
            ? lorebookKeywords[i]
            : `${TITLES[(workId + i) % TITLES.length]} - ${getRandomItem(LOREBOOK_CATEGORIES)} ${i + 1}`,
        category: getRandomItem(LOREBOOK_CATEGORIES),
        setting:
          '이 설정집은 해당 작품의 중요한 요소를 설명합니다. 캐릭터의 성격, 능력, 배경 이야기 등을 포함하며, 세계관의 깊이를 더해주는 핵심 자료입니다.',
        authorName: NAMES[workId % NAMES.length], // Mock consistent author
        workTitle: TITLES[workId % TITLES.length], // Mock consistent title
        updatedAt: new Date().toISOString(),
      }));

      if (query) {
        return HttpResponse.json(
          lorebooks.filter((l) => l.keyword.includes(query)),
        );
      }
      return HttpResponse.json(lorebooks);
    },
  ),

  // Get Proposals
  http.get(`${BACKEND_URL}/api/v1/manager/ip-expansion/proposals`, () => {
    return HttpResponse.json(MOCK_PROPOSALS);
  }),

  // Create Proposal
  http.post(
    `${BACKEND_URL}/api/v1/manager/ip-expansion/proposals`,
    async ({ request }) => {
      const body = await request.json();
      return HttpResponse.json({
        id: Date.now(),
        ...(body as object),
        status: 'PENDING',
        createdAt: new Date().toISOString(),
      });
    },
  ),

  // Propose to Author
  http.post(
    `${BACKEND_URL}/api/v1/manager/ip-expansion/proposals/:id/propose`,
    () => {
      return HttpResponse.json({ success: true });
    },
  ),

  // Delete Proposal
  http.delete(
    `${BACKEND_URL}/api/v1/manager/ip-expansion/proposals/:id`,
    () => {
      return HttpResponse.json({ success: true });
    },
  ),

  // ======================================================================
  // 3. Manager - IP Trend
  // ======================================================================

  // Get IP Trend List (Paginated)
  http.get(`${BACKEND_URL}/api/v1/manager/iptrend/list`, ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') || 0);
    const size = Number(url.searchParams.get('size') || 12);
    const year =
      url.searchParams.get('year') || new Date().getFullYear().toString();

    // Generate trend reports on the fly based on year or use static list
    const reports = generateList(30, (i) => ({
      id: i,
      fileName: `2024년 ${Math.floor(i / 2) + 1}월 IP 트렌드 분석 리포트_v${(i % 2) + 1}.pdf`,
      status: getRandomItem(['COMPLETED', 'PROCESSING', 'FAILED']),
      createdAt: new Date(Date.now() - i * 86400000 * 7).toISOString(), // Weekly
      analysisDate: new Date(Date.now() - i * 86400000 * 7)
        .toISOString()
        .split('T')[0],
      fileUrl: 'https://arxiv.org/pdf/2101.00001.pdf', // Dummy PDF
    }));

    const start = page * size;
    const end = start + size;
    const content = reports.slice(start, end);
    const totalElements = reports.length;
    const totalPages = Math.ceil(totalElements / size);

    return HttpResponse.json({
      content,
      pageable: {
        pageNumber: page,
        pageSize: size,
        sort: { empty: true, sorted: false, unsorted: true },
        offset: start,
        paged: true,
        unpaged: false,
      },
      totalPages,
      totalElements,
      last: page === totalPages - 1,
      size,
      number: page,
      sort: { empty: true, sorted: false, unsorted: true },
      numberOfElements: content.length,
      first: page === 0,
      empty: content.length === 0,
    });
  }),

  // Get IP Trend Dashboard Stats
  http.get(`${BACKEND_URL}/api/v1/manager/iptrend`, () => {
    return HttpResponse.json({
      statistics: {
        totalReports: 45,
        completedReports: 42,
        failedReports: 1,
        processingReports: 2,
        lastGeneratedAt: new Date().toISOString(),
      },
    });
  }),
];
