-- ================================================
-- AI 행사 요약 플랫폼 - Supabase Database Schema
-- ================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================================
-- ENUM Types
-- ================================================

CREATE TYPE event_status AS ENUM ('open', 'closed', 'upcoming');
CREATE TYPE application_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE proposal_status AS ENUM ('pending', 'accepted', 'rejected');
CREATE TYPE user_role AS ENUM ('user', 'admin');

-- ================================================
-- Profiles Table (extends Supabase Auth)
-- ================================================

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  role user_role DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    'user'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ================================================
-- Events Table
-- ================================================

CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL,
  location TEXT NOT NULL,
  organizer TEXT NOT NULL,
  category TEXT NOT NULL,
  status event_status DEFAULT 'upcoming',
  applications_count INTEGER DEFAULT 0,
  eligibility TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Events policies (public read, admin write)
CREATE POLICY "Events are viewable by everyone" ON events
  FOR SELECT USING (true);

CREATE POLICY "Admins can insert events" ON events
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update events" ON events
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can delete events" ON events
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Index for faster queries
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_category ON events(category);
CREATE INDEX idx_events_date ON events(date);

-- ================================================
-- Applications Table
-- ================================================

CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  applied_at TIMESTAMPTZ DEFAULT NOW(),
  status application_status DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- Enable RLS
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Applications policies
CREATE POLICY "Users can view their own applications" ON applications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create applications" ON applications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all applications" ON applications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update applications" ON applications
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Index
CREATE INDEX idx_applications_event_id ON applications(event_id);
CREATE INDEX idx_applications_user_id ON applications(user_id);
CREATE INDEX idx_applications_status ON applications(status);

-- Function to update event applications_count
CREATE OR REPLACE FUNCTION update_applications_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE events SET applications_count = applications_count + 1 WHERE id = NEW.event_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE events SET applications_count = applications_count - 1 WHERE id = OLD.event_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_event_applications_count
  AFTER INSERT OR DELETE ON applications
  FOR EACH ROW EXECUTE FUNCTION update_applications_count();

-- ================================================
-- Counter Proposals Table
-- ================================================

CREATE TABLE counter_proposals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  brand_name TEXT NOT NULL,
  description TEXT NOT NULL,
  budget TEXT NOT NULL,
  target_date DATE NOT NULL,
  category TEXT NOT NULL,
  status proposal_status DEFAULT 'pending',
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  proposals_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE counter_proposals ENABLE ROW LEVEL SECURITY;

-- Counter proposals policies
CREATE POLICY "Users can view their own counter proposals" ON counter_proposals
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create counter proposals" ON counter_proposals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own counter proposals" ON counter_proposals
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all counter proposals" ON counter_proposals
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update counter proposals" ON counter_proposals
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Index
CREATE INDEX idx_counter_proposals_user_id ON counter_proposals(user_id);
CREATE INDEX idx_counter_proposals_status ON counter_proposals(status);

-- ================================================
-- Brand Profiles Table
-- ================================================

CREATE TABLE brand_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  brand_name TEXT NOT NULL,
  company_name TEXT NOT NULL,
  business_number TEXT NOT NULL,
  representative_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  website TEXT,
  description TEXT NOT NULL,
  industry TEXT NOT NULL,
  address TEXT NOT NULL,
  product_images TEXT[] DEFAULT '{}',
  business_registration TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE brand_profiles ENABLE ROW LEVEL SECURITY;

-- Brand profiles policies
CREATE POLICY "Users can view their own brand profile" ON brand_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their brand profile" ON brand_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their brand profile" ON brand_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all brand profiles" ON brand_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Index
CREATE INDEX idx_brand_profiles_user_id ON brand_profiles(user_id);

-- ================================================
-- Updated_at Trigger Function
-- ================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to tables
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_brand_profiles_updated_at
  BEFORE UPDATE ON brand_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ================================================
-- Sample Data (Optional - Run separately)
-- ================================================

