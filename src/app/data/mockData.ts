export interface Event {
  id: string;
  title: string;
  summary: string;
  description: string;
  date: string;
  location: string;
  organizer: string;
  category: string;
  status: 'open' | 'closed' | 'upcoming';
  applicationsCount: number;
  eligibility: string;
  imageUrl?: string;
}

export interface Application {
  id: string;
  eventId: string;
  eventTitle: string;
  userName: string;
  userEmail: string;
  appliedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface CounterProposal {
  id: string;
  brandName: string;
  description: string;
  budget: string;
  targetDate: string;
  category: string;
  status: 'pending' | 'accepted' | 'rejected';
  submittedAt: string;
  proposals: number;
}

export interface BrandProfile {
  id: string;
  userId: string;
  brandName: string;
  companyName: string;
  businessNumber: string;
  representativeName: string;
  email: string;
  phone: string;
  website?: string;
  description: string;
  industry: string;
  address: string;
  productImages: string[];
  businessRegistration?: string;
  createdAt: string;
  updatedAt: string;
}

export const mockEvents: Event[] = [
  {
    id: '1',
    title: '2025 AI 혁신 컨퍼런스',
    summary: 'AI 기술의 최신 트렌드와 실무 적용 사례를 공유하는 대규모 컨퍼런스입니다. 업계 전문가들의 강연과 네트워킹 기회를 제공합니다.',
    description: 'AI 기술의 최신 트렌드와 실무 적용 사례를 공유하는 대규모 컨퍼런스입니다. 업계 전문가들의 강연과 네트워킹 기회를 제공합니다.\n\n주요 세션:\n- AI 윤리와 책임\n- 생성형 AI 비즈니스 활용\n- 자연어 처리 최신 기술\n- 컴퓨터 비전 실무 사례',
    date: '2025-03-15',
    location: '코엑스 3층 컨퍼런스홀',
    organizer: '한국AI협회',
    category: 'IT/기술',
    status: 'open',
    applicationsCount: 234,
    eligibility: '누구나 참여 가능',
  },
  {
    id: '2',
    title: '스타트업 네트워킹 데이',
    summary: '투자자와 스타트업이 만나는 네트워킹 행사. 피칭 기회와 1:1 미팅을 통해 투자 연결을 지원합니다.',
    description: '투자자와 스타트업이 만나는 네트워킹 행사. 피칭 기회와 1:1 미팅을 통해 투자 연결을 지원합니다.\n\n프로그램:\n- 스타트업 피칭 세션\n- 투자자 패널 토론\n- 1:1 미팅 매칭\n- 네트워킹 리셉션',
    date: '2025-02-28',
    location: '서울 강남구 D2 스타트업 팩토리',
    organizer: '스타트업얼라이언스',
    category: '비즈니스',
    status: 'open',
    applicationsCount: 89,
    eligibility: '스타트업 대표 및 임직원',
  },
  {
    id: '3',
    title: 'UX/UI 디자인 워크샵',
    summary: '실무 중심의 디자인 프로세스와 도구 활용법을 배우는 핸즈온 워크샵입니다.',
    description: '실무 중심의 디자인 프로세스와 도구 활용법을 배우는 핸즈온 워크샵입니다.\n\n학습 내용:\n- 사용자 리서치 방법론\n- 와이어프레임 & 프로토타이핑\n- 디자인 시스템 구축\n- Figma 실무 활용',
    date: '2025-04-10',
    location: '온라인 (Zoom)',
    organizer: '디자인스쿨',
    category: '디자인',
    status: 'upcoming',
    applicationsCount: 156,
    eligibility: '디자이너 및 관심있는 누구나',
  },
  {
    id: '4',
    title: '마케팅 트렌드 세미나',
    summary: '2025년 마케팅 트렌드와 성공 사례를 공유하는 세미나. 데이터 기반 마케팅 전략을 학습합니다.',
    description: '2025년 마케팅 트렌드와 성공 사례를 공유하는 세미나. 데이터 기반 마케팅 전략을 학습합니다.\n\n주제:\n- 퍼포먼스 마케팅\n- 소셜미디어 전략\n- 콘텐츠 마케팅\n- 고객 데이터 분석',
    date: '2025-03-20',
    location: '서울 마포구 프론트원',
    organizer: '마케팅협회',
    category: '마케팅',
    status: 'open',
    applicationsCount: 201,
    eligibility: '마케터 및 사업자',
  },
  {
    id: '5',
    title: '블록체인 기술 심화 과정',
    summary: '블록체인 기술의 원리부터 실제 적용까지 심도있게 다루는 교육 프로그램입니다.',
    description: '블록체인 기술의 원리부터 실제 적용까지 심도있게 다루는 교육 프로그램입니다.\n\n커리큘럼:\n- 블록체인 기초\n- 스마트 컨트랙트\n- DApp 개발\n- NFT & 메타버스',
    date: '2025-05-05',
    location: '판교 테크노밸리',
    organizer: '블록체인연구소',
    category: 'IT/기술',
    status: 'upcoming',
    applicationsCount: 67,
    eligibility: '개발자 및 기술 관심자',
  },
  {
    id: '6',
    title: '여성 리더십 포럼',
    summary: '여성 리더들의 경험과 인사이트를 공유하는 포럼. 커리어 성장과 리더십 개발을 지원합니다.',
    description: '여성 리더들의 경험과 인사이트를 공유하는 포럼. 커리어 성장과 리더십 개발을 지원합니다.\n\n프로그램:\n- 여성 리더 패널 토크\n- 멘토링 세션\n- 워크 라이프 밸런스\n- 네트워킹',
    date: '2025-02-25',
    location: '서울 중구 더플라자호텔',
    organizer: '여성경제인협회',
    category: '비즈니스',
    status: 'closed',
    applicationsCount: 180,
    eligibility: '여성 직장인 및 사업가',
  },
];

export const mockApplications: Application[] = [
  {
    id: 'app1',
    eventId: '1',
    eventTitle: '2025 AI 혁신 컨퍼런스',
    userName: '김철수',
    userEmail: 'kim@example.com',
    appliedAt: '2025-01-15',
    status: 'approved',
  },
  {
    id: 'app2',
    eventId: '2',
    eventTitle: '스타트업 네트워킹 데이',
    userName: '이영희',
    userEmail: 'lee@example.com',
    appliedAt: '2025-01-18',
    status: 'pending',
  },
  {
    id: 'app3',
    eventId: '3',
    eventTitle: 'UX/UI 디자인 워크샵',
    userName: '박민수',
    userEmail: 'park@example.com',
    appliedAt: '2025-01-20',
    status: 'pending',
  },
  {
    id: 'app4',
    eventId: '1',
    eventTitle: '2025 AI 혁신 컨퍼런스',
    userName: '최지은',
    userEmail: 'choi@example.com',
    appliedAt: '2025-01-22',
    status: 'approved',
  },
];

export const mockCounterProposals: CounterProposal[] = [
  {
    id: 'cp1',
    brandName: '테크노벨',
    description: '개발자 채용 행사를 희망합니다. 500명 규모, 서울 코엑스 선호',
    budget: '3000만원',
    targetDate: '2025-04-01',
    category: 'IT/기술',
    status: 'pending',
    submittedAt: '2025-01-10',
    proposals: 3,
  },
  {
    id: 'cp2',
    brandName: '마케팅플러스',
    description: '마케터 네트워킹 행사, 100명 규모, 강남 지역 희망',
    budget: '800만원',
    targetDate: '2025-03-15',
    category: '마케팅',
    status: 'accepted',
    submittedAt: '2025-01-05',
    proposals: 5,
  },
  {
    id: 'cp3',
    brandName: '디자인하우스',
    description: '디자인 세미나 개최 희망, 오프라인 50명, 온라인 200명',
    budget: '1500만원',
    targetDate: '2025-05-20',
    category: '디자인',
    status: 'pending',
    submittedAt: '2025-01-12',
    proposals: 2,
  },
];

export const mockBrandProfiles: BrandProfile[] = [
  {
    id: 'bp1',
    userId: 'user1',
    brandName: '테크노벨',
    companyName: '테크노벨 주식회사',
    businessNumber: '123-45-67890',
    representativeName: '김철수',
    email: 'kim@example.com',
    phone: '010-1234-5678',
    website: 'https://techonvel.com',
    description: '최신 기술을 활용한 솔루션 제공',
    industry: 'IT/기술',
    address: '서울 강남구 테크노밸리 123',
    productImages: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
    businessRegistration: 'https://example.com/business_registration.pdf',
    createdAt: '2025-01-01',
    updatedAt: '2025-01-01',
  },
  {
    id: 'bp2',
    userId: 'user2',
    brandName: '마케팅플러스',
    companyName: '마케팅플러스 주식회사',
    businessNumber: '123-45-67891',
    representativeName: '이영희',
    email: 'lee@example.com',
    phone: '010-1234-5679',
    website: 'https://marketingplus.com',
    description: '효과적인 마케팅 전략 제공',
    industry: '마케팅',
    address: '서울 강남구 D2 스타트업 팩토리 456',
    productImages: ['https://example.com/image3.jpg', 'https://example.com/image4.jpg'],
    businessRegistration: 'https://example.com/business_registration2.pdf',
    createdAt: '2025-01-02',
    updatedAt: '2025-01-02',
  },
  {
    id: 'bp3',
    userId: 'user3',
    brandName: '디자인하우스',
    companyName: '디자인하우스 주식회사',
    businessNumber: '123-45-67892',
    representativeName: '박민수',
    email: 'park@example.com',
    phone: '010-1234-5680',
    website: 'https://designhouse.com',
    description: '창의적인 디자인 솔루션 제공',
    industry: '디자인',
    address: '서울 강남구 D2 스타트업 팩토리 789',
    productImages: ['https://example.com/image5.jpg', 'https://example.com/image6.jpg'],
    businessRegistration: 'https://example.com/business_registration3.pdf',
    createdAt: '2025-01-03',
    updatedAt: '2025-01-03',
  },
];