import { http, HttpResponse, delay, RequestHandler } from 'msw';
import {
  ORIGINAL_LOREBOOKS,
  ORIGINAL_IP_EXPANSION_PROPOSALS,
  ORIGINAL_WORK_ID,
  ORIGINAL_WORK_TITLE,
  ORIGINAL_TITLES,
  ORIGINAL_GENRES,
  ORIGINAL_NAMES,
} from './original_data';

// Define the base URL from environment variables
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';

// ----------------------------------------------------------------------
// Helpers & Mock Data Generators
// ----------------------------------------------------------------------

const generateList = <T>(count: number, generator: (index: number) => T): T[] =>
  Array.from({ length: count }, (_, i) => generator(i + 1));

// Deterministic helpers instead of random
const getItem = <T>(items: T[], index: number): T =>
  items[index % items.length];

const getInt = (index: number, min: number, max: number) =>
  min + (index % (max - min + 1));

// ----------------------------------------------------------------------
// Professional Data (Static & Seeded)
// ----------------------------------------------------------------------

const PROFESSIONAL_NOTICES = [
  {
    title: '서버 정기 점검 안내',
    content:
      '보다 안정적인 서비스 제공을 위해 서버 점검이 진행될 예정입니다. 이용에 참고 부탁드립니다.',
  },
  {
    title: '신규 기능 업데이트 안내: 작가 대시보드',
    content:
      '작가님들의 편의를 위해 대시보드 기능이 개선되었습니다. 상세 내용은 가이드 문서를 확인해주세요.',
  },
  {
    title: '개인정보 처리방침 변경 안내',
    content:
      '개인정보 처리방침이 일부 개정되었습니다. 변경된 내용을 확인해주시기 바랍니다.',
  },
  {
    title: '시스템 안정화 작업 완료',
    content:
      '최근 발생한 간헐적 접속 지연 현상이 해결되었습니다. 이용에 불편을 드려 죄송합니다.',
  },
  {
    title: '2월 베스트 작가 선정 결과',
    content: '2월 베스트 작가로 선정되신 분들을 발표합니다. 축하드립니다!',
  },
];

const SYSTEM_LOG_MESSAGES = [
  '데이터베이스 백업 완료',
  '시스템 리소스 모니터링: 정상',
  '신규 회원 가입 처리',
  'API 요청 처리 시간 최적화',
  '보안 패치 자동 적용',
  '일일 리포트 생성 완료',
];

// ----------------------------------------------------------------------
// Stateful Mock Data
// ----------------------------------------------------------------------

// Works
const MOCK_WORKS = ORIGINAL_TITLES.map((title, i) => ({
  id: i + 1,
  title: title,
  description: `${title} - 독자들의 마음을 사로잡는 흥미진진한 스토리.`,
  status: getItem(['ONGOING', 'COMPLETED', 'HIATUS', 'NEW'], i),
  synopsis: `이 작품은 ${getItem(ORIGINAL_GENRES, i)} 장르의 수작으로, 주인공의 모험과 성장을 다룹니다.`,
  genre: getItem(ORIGINAL_GENRES, i),
  coverImageUrl: `https://via.placeholder.com/300?text=${encodeURIComponent(title.substring(0, 5))}`,
  createdAt: new Date(Date.now() - getInt(i, 1, 100) * 86400000).toISOString(),
  updatedAt: new Date().toISOString(),
  writer: getItem(ORIGINAL_NAMES, i),
  statusDescription: '연재 중',
}));

// Add Original Work (Ensure it exists and overwrites if ID conflicts, though IDs 1-20 are taken above)
// We'll push it as a distinct entry or replace if needed.
// Since ORIGINAL_WORK_ID is 101, it won't conflict with 1-20.
MOCK_WORKS.push({
  id: ORIGINAL_WORK_ID,
  title: ORIGINAL_WORK_TITLE,
  description: '연금술과 증기기관이 공존하는 스팀펑크 판타지',
  status: 'ONGOING',
  synopsis:
    '몰락한 연금술 명가의 후계자 엘라라가 시간을 되돌리는 아티팩트 "크로노스 코어"를 두고 벌이는 복수와 모험의 대서사시.',
  genre: '판타지',
  coverImageUrl: 'https://via.placeholder.com/300?text=Clockwork+Alchemist',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  writer: '김에이블',
  statusDescription: '절찬 연재중',
});

