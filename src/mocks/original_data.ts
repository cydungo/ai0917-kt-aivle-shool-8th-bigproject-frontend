export const ORIGINAL_WORK_ID = 101;
export const ORIGINAL_WORK_TITLE =
  '크로노스 알케미스트 (The Clockwork Alchemist)';

export const ORIGINAL_TITLES = [
  '크로노스 알케미스트',
  '은하수의 궤적',
  '심연의 기록자',
  '바람이 머무는 언덕',
  '기계 심장의 고동',
  '마지막 드래곤의 노래',
  '별을 잇는 연금술사',
  '그림자 기사단',
  '환상의 도서관',
  '잊혀진 왕국의 비밀',
  '새벽의 파수꾼',
  '황혼의 마법사',
  '크리스탈 하트',
  '차원을 넘는 상인',
  '정령왕의 계약자',
  '무한의 미궁',
  '천공의 성',
  '심해의 도시',
  '숲의 수호자',
  '사막의 붉은 달',
];

export const ORIGINAL_GENRES = [
  '판타지',
  '무협',
  '현대판타지',
  '로맨스판타지',
  'SF',
  '스팀펑크',
  '미스터리',
  '스릴러',
  '일상물',
  '성장물',
];

export const ORIGINAL_NAMES = [
  '엘라라',
  '케일런',
  '아리아',
  '루시안',
  '세라',
  '카이',
  '리나',
  '진',
  '미아',
  '레오',
  '아이린',
  '시온',
  '루나',
  '에반',
  '유리',
  '한스',
  '클로이',
  '데미안',
  '노아',
  '소피아',
];

