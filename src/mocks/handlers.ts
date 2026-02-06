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

const getRandomItem = <T>(items: T[]): T =>
  items[Math.floor(Math.random() * items.length)];

// Use Original Data
const TITLES = ORIGINAL_TITLES;
const GENRES = ORIGINAL_GENRES;
const NAMES = ORIGINAL_NAMES;

const MOCK_PROPOSALS = generateList(10, (i) => ({
  id: i,
  title: `${getRandomItem(TITLES)} 웹툰화 제안`,
  status: getRandomItem(['PENDING', 'REVIEWING', 'APPROVED']),
  statusDescription: '검토 중입니다.',
  createdAt: new Date().toISOString(),
}));

// ----------------------------------------------------------------------
// Stateful Mock Data
// ----------------------------------------------------------------------

const MOCK_WORKS = generateList(5, (i) => ({
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

// Add Original Work
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

// Map<WorkId, Lorebook[]>
const MOCK_LOREBOOKS = new Map<number, any[]>();

// Map<WorkId, Manuscript[]>
const MOCK_MANUSCRIPTS = new Map<number, any[]>();

// Initialize lorebooks for existing works
MOCK_WORKS.forEach((work) => {
  const lorebookCount = 5 + Math.floor(Math.random() * 8); // 5 to 12 lorebooks
  const lorebooks = generateList(lorebookCount, (i) => {
    const category = getRandomItem([
      'characters',
      'places',
      'items',
      'groups',
      'worldviews',
      'plots',
    ]);
    // Use generic descriptions instead of specific copyrighted names
    const keyword = `${category}_${i}`;

    return {
      id: work.id * 100 + i,
      workId: work.id,
      name: keyword,
      category: category,
      description: `${category} 카테고리의 ${keyword}에 대한 상세 설정입니다.`,
      keyword: keyword, // Ensure keyword field exists
      setting: JSON.stringify({
        description: `${keyword}에 대한 세부 내용입니다.`,
        tags: ['중요', '핵심'],
      }),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  });
  MOCK_LOREBOOKS.set(work.id, lorebooks);

  MOCK_MANUSCRIPTS.set(
    work.id,
    generateList(3, (i) => ({
      id: i,
      workId: work.id,
      episode: i,
      subtitle: `Subtitle ${i}`,
      txt: `Manuscript text ${i}`,
    })),
  );
});

// Initialize Original Lorebooks
MOCK_LOREBOOKS.set(ORIGINAL_WORK_ID, [...ORIGINAL_LOREBOOKS]);

// Shared resolver for author list
const authorListResolver = ({ request }: { request: Request }) => {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get('page') || 0);
  const size = Number(url.searchParams.get('size') || 10);

  const authors = generateList(50, (i) => ({
    id: i,
    name: `작가 ${i}`,
    email: `author${i}@example.com`,
    workCount: Math.floor(Math.random() * 10),
    status: getRandomItem(['ACTIVE', 'INACTIVE', 'BANNED']),
    createdAt: new Date().toISOString(),
  }));

  const start = page * size;
  const end = start + size;
  const content = authors.slice(start, end);

  return HttpResponse.json({
    content,
    pageable: {
      pageNumber: page,
      pageSize: size,
    },
    totalElements: authors.length,
    totalPages: Math.ceil(authors.length / size),
  });
};

// ----------------------------------------------------------------------
// Handlers Definition
// ----------------------------------------------------------------------

export const handlers: RequestHandler[] = [
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
  // 2. User API (Auth & Signup)
  // ======================================================================
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

  http.post(`${BACKEND_URL}/api/v1/auth/logout`, () => {
    localStorage.removeItem('msw-session-role');
    return HttpResponse.json({ success: true });
  }),

  http.post(`${BACKEND_URL}/api/v1/auth/password/reset`, async () => {
    await delay(1000);
    return HttpResponse.json({
      message: '비밀번호 재설정 이메일이 발송되었습니다.',
    });
  }),

  http.post(`${BACKEND_URL}/api/v1/auth/password/verify-code`, async () => {
    await delay(500);
    return HttpResponse.json({ verified: true });
  }),

  http.post(`${BACKEND_URL}/api/v1/auth/password/change`, async () => {
    await delay(1000);
    return HttpResponse.json({ success: true });
  }),

  http.post(`${BACKEND_URL}/api/v1/auth/join`, async () => {
    await delay(1000);
    return HttpResponse.json({ success: true });
  }),

  http.get(`${BACKEND_URL}/api/v1/auth/check-email`, async () => {
    await delay(500);
    return HttpResponse.json({ available: true });
  }),

  http.post(`${BACKEND_URL}/api/v1/auth/send-verification`, async () => {
    await delay(500);
    return HttpResponse.json({ success: true });
  }),

  http.post(`${BACKEND_URL}/api/v1/auth/verify-email`, async () => {
    await delay(500);
    return HttpResponse.json({ verified: true });
  }),

  // ======================================================================
  // 3. Author API
  // ======================================================================

  // WorkController
  http.get(`${BACKEND_URL}/api/v1/author/works`, ({ request }) => {
    const url = new URL(request.url);
    const authorId = url.searchParams.get('authorId');
    // In a real app, filter by authorId. Here we just return all mock works.
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

  http.patch(
    `${BACKEND_URL}/api/v1/author/works/:id/status`,
    async ({ params, request }) => {
      const id = Number(params.id);
      const status = new URL(request.url).searchParams.get('status');
      const work = MOCK_WORKS.find((w) => w.id === id);
      if (work && status) {
        work.status = status as any;
      }
      return new HttpResponse(null, { status: 200 });
    },
  ),

  http.patch(
    `${BACKEND_URL}/api/v1/author/works/:id`,
    async ({ params, request }) => {
      const id = Number(params.id);
      const body = (await request.json()) as any;
      const work = MOCK_WORKS.find((w) => w.id === id);
      if (work) {
        Object.assign(work, body);
      }
      return new HttpResponse(null, { status: 200 });
    },
  ),

  http.delete(`${BACKEND_URL}/api/v1/author/works/:id`, ({ params }) => {
    const id = Number(params.id);
    const index = MOCK_WORKS.findIndex((w) => w.id === id);
    if (index > -1) {
      MOCK_WORKS.splice(index, 1);
    }
    return new HttpResponse(null, { status: 204 });
  }),

  // ManuscriptController
  http.get(
    `${BACKEND_URL}/api/v1/author/:userId/:title/manuscript/list`,
    ({ params }) => {
      // Logic to filter manuscripts by work title/id would go here
      // For mock, we just return manuscripts for the first work or generic ones
      const work = MOCK_WORKS.find(
        (w) => w.title === decodeURIComponent(params.title as string),
      );
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
      // Flatten all manuscripts to find by ID
      const allManuscripts = Array.from(MOCK_MANUSCRIPTS.values()).flat();
      const manuscript = allManuscripts.find((m) => m.id === id);
      if (!manuscript) return new HttpResponse(null, { status: 404 });
      return HttpResponse.json(manuscript);
    },
  ),

  // Manuscript Upload (Create)
  http.post(
    `${BACKEND_URL}/api/v1/author/:userId/:title/manuscript/upload`,
    async ({ request, params }) => {
      const body = (await request.json()) as any;
      const work = MOCK_WORKS.find(
        (w) => w.title === decodeURIComponent(params.title as string),
      );
      const workId = work ? work.id : ORIGINAL_WORK_ID;

      const newId = Math.floor(Math.random() * 100000);
      const newManuscript = {
        id: newId,
        workId: workId,
        ...body,
        createdAt: new Date().toISOString(),
      };

      const current = MOCK_MANUSCRIPTS.get(workId) || [];
      current.push(newManuscript);
      MOCK_MANUSCRIPTS.set(workId, current);

      return HttpResponse.json(newId);
    },
  ),

  // Manuscript Update Text
  http.patch(
    `${BACKEND_URL}/api/v1/author/:userId/:title/manuscript/upload`,
    async ({ request }) => {
      const body = (await request.json()) as any;
      // Mock update success
      return HttpResponse.json(body.id || 1);
    },
  ),

  // Manuscript Category Extraction
  http.post(
    `${BACKEND_URL}/api/v1/author/:userId/:title/manuscript/categories`,
    async () => {
      await delay(1000);
      return HttpResponse.json({
        categories: [
          { name: '엘라라', category: 'character', confidence: 0.9 },
          { name: '기어헤이븐', category: 'place', confidence: 0.85 },
        ],
      });
    },
  ),

  // Manuscript Setting Conflict Check
  http.post(
    `${BACKEND_URL}/api/v1/author/:userId/:title/manuscript/setting`,
    async () => {
      await delay(1000);
      return HttpResponse.json({
        conflicts: [],
        status: 'PASS',
      });
    },
  ),

  // Manuscript Delete
  http.delete(
    `${BACKEND_URL}/api/v1/author/:userId/:title/manuscript/:id`,
    () => {
      return HttpResponse.json('삭제 완료');
    },
  ),

  // Manuscript Update Info
  http.patch(
    `${BACKEND_URL}/api/v1/author/:userId/:title/manuscript/:id`,
    () => {
      return HttpResponse.json('수정 완료');
    },
  ),

  // AuthorLorebookController & AiLorebookController
  http.get(
    `${BACKEND_URL}/api/v1/author/:userId/:title/lorebook`,
    ({ request }) => {
      const url = new URL(request.url);
      const workId = Number(url.searchParams.get('workId'));
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

  http.post(
    `${BACKEND_URL}/api/v1/ai/author/:userId/:title/lorebook/setting_save`,
    async ({ request }) => {
      const body = (await request.json()) as any;
      const targetWorkId = body.workId ? Number(body.workId) : ORIGINAL_WORK_ID;
      const currentLorebooks = MOCK_LOREBOOKS.get(targetWorkId) || [];

      const newId = Math.max(...currentLorebooks.map((l) => l.id), 0) + 1;
      const newLorebook = {
        id: newId,
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

  http.patch(
    `${BACKEND_URL}/api/v1/ai/author/:userId/:title/lorebook/:tags/:itemId`,
    async ({ params, request }) => {
      const itemId = Number(params.itemId);
      const body = (await request.json()) as any;

      // Find lorebook in all works
      let targetLorebook = null;
      let targetWorkId = -1;

      for (const [workId, lorebooks] of MOCK_LOREBOOKS.entries()) {
        const found = lorebooks.find((l) => l.id === itemId);
        if (found) {
          targetLorebook = found;
          targetWorkId = workId;
          break;
        }
      }

      if (targetLorebook) {
        Object.assign(targetLorebook, body);
        targetLorebook.updatedAt = new Date().toISOString();
        return HttpResponse.json({
          ...targetLorebook,
          similarSettings: [],
          checkResult: 'PASS',
        });
      }

      return new HttpResponse(null, { status: 404 });
    },
  ),

  http.delete(
    `${BACKEND_URL}/api/v1/author/:userId/:title/lorebook/:tags/:id`,
    ({ params }) => {
      const id = Number(params.id);
      for (const [workId, lorebooks] of MOCK_LOREBOOKS.entries()) {
        const index = lorebooks.findIndex((l) => l.id === id);
        if (index > -1) {
          lorebooks.splice(index, 1);
          return HttpResponse.json('삭제 완료');
        }
      }
      return new HttpResponse(null, { status: 404 });
    },
  ),

  // Invite Code
  http.get(`${BACKEND_URL}/api/v1/author/invite-code`, () =>
    HttpResponse.json({
      ok: true,
      code: '123456',
      expiresAt: new Date(Date.now() + 5 * 60000).toISOString(),
    }),
  ),

  // ======================================================================
  // 4. Manager API
  // ======================================================================

  // Manager Author Controller
  http.get(`${BACKEND_URL}/api/v1/manager/authors/summary`, () =>
    HttpResponse.json({
      totalAuthors: 150,
      newAuthorsToday: 3,
      activeAuthors: 120,
      totalWorks: 450,
    }),
  ),

  http.get(`${BACKEND_URL}/api/v1/manager/authors`, authorListResolver),

  http.get(`${BACKEND_URL}/api/v1/manager/authors/list`, authorListResolver),

  http.get(`${BACKEND_URL}/api/v1/manager/authors/:id`, ({ params }) => {
    const id = Number(params.id);
    return HttpResponse.json({
      id,
      name: `작가 ${id}`,
      email: `author${id}@example.com`,
      phone: '010-1234-5678',
      status: 'ACTIVE',
      joinDate: '2025-01-01',
      works: MOCK_WORKS,
    });
  }),

  http.post(`${BACKEND_URL}/api/v1/manager/authors/:pwd`, ({ params }) => {
    if (params.pwd === '123456') {
      return HttpResponse.json({ ok: true, matched: true, authorId: 1 });
    }
    return HttpResponse.json({ ok: false, message: 'Invalid code' });
  }),

  // Manager Dashboard Controller
  http.get(`${BACKEND_URL}/api/v1/manager/dashboard`, () =>
    HttpResponse.json({
      stats: {
        totalUsers: 1000,
        dau: 150,
        mau: 800,
      },
      notices: [
        { id: 1, title: '점검 안내', content: '...', date: '2025-02-07' },
      ],
    }),
  ),

  http.get(`${BACKEND_URL}/api/v1/manager/dashboard/summary`, () =>
    HttpResponse.json({
      activeCampaigns: 5,
      pendingProposals: 3,
      systemStatus: 'NORMAL',
    }),
  ),

  // IP Trend Controller
  http.get(`${BACKEND_URL}/api/v1/manager/iptrend`, () =>
    HttpResponse.json({
      latestReport: {
        id: 1,
        title: '2025년 2월 1주차 트렌드',
        date: '2025-02-07',
      },
      statistics: { topGenre: '판타지', emergingKeyword: '회귀' },
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

  http.get(`${BACKEND_URL}/api/v1/manager/iptrend/preview/:reportId`, () =>
    HttpResponse.json({
      previewUrl: 'https://via.placeholder.com/600x800?text=Report+Preview',
    }),
  ),

  http.get(
    `${BACKEND_URL}/api/v1/manager/iptrend/report`,
    () =>
      new HttpResponse(new ArrayBuffer(10), {
        headers: { 'Content-Type': 'application/pdf' },
      }),
  ),

  http.get(
    `${BACKEND_URL}/api/v1/manager/iptrend/download/:reportId`,
    () =>
      new HttpResponse(new ArrayBuffer(10), {
        headers: { 'Content-Type': 'application/pdf' },
      }),
  ),

  http.post(`${BACKEND_URL}/api/v1/manager/iptrend/generate`, () =>
    HttpResponse.json({
      status: 'STARTED',
      message: '리포트 생성이 시작되었습니다.',
    }),
  ),

  http.get(`${BACKEND_URL}/api/v1/manager/iptrend/exists-today`, () =>
    HttpResponse.json(true),
  ),

  http.post(`${BACKEND_URL}/api/v1/manager/iptrend/scheduler/run`, () =>
    HttpResponse.json({ success: true, message: '스케줄러 실행됨' }),
  ),

  // IP Expansion (Manager)
  http.get(
    `${BACKEND_URL}/api/v1/manager/ip-expansion/proposals`,
    ({ request }) => {
      const url = new URL(request.url);
      const status = url.searchParams.get('status');
      const filtered =
        status && status !== 'ALL'
          ? ORIGINAL_IP_EXPANSION_PROPOSALS.filter((p) => p.status === status)
          : ORIGINAL_IP_EXPANSION_PROPOSALS;

      return HttpResponse.json({
        content: filtered,
        totalPages: 1,
        totalElements: filtered.length,
      });
    },
  ),

  http.get(`${BACKEND_URL}/api/v1/manager/ip-expansion/:id`, ({ params }) => {
    const id = Number(params.id);
    const proposal = ORIGINAL_IP_EXPANSION_PROPOSALS.find((p) => p.id === id);
    if (!proposal) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(proposal);
  }),

  http.post(
    `${BACKEND_URL}/api/v1/manager/ip-expansion`,
    async ({ request }) => {
      const body = (await request.json()) as any;
      const newProposal = {
        id: Math.floor(Math.random() * 100000) + 20000,
        ...body,
        status: 'PENDING',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      ORIGINAL_IP_EXPANSION_PROPOSALS.unshift(newProposal);
      return HttpResponse.json(newProposal);
    },
  ),

  http.patch(
    `${BACKEND_URL}/api/v1/manager/ip-expansion/:id`,
    async ({ params, request }) => {
      const id = Number(params.id);
      const body = (await request.json()) as any;
      const proposal = ORIGINAL_IP_EXPANSION_PROPOSALS.find((p) => p.id === id);
      if (proposal) {
        Object.assign(proposal, body);
        proposal.updatedAt = new Date().toISOString();
        return HttpResponse.json(proposal);
      }
      return new HttpResponse(null, { status: 404 });
    },
  ),

  http.delete(
    `${BACKEND_URL}/api/v1/manager/ip-expansion/:id`,
    ({ params }) => {
      const id = Number(params.id);
      const index = ORIGINAL_IP_EXPANSION_PROPOSALS.findIndex(
        (p) => p.id === id,
      );
      if (index > -1) {
        ORIGINAL_IP_EXPANSION_PROPOSALS.splice(index, 1);
      }
      return new HttpResponse(null, { status: 204 });
    },
  ),

  // Admin API
  http.get(`${BACKEND_URL}/api/v1/admin/dashboard`, () =>
    HttpResponse.json({
      visitors: 1200,
      revenue: 5000000,
      activeUsers: 800,
    }),
  ),

  http.get(`${BACKEND_URL}/api/v1/admin/users`, () =>
    HttpResponse.json({
      content: [
        { id: 1, name: 'User 1', email: 'user1@example.com', role: 'AUTHOR' },
        { id: 2, name: 'User 2', email: 'user2@example.com', role: 'MANAGER' },
      ],
      totalPages: 1,
    }),
  ),
];