// Lorebooks
const MOCK_LOREBOOKS = new Map<number, any[]>();
MOCK_WORKS.forEach((work) => {
  const lorebooks = generateList(getInt(work.id, 5, 10), (i) => ({
    id: work.id * 100 + i,
    workId: work.id,
    name: `${work.genre} 설정 ${i}`,
    category: getItem(
      ['characters', 'places', 'items', 'groups', 'worldviews', 'plots'],
      i,
    ),
    description: `${work.title}의 중요한 설정입니다.`,
    keyword: `키워드${i}`,
    setting: JSON.stringify({
      description: `이 설정은 작품의 전개에 매우 중요한 역할을 합니다.`,
      tags: ['중요', '설정'],
    }),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));
  MOCK_LOREBOOKS.set(work.id, lorebooks);
});
// Override Original Work Lorebooks
MOCK_LOREBOOKS.set(ORIGINAL_WORK_ID, [...ORIGINAL_LOREBOOKS]);

// Manuscripts
const MOCK_MANUSCRIPTS = new Map<number, any[]>();
MOCK_WORKS.forEach((work) => {
  const manuscripts = generateList(3, (i) => ({
    id: work.id * 1000 + i,
    workId: work.id,
    episode: i,
    title: `${work.title} 제${i}화`,
    content: `이것은 ${work.title}의 ${i}번째 에피소드 본문입니다. 흥미진진한 전개가 이어집니다...`,
    status: 'COMPLETED',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));
  MOCK_MANUSCRIPTS.set(work.id, manuscripts);
});

// Authors
const MOCK_AUTHORS = generateList(50, (i) => ({
  id: i + 1,
  name: getItem(ORIGINAL_NAMES, i),
  email: `author${i + 1}@example.com`,
  workCount: getInt(i, 1, 5),
  status: getItem(['ACTIVE', 'INACTIVE', 'BANNED'], i),
  joinDate: new Date(Date.now() - getInt(i, 1, 365) * 86400000).toISOString(),
  lastActivityAt: new Date(
    Date.now() - getInt(i, 0, 48) * 3600000,
  ).toISOString(),
}));

// Shared Resolver for Author List
const authorListResolver = ({ request }: { request: Request }) => {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get('page') || 0);
  const size = Number(url.searchParams.get('size') || 10);

  const start = page * size;
  const end = start + size;
  const content = MOCK_AUTHORS.slice(start, end).map((author) => ({
    id: author.id,
    name: author.name,
    email: author.email,
    workCount: author.workCount,
    status: author.status,
    createdAt: author.joinDate, // DTO field name matching
  }));

  return HttpResponse.json({
    content,
    pageable: { pageNumber: page, pageSize: size },
    totalElements: MOCK_AUTHORS.length,
    totalPages: Math.ceil(MOCK_AUTHORS.length / size),
    number: page,
    size: size,
  });
};

// ----------------------------------------------------------------------
// Handlers Definition
// ----------------------------------------------------------------------

export const handlers: RequestHandler[] = [
  // ======================================================================
  // 1. Common / Test API
  // ======================================================================
  http.get(
    `${BACKEND_URL}/api/v1/hello`,
    () => new HttpResponse('helloUser AIVLE SCHOOL 8th'),
  ),
  http.get(
    `${BACKEND_URL}/api/v1/auth/naver/hello`,
    () => new HttpResponse('naverhelloUser AIVLE SCHOOL 8th'),
  ),

  // ======================================================================
  // 2. User API (Auth)
  // ======================================================================
  http.get(`${BACKEND_URL}/api/v1/auth/csrf`, () => {
    return HttpResponse.json({ token: 'mock-csrf-token' });
  }),

  http.get(`${BACKEND_URL}/api/v1/auth/me`, () => {
    const storedRole = localStorage.getItem('msw-session-role');
    if (storedRole) {
      return HttpResponse.json({
        type: 'AUTH',
        role: storedRole,
        userId: 1,
        email: 'user@example.com',
        name: '김에이블',
        siteEmail: 'user@example.com',
        mobile: '010-1234-5678',
        birthYear: '1995',
        gender: 'M',
        createdAt: '2025-01-01T09:00:00',
      });
    }
    return new HttpResponse(null, { status: 401 });
  }),

  http.post(`${BACKEND_URL}/api/v1/auth/login`, async ({ request }) => {
    const info = (await request.json()) as any;
    let role = 'Author';
    if (info.siteEmail?.includes('admin')) role = 'Admin';
    else if (info.siteEmail?.includes('manager')) role = 'Manager';

    localStorage.setItem('msw-session-role', role);
    return HttpResponse.json({ success: true, role, type: 'AUTH' });
  }),

  http.post(`${BACKEND_URL}/api/v1/auth/refresh`, () => {
    return HttpResponse.json({ accessToken: 'mock-access-token' });
  }),

  http.post(`${BACKEND_URL}/api/v1/auth/logout`, () => {
    localStorage.removeItem('msw-session-role');
    return HttpResponse.json({ success: true });
  }),

  // System Notices
  http.get(`${BACKEND_URL}/api/v1/author/sysnotice`, () => {
    return HttpResponse.json({
      notices: PROFESSIONAL_NOTICES.map((n, i) => ({
        id: i + 1,
        title: n.title,
        content: n.content,
        read: i > 2,
        createdAt: new Date().toISOString(),
        source: 'SYSTEM',
      })),
    });
  }),

  http.get(`${BACKEND_URL}/api/v1/author/sysnotice/subscribe`, () => {
    const stream = new ReadableStream({
      start(controller) {
        const data = JSON.stringify({
          title: '시스템 알림 (Mock)',
          content: 'SSE 연결이 성공했습니다.',
          source: 'SYSTEM',
          id: 999,
          read: false,
        });
        controller.enqueue(
          new TextEncoder().encode(`event: system-notice\ndata: ${data}\n\n`),
        );
      },
    });
    return new HttpResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
      },
    });
  }),

  http.patch(`${BACKEND_URL}/api/v1/author/sysnotice/:source/:id/read`, () => {
    return HttpResponse.json({ success: true });
  }),

  http.patch(`${BACKEND_URL}/api/v1/author/sysnotice/read-all`, () => {
    return HttpResponse.json({ success: true });
  }),

  // Work Analysis (Mermaid)
  http.get(
    `${BACKEND_URL}/api/v1/ai/author/works/:workId/analysis`,
    ({ params }) => {
      // const workId = Number(params.workId);
      return HttpResponse.json({
        relationship: `graph TD
    A[이준] -->|팀장| B[강독고]
    A -->|동료| C[김대리]
    B -->|보고| D[이사]
    style A fill:#f9f,stroke:#333,stroke-width:2px`,
        timeline: `timeline
    title 주요 사건 타임라인
    2024-01 : 프로젝트 착수
    2024-02 : 1차 위기 발생
    2024-03 : 해결 및 성장
    2024-04 : 최종 발표`,
      });
    },
  ),

  // ======================================================================
  // 3. Manager API
  // ======================================================================

  // Dashboard Page
  http.get(`${BACKEND_URL}/api/v1/manager/dashboard`, () => {
    return HttpResponse.json({
      summary: {
        pendingProposals: 12,
        managedAuthors: MOCK_AUTHORS.length,
        activeAuthors: MOCK_AUTHORS.filter((a) => a.status === 'ACTIVE').length,
      },
      notices: PROFESSIONAL_NOTICES.map((n, i) => ({
        id: i + 1,
        title: n.title,
        content: n.content,
        createdAt: new Date().toISOString(),
        viewCount: getInt(i, 10, 500),
      })),
    });
  }),

  // Dashboard Summary (Standalone)
  http.get(`${BACKEND_URL}/api/v1/manager/dashboard/summary`, () => {
    return HttpResponse.json({
      pendingProposals: 12,
      managedAuthors: MOCK_AUTHORS.length,
      activeAuthors: MOCK_AUTHORS.filter((a) => a.status === 'ACTIVE').length,
    });
  }),

  // Author Summary
  http.get(`${BACKEND_URL}/api/v1/manager/authors/summary`, () => {
    return HttpResponse.json({
      totalAuthors: MOCK_AUTHORS.length,
      newAuthors: 5,
      activeAuthors: MOCK_AUTHORS.filter((a) => a.status === 'ACTIVE').length,
    });
  }),

  // Author List
  http.get(`${BACKEND_URL}/api/v1/manager/authors`, authorListResolver),
  http.get(`${BACKEND_URL}/api/v1/manager/authors/list`, authorListResolver),

  // Author Detail
  http.get(`${BACKEND_URL}/api/v1/manager/authors/:id`, ({ params }) => {
    const id = Number(params.id);
    const author = MOCK_AUTHORS.find((a) => a.id === id);
    if (!author) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json({
      ...author,
      phone: '010-1234-5678',
      works: MOCK_WORKS.slice(0, 3), // Return some works
    });
  }),

  // Invite Code Match
  http.post(`${BACKEND_URL}/api/v1/manager/authors/:pwd`, ({ params }) => {
    if (params.pwd === '123456') {
      return HttpResponse.json({ ok: true, matched: true, authorId: 1 });
    }
    return HttpResponse.json({
      ok: false,
      message: '유효하지 않은 코드입니다.',
    });
  }),

  // IP Trend
  http.get(`${BACKEND_URL}/api/v1/manager/iptrend`, () =>
    HttpResponse.json({
      latestReport: {
        id: 1,
        title: '2025년 2월 1주차 트렌드 리포트',
        date: new Date().toISOString(),
      },
      statistics: { topGenre: '로맨스판타지', emergingKeyword: '회귀, 복수' },
    }),
  ),

  http.get(`${BACKEND_URL}/api/v1/manager/iptrend/list`, () =>
    HttpResponse.json({
      content: generateList(10, (i) => ({
        id: i,
        title: `2025년 2월 ${i}주차 트렌드 리포트`,
        createdAt: new Date().toISOString(),
      })),
      totalPages: 1,
      totalElements: 10,
    }),
  ),

  // ======================================================================
  // 4. Author API
  // ======================================================================

  // Works
  http.get(`${BACKEND_URL}/api/v1/author/works`, ({ request }) => {
    const url = new URL(request.url);
    const authorId = url.searchParams.get('authorId');
    return HttpResponse.json(MOCK_WORKS);
  }),

  http.get(`${BACKEND_URL}/api/v1/author/works/:id`, ({ params }) => {
    const id = Number(params.id);
    const work = MOCK_WORKS.find((w) => w.id === id);
    if (!work) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(work);
  }),

  http.post(`${BACKEND_URL}/api/v1/author/works`, async ({ request }) => {
    const body = (await request.json()) as any;
    const newWork = {
      id: MOCK_WORKS.length + 100,
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    MOCK_WORKS.push(newWork);
    return HttpResponse.json(newWork.id);
  }),

  // Manuscripts
  http.get(
    `${BACKEND_URL}/api/v1/author/:userId/:title/manuscript/list`,
    ({ params }) => {
      const title = decodeURIComponent(params.title as string);
      // Find work by title to get workId, or fallback
      const work = MOCK_WORKS.find((w) => w.title === title);
      const workId = work ? work.id : ORIGINAL_WORK_ID;

      const manuscripts = MOCK_MANUSCRIPTS.get(workId) || [];
      return HttpResponse.json({
        content: manuscripts,
        totalPages: 1,
        totalElements: manuscripts.length,
        size: 10,
        number: 0,
      });
    },
  ),

  http.get(
    `${BACKEND_URL}/api/v1/author/:userId/:title/manuscript/:id`,
    ({ params }) => {
      const id = Number(params.id);
      const allManuscripts = Array.from(MOCK_MANUSCRIPTS.values()).flat();
      const manuscript = allManuscripts.find((m) => m.id === id);
      if (!manuscript) return new HttpResponse(null, { status: 404 });
      return HttpResponse.json(manuscript);
    },
  ),

  // Lorebooks
  http.get(
    `${BACKEND_URL}/api/v1/author/:userId/:title/lorebook`,
    ({ request, params }) => {
      const url = new URL(request.url);
      let workId = Number(url.searchParams.get('workId'));

      if (!workId) {
        const title = decodeURIComponent(params.title as string);
        const work = MOCK_WORKS.find((w) => w.title === title);
        if (work) workId = work.id;
      }

      const lorebooks = MOCK_LOREBOOKS.get(workId) || [];
      return HttpResponse.json(lorebooks);
    },
  ),

  http.get(
    `${BACKEND_URL}/api/v1/author/:userId/:title/lorebook/:category`,
    ({ params, request }) => {
      const category = params.category as string;
      const url = new URL(request.url);
      const workId = Number(url.searchParams.get('workId'));

      const lorebooks = MOCK_LOREBOOKS.get(workId) || [];
      const filtered =
        category === '*' || category === 'all'
          ? lorebooks
          : lorebooks.filter((l) => l.category === category);

      return HttpResponse.json(filtered);
    },
  ),

  http.patch(
    `${BACKEND_URL}/api/v1/author/:userId/:title/lorebook/:category/:itemId`,
    async ({ params, request }) => {
      const { category, itemId } = params;
      const data = (await request.json()) as any;

      // Here we would normally update the store, but for now just return success
      return HttpResponse.json({
        id: Number(itemId),
        category,
        ...data,
        updatedAt: new Date().toISOString(),
      });
    },
  ),

  // Conflict Solve (Mock)
  http.post(
    `${BACKEND_URL}/api/v1/ai/author/:userId/:title/lorebook/conflict_solve`,
    async () => {
      await delay(500);
      return HttpResponse.json('충돌이 해결되었습니다.');
    },
  ),

  // Setting Save
  http.post(
    `${BACKEND_URL}/api/v1/ai/author/:userId/:title/lorebook/setting_save`,
    async ({ request }) => {
      const body = (await request.json()) as any;
      const targetWorkId = body.workId ? Number(body.workId) : ORIGINAL_WORK_ID;
      const currentLorebooks = MOCK_LOREBOOKS.get(targetWorkId) || [];

      const newLorebook = {
        id: Math.max(...currentLorebooks.map((l) => l.id), 0) + 1,
        workId: targetWorkId,
        ...body,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      currentLorebooks.push(newLorebook);
      MOCK_LOREBOOKS.set(targetWorkId, currentLorebooks);

      return HttpResponse.json({
        ...newLorebook,
        similarSettings: [],
        checkResult: 'PASS',
      });
    },
  ),

  // Manager IP Expansion Lorebooks
  http.get(
    `${BACKEND_URL}/api/v1/manager/ipext/:workId/authorworklorebook`,
    ({ params }) => {
      const workId = Number(params.workId);
      const lorebooks = MOCK_LOREBOOKS.get(workId) || [];
      return HttpResponse.json(lorebooks);
    },
  ),

  // Manager IP Expansion Author Works
  http.get(
    `${BACKEND_URL}/api/v1/manager/ipext/:authorIntegrationId/authorwork`,
    ({ params }) => {
      // Mock returning works for the author
      // For simplicity, just return all mock works
      return HttpResponse.json(MOCK_WORKS);
    },
  ),

  // Manager IP Expansion Conflict Check
  http.post(
    `${BACKEND_URL}/api/v1/manager/ipext/:workId/conflict-check`,
    async () => {
      await delay(1000);
      return HttpResponse.json({
        conflict: false,
        message: '충돌이 발견되지 않았습니다.',
      });
    },
  ),

  // ======================================================================
  // 5. Author IP Expansion API
  // ======================================================================

  // Get My Manager
  http.get(`${BACKEND_URL}/api/v1/author/manager`, () => {
    return HttpResponse.json({
      ok: true,
      managerIntegrationId: 'manager_001',
      managerName: '김매니저',
      managerSiteEmail: 'manager@company.com',
    });
  }),

  // Get IP Proposals
  http.get(`${BACKEND_URL}/api/v1/author/ip-expansion/proposals`, () => {
    const proposals = generateList(5, (i) => ({
      id: i,
      title: `${getItem(ORIGINAL_TITLES, i)} IP 확장 프로젝트 제안`,
      status: getItem(['PROPOSED', 'APPROVED', 'REJECTED'], i),
      statusDescription: getItem(['제안됨', '승인됨', '반려됨'], i),
      sender: '김매니저',
      authorName: '김작가',
      receivedAt: new Date().toISOString(),
      // Detailed Mock Data
      targetMediaType: getItem(['WEBTOON', 'DRAMA', 'GAME', 'MOVIE'], i),
      targetGenre: getItem(['ROFAN', 'FANTASY', 'MODERN', 'THRILLER'], i),
      direction:
        '원작의 독창적인 세계관을 유지하면서 대중적인 요소를 가미하여 각색합니다.',
      budget: '500,000,000 KRW',
      schedule: '2025-06-01 ~ 2025-12-31',
      originalWork: {
        id: i,
        title: getItem(ORIGINAL_TITLES, i),
        coverImageUrl: `https://via.placeholder.com/300?text=${encodeURIComponent(getItem(ORIGINAL_TITLES, i).substring(0, 5))}`,
      },
      selectedLorebooks: [
        { name: '주인공: 강철민', category: 'characters' },
        { name: '제국 아카데미', category: 'places' },
        { name: '마나 연공법', category: 'skills' },
      ],
    }));
    return HttpResponse.json(proposals);
  }),

  // Approve Proposal
  http.post(
    `${BACKEND_URL}/api/v1/author/ip-expansion/proposals/:id/approve`,
    async () => {
      await delay(500);
      return HttpResponse.json({
        success: true,
        message: '제안이 승인되었습니다.',
      });
    },
  ),

  // Reject Proposal
  http.post(
    `${BACKEND_URL}/api/v1/author/ip-expansion/proposals/:id/reject`,
    async () => {
      await delay(500);
      return HttpResponse.json({
        success: true,
        message: '제안이 반려되었습니다.',
      });
    },
  ),

  // Manager IP Expansion Authors
  http.get(
    `${BACKEND_URL}/api/v1/manager/ipext/:managerId/author`,
    ({ params }) => {
      // Mock returning authors associated with manager
      return HttpResponse.json(
        MOCK_AUTHORS.slice(0, 10).map((a) => ({
          ...a,
          workCount: a.workCount || 0,
        })),
      );
    },
  ),

  // Manager IP Expansion Proposals List
  http.get(
    `${BACKEND_URL}/api/v1/manager/ipext/:managerId`,
    ({ params, request }) => {
      const url = new URL(request.url);
      const page = Number(url.searchParams.get('page') || 0);
      const size = Number(url.searchParams.get('size') || 10);

      const content = ORIGINAL_IP_EXPANSION_PROPOSALS.slice(
        page * size,
        (page + 1) * size,
      );

      return HttpResponse.json({
        content: content,
        pageable: { pageNumber: page, pageSize: size },
        totalElements: ORIGINAL_IP_EXPANSION_PROPOSALS.length,
        totalPages: Math.ceil(ORIGINAL_IP_EXPANSION_PROPOSALS.length / size),
        number: page,
        size: size,
      });
    },
  ),

  // Manager IP Expansion Proposal Detail
  http.get(
    `${BACKEND_URL}/api/v1/manager/ipext/:managerId/:id`,
    ({ params }) => {
      const id = Number(params.id);
      const proposal = ORIGINAL_IP_EXPANSION_PROPOSALS.find((p) => p.id === id);
      if (!proposal) return new HttpResponse(null, { status: 404 });
      return HttpResponse.json(proposal);
    },
  ),

  // Manager IP Expansion Proposal Update
  http.patch(
    `${BACKEND_URL}/api/v1/manager/ipext/:managerId/:id`,
    async ({ params, request }) => {
      const id = Number(params.id);
      const data = (await request.json()) as any;

      const index = ORIGINAL_IP_EXPANSION_PROPOSALS.findIndex(
        (p) => p.id === id,
      );
      if (index !== -1) {
        ORIGINAL_IP_EXPANSION_PROPOSALS[index] = {
          ...ORIGINAL_IP_EXPANSION_PROPOSALS[index],
          ...data,
        };
      }

      return HttpResponse.json('수정 완료');
    },
  ),

  // IP Expansion Conflict Check
  http.post(`${BACKEND_URL}/api/v1/ai/manager/ipext/settings`, async () => {
    await delay(1000);
    return HttpResponse.json({
      충돌: {
        인물: [],
        세계: [],
        장소: [],
        사건: [
          {
            '대규모 투자 설명회':
              '[결과: 충돌]\n [판단사유: 사건 이름이 동일한 사건이 존재합니다. 키워드를 변경해주세요.]',
            신규설정: {
              '관련 인물': ['이준', '이사진', '강독고 팀장'],
              설명: [
                '이준이 아틀라스 네트웍스의 위상을 증명하는 화려한 대규모 투자 설명회 단상에 올라 발표를 진행함. 이사진들은 갑작스러운 사고나 복통으로 자리를 비웠고, 설명회는 이준의 독무대가 됨.',
              ],
            },
            기존설정: {
              '관련 인물': ['이준', '김회장'],
              설명: ['이준이 투자 설명회를 망치는 사건.'],
            },
          },
        ],
        물건: [],
        집단: [],
      },
    });
  }),

  // Invite Code
  http.get(`${BACKEND_URL}/api/v1/author/invite-code`, () =>
    HttpResponse.json({
      ok: true,
      code: '123456',
      expiresAt: new Date(Date.now() + 5 * 60000).toISOString(),
    }),
  ),

  // ======================================================================
  // 5. Admin API
  // ======================================================================

  // Dashboard Page
  http.get(`${BACKEND_URL}/api/v1/admin/dashboard`, () => {
    return HttpResponse.json({
      summary: {
        totalUsers: 1234,
        activeUsers: 850,
        totalSales: 98765000,
        serverStatus: 'STABLE',
      },
      dauData: {
        dates: generateList(7, (i) => `2025-02-0${i}`),
        values: generateList(7, (i) => getInt(i, 100, 300)),
      },
      resourceUsage: {
        cpu: 45,
        memory: 60,
        disk: 55,
      },
      recentLogs: generateList(5, (i) => ({
        id: i,
        timestamp: new Date().toISOString(),
        level: getItem(['INFO', 'WARN', 'ERROR'], i),
        message: getItem(SYSTEM_LOG_MESSAGES, i),
        source: 'System',
      })),
    });
  }),

  // Summary
  http.get(`${BACKEND_URL}/api/v1/admin/dashboard/summary`, () => {
    return HttpResponse.json({
      totalUsers: 1234,
      activeUsers: 850,
      totalSales: 98765000,
      serverStatus: 'STABLE',
    });
  }),

  // DAU
  http.get(`${BACKEND_URL}/api/v1/admin/dashboard/dau`, () => {
    return HttpResponse.json({
      dates: generateList(7, (i) => `2025-02-0${i}`),
      values: generateList(7, (i) => getInt(i, 100, 300)),
    });
  }),

  // Resources
  http.get(`${BACKEND_URL}/api/v1/admin/dashboard/resources`, () => {
    return HttpResponse.json({
      cpu: 45,
      memory: 60,
      disk: 55,
    });
  }),

  // Logs
  http.get(`${BACKEND_URL}/api/v1/admin/dashboard/logs`, () => {
    return HttpResponse.json({
      logs: generateList(20, (i) => ({
        id: i,
        timestamp: new Date(Date.now() - i * 60000).toISOString(),
        level: getItem(['INFO', 'WARN', 'ERROR'], i),
        message: getItem(SYSTEM_LOG_MESSAGES, i),
        source: 'System',
      })),
      totalCount: 100,
    });
  }),

  // Deployment
  http.get(`${BACKEND_URL}/api/v1/admin/dashboard/deployment`, () => {
    return HttpResponse.json({
      version: 'v1.2.3 (Hotfix)',
      lastDeployedAt: new Date().toISOString(),
      deployedBy: '김인턴',
      environment: 'PRODUCTION',
      status: 'HEALTHY',
    });
  }),
];