-- Insert sample events
INSERT INTO events (title, summary, description, date, location, organizer, category, status, eligibility, applications_count) VALUES
('2025 AI 혁신 컨퍼런스', 
 'AI 기술의 최신 트렌드와 실무 적용 사례를 공유하는 대규모 컨퍼런스입니다. 업계 전문가들의 강연과 네트워킹 기회를 제공합니다.',
 'AI 기술의 최신 트렌드와 실무 적용 사례를 공유하는 대규모 컨퍼런스입니다. 업계 전문가들의 강연과 네트워킹 기회를 제공합니다.

주요 세션:
- AI 윤리와 책임
- 생성형 AI 비즈니스 활용
- 자연어 처리 최신 기술
- 컴퓨터 비전 실무 사례',
 '2025-03-15', '코엑스 3층 컨퍼런스홀', '한국AI협회', 'IT/기술', 'open', '누구나 참여 가능', 234),

('스타트업 네트워킹 데이',
 '투자자와 스타트업이 만나는 네트워킹 행사. 피칭 기회와 1:1 미팅을 통해 투자 연결을 지원합니다.',
 '투자자와 스타트업이 만나는 네트워킹 행사. 피칭 기회와 1:1 미팅을 통해 투자 연결을 지원합니다.

프로그램:
- 스타트업 피칭 세션
- 투자자 패널 토론
- 1:1 미팅 매칭
- 네트워킹 리셉션',
 '2025-02-28', '서울 강남구 D2 스타트업 팩토리', '스타트업얼라이언스', '비즈니스', 'open', '스타트업 대표 및 임직원', 89),

('UX/UI 디자인 워크샵',
 '실무 중심의 디자인 프로세스와 도구 활용법을 배우는 핸즈온 워크샵입니다.',
 '실무 중심의 디자인 프로세스와 도구 활용법을 배우는 핸즈온 워크샵입니다.

학습 내용:
- 사용자 리서치 방법론
- 와이어프레임 & 프로토타이핑
- 디자인 시스템 구축
- Figma 실무 활용',
 '2025-04-10', '온라인 (Zoom)', '디자인스쿨', '디자인', 'upcoming', '디자이너 및 관심있는 누구나', 156),

('마케팅 트렌드 세미나',
 '2025년 마케팅 트렌드와 성공 사례를 공유하는 세미나. 데이터 기반 마케팅 전략을 학습합니다.',
 '2025년 마케팅 트렌드와 성공 사례를 공유하는 세미나. 데이터 기반 마케팅 전략을 학습합니다.

주제:
- 퍼포먼스 마케팅
- 소셜미디어 전략
- 콘텐츠 마케팅
- 고객 데이터 분석',
 '2025-03-20', '서울 마포구 프론트원', '마케팅협회', '마케팅', 'open', '마케터 및 사업자', 201),

('블록체인 기술 심화 과정',
 '블록체인 기술의 원리부터 실제 적용까지 심도있게 다루는 교육 프로그램입니다.',
 '블록체인 기술의 원리부터 실제 적용까지 심도있게 다루는 교육 프로그램입니다.

커리큘럼:
- 블록체인 기초
- 스마트 컨트랙트
- DApp 개발
- NFT & 메타버스',
 '2025-05-05', '판교 테크노밸리', '블록체인연구소', 'IT/기술', 'upcoming', '개발자 및 기술 관심자', 67),

('여성 리더십 포럼',
 '여성 리더들의 경험과 인사이트를 공유하는 포럼. 커리어 성장과 리더십 개발을 지원합니다.',
 '여성 리더들의 경험과 인사이트를 공유하는 포럼. 커리어 성장과 리더십 개발을 지원합니다.

프로그램:
- 여성 리더 패널 토크
- 멘토링 세션
- 워크 라이프 밸런스
- 네트워킹',
 '2025-02-25', '서울 중구 더플라자호텔', '여성경제인협회', '비즈니스', 'closed', '여성 직장인 및 사업가', 180);