export const ORIGINAL_LOREBOOKS = [
  // 인물 (Person)
  {
    id: 1001,
    category: '인물',
    title: '엘라라 밴스 (Elara Vance)',
    description:
      '몰락한 연금술 명가의 마지막 후계자. 차가운 이성과 뜨거운 복수심을 동시에 지닌 천재 연금술사.',
    content:
      '키 165cm, 은발에 녹안. 항상 가죽 장갑을 끼고 다니며, 오른쪽 눈에는 정밀 작업을 위한 모노클을 착용한다. 어릴 적 "대붕괴"로 가족을 잃고, 유일하게 남은 유산인 "크로노스 코어"의 비밀을 풀기 위해 기어헤이븐의 지하 공방에서 숨어 지낸다. 성격은 냉소적이지만, 기계와 연금술에 대해서는 순수한 열정을 보인다.',
    tags: ['주인공', '연금술사', '천재', '복수'],
    updatedAt: new Date().toISOString(),
  },
  {
    id: 1002,
    category: '인물',
    title: '케일런 쏜 (Kaelen Thorne)',
    description:
      '기어헤이븐의 치안 총괄자이자 "아이언 서클"의 집행관. 기술의 통제를 통한 완벽한 질서를 꿈꾼다.',
    content:
      '185cm의 거구. 전신에 증기기관 강화 외골격을 착용하고 있다. 감정을 불필요한 변수로 여기며, 연금술을 "불확실한 고대 기술"로 규정하고 탄압한다. 하지만 그 역시 과거의 사고로 잃은 신체의 일부를 기계로 대체하며 인간성을 잃어가고 있다.',
    tags: ['악역', '집행관', '사이보그', '질서'],
    updatedAt: new Date().toISOString(),
  },
  // 장소 (Place)
  {
    id: 2001,
    category: '장소',
    title: '기어헤이븐 (Gearhaven)',
    description:
      '거대한 톱니바퀴 위에 세워진 공중 도시. 증기와 태엽으로 움직이는 문명의 최전선.',
    content:
      '3개의 층으로 나뉘어 있다. 상층부는 귀족과 아이언 서클이 거주하는 "솔라리움", 중층부는 상업 지구와 일반 거주지인 "메인 스프링", 하층부는 폐기물 처리장과 빈민가인 "러스트 핏". 도시는 거대한 중앙 태엽탑에 의해 지탱되며, 끊임없이 째깍거리는 소음과 증기가 가득하다.',
    tags: ['도시', '스팀펑크', '계급사회'],
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2002,
    category: '장소',
    title: '러스트 웨이스트 (The Rust Wastes)',
    description:
      '기어헤이븐 아래 펼쳐진 황무지. 대붕괴 이후 오염된 땅과 고철의 무덤.',
    content:
      '붉은 녹가루가 눈처럼 내리는 죽음의 땅. 기괴하게 변이된 금속 생명체 "스크랩 비스트"들이 배회한다. 추방자들과 스캐빈저들이 고대 유물을 찾아 목숨을 걸고 탐험하는 곳이기도 하다.',
    tags: ['황무지', '위험지역', '고철'],
    updatedAt: new Date().toISOString(),
  },
  // 물건 (Object)
  {
    id: 3001,
    category: '물건',
    title: '크로노스 코어 (Chronos Core)',
    description: '시간을 되돌릴 수 있다고 전해지는 전설의 연금술 아티팩트.',
    content:
      '손바닥만 한 크기의 황금색 큐브. 표면에는 해석 불가능한 룬 문자가 새겨져 있으며, 내부에서는 푸른 빛이 고동친다. 엘라라의 가문이 대대로 지켜온 비보이며, 작동 원리는 소실되었다. 케일런 쏜이 집요하게 노리는 물건이다.',
    tags: ['아티팩트', '시간', '키아이템'],
    updatedAt: new Date().toISOString(),
  },
  {
    id: 3002,
    category: '물건',
    title: '에테르 바이알 (Aether Vial)',
    description: '고농축 마력 연료. 기어헤이븐의 모든 동력원.',
    content:
      '푸른색 액체가 담긴 유리병. 지하 깊은 곳에서 채굴되는 "에테르 원석"을 정제하여 만든다. 매우 불안정하여 충격을 받으면 폭발할 수 있다. 화폐 대용으로도 사용된다.',
    tags: ['연료', '화폐', '자원'],
    updatedAt: new Date().toISOString(),
  },
  // 단체 (Group)
  {
    id: 4001,
    category: '단체',
    title: '아이언 서클 (The Iron Circle)',
    description: '기어헤이븐을 통치하는 7인의 기술 관료 의회.',
    content:
      '도시의 모든 에너지와 기술을 독점하고 있다. "효율과 질서"를 최우선 가치로 삼으며, 개인의 자유보다 전체의 생존을 중시한다. 비밀 경찰 조직인 "기어 가드"를 운영한다.',
    tags: ['정부', '독재', '기술'],
    updatedAt: new Date().toISOString(),
  },
  {
    id: 4002,
    category: '단체',
    title: '스크랩 스캐빈저 (Scrap Scavengers)',
    description: '러스트 웨이스트에서 활동하는 무법자 집단.',
    content:
      '고철과 유물을 수집하여 암시장에 파는 것으로 생계를 유지한다. 아이언 서클에 저항하는 반란군적인 성격도 띠고 있다. 거친 성격들이지만 의리 하나로 뭉쳐 있다.',
    tags: ['반란군', '무법자', '생존자'],
    updatedAt: new Date().toISOString(),
  },
  // 세계 (World)
  {
    id: 5001,
    category: '세계',
    title: '에테르-스팀 시대 (Aether-Steam Era)',
    description: '마법(에테르)과 과학(증기기관)이 융합된 독특한 문명 시대.',
    content:
      '과거의 순수 마법 문명이 멸망한 후, 남겨진 마력 자원을 기계 공학으로 제어하는 시대. 연금술은 이 두 가지를 연결하는 가교 역할을 했으나, 현재는 금기시되고 있다.',
    tags: ['시대배경', '마법공학', '역사'],
    updatedAt: new Date().toISOString(),
  },
  // 사건 (Event)
  {
    id: 6001,
    category: '사건',
    title: '대붕괴 (The Great Collapse)',
    description: '50년 전, 지상의 문명을 멸망시킨 원인 불명의 대재앙.',
    content:
      '갑작스러운 에테르 폭주로 인해 지각이 뒤틀리고 대기가 오염되었다. 살아남은 인류는 공중 도시 기어헤이븐으로 피신했다. 이 사건의 진실은 아이언 서클에 의해 은폐되어 있다.',
    tags: ['재앙', '과거', '미스터리'],
    updatedAt: new Date().toISOString(),
  },
];

export const ORIGINAL_IP_EXPANSION_PROPOSALS = [
  {
    id: 101,
    title: '크로노스 알케미스트 - 웹툰화 프로젝트',
    authorId: 1,
    authorName: '김에이블',
    workId: ORIGINAL_WORK_ID,
    workTitle: ORIGINAL_WORK_TITLE,
    format: 'webtoon',
    status: 'REVIEWING',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    updatedAt: new Date().toISOString(),
    business: {
      budget: '50000000',
      royalty: '8',
      targetAge: ['10', '20'],
      targetGender: 'male',
      rights: ['2nd_copyright', 'merchandise'],
    },
    mediaDetails: {
      platform: 'naver',
      serializationCycle: 'weekly',
      colorType: 'full_color',
      targetCharacter: '엘라라 밴스',
    },
    contentStrategy: {
      differentiation: '스팀펑크 비주얼과 마법 연출의 화려한 조화',
      keyReason: '최근 회빙환 트렌드에 지친 독자들에게 신선한 소재 제공',
      successGrounds: '원작 소설의 탄탄한 팬덤 (누적 조회수 500만)',
      coreNarrative: '복수를 위한 여정과 성장, 그리고 밝혀지는 세계의 진실',
      worldBuilding: '기어헤이븐의 입체적인 구조 시각화',
      visualStyle: '극화체, 높은 채도의 에테르 효과',
    },
  },
  {
    id: 102,
    title: '기어헤이븐: 이스케이프 (모바일 게임)',
    authorId: 1,
    authorName: '김에이블',
    workId: ORIGINAL_WORK_ID,
    workTitle: ORIGINAL_WORK_TITLE,
    format: 'game',
    status: 'APPROVED',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
    updatedAt: new Date().toISOString(),
    business: {
      budget: '200000000',
      royalty: '10',
      targetAge: ['10', '20', '30'],
      targetGender: 'all',
      rights: ['game_rights'],
    },
    mediaDetails: {
      gameGenre: 'puzzle',
      platform: 'mobile',
    },
    contentStrategy: {
      differentiation: '태엽 퍼즐을 활용한 독창적인 탈출 기믹',
      keyReason: '원작의 "기어헤이븐" 구조가 퍼즐 게임에 최적화됨',
      successGrounds: '유사 장르(방탈출)의 꾸준한 인기',
      coreNarrative: '하층민이 상층부로 올라가는 수직적 서사',
      worldBuilding: '각 층마다 다른 테마의 맵 디자인',
      visualStyle: 'SD 캐릭터, 캐주얼한 스팀펑크 아트',
    },
  },
  {
    id: 103,
    title: '러스트 웨이스트의 유령 (스핀오프 소설)',
    authorId: 1,
    authorName: '김에이블',
    workId: ORIGINAL_WORK_ID,
    workTitle: ORIGINAL_WORK_TITLE,
    format: 'spinoff',
    status: 'PENDING',
    createdAt: new Date().toISOString(), // Today
    updatedAt: new Date().toISOString(),
    business: {
      budget: '5000000',
      royalty: '70',
      targetAge: ['20', '30'],
      targetGender: 'male',
      rights: ['publication'],
    },
    mediaDetails: {
      spinoffType: 'prequel',
      targetCharacter: '케일런 쏜',
    },
    contentStrategy: {
      differentiation: '악역인 케일런 쏜의 과거 시점 서사',
      keyReason: '악역의 입체성을 부여하여 원작의 깊이감 증대',
      successGrounds: '원작 댓글에서 케일런 쏜의 과거에 대한 궁금증 다수',
      coreNarrative: '그가 왜 감정을 버리고 기계를 택했는지에 대한 비극',
      worldBuilding: '대붕괴 직후의 혼란스러운 시대상',
      visualStyle: '느와르, 어두운 분위기',
    },
  },
];
