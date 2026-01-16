-- ================================================
-- RLS 정책 수정 SQL
-- 이 스크립트를 Supabase SQL Editor에서 실행하세요
-- ================================================

-- 1. 기존 RLS 정책 삭제 (충돌 방지)
DROP POLICY IF EXISTS "Users can view their own applications" ON applications;
DROP POLICY IF EXISTS "Users can create applications" ON applications;
DROP POLICY IF EXISTS "Admins can view all applications" ON applications;
DROP POLICY IF EXISTS "Admins can update applications" ON applications;

DROP POLICY IF EXISTS "Users can view their own counter proposals" ON counter_proposals;
DROP POLICY IF EXISTS "Users can create counter proposals" ON counter_proposals;
DROP POLICY IF EXISTS "Users can update their own counter proposals" ON counter_proposals;
DROP POLICY IF EXISTS "Admins can view all counter proposals" ON counter_proposals;
DROP POLICY IF EXISTS "Admins can update counter proposals" ON counter_proposals;

DROP POLICY IF EXISTS "Users can view their own brand profile" ON brand_profiles;
DROP POLICY IF EXISTS "Users can create their brand profile" ON brand_profiles;
DROP POLICY IF EXISTS "Users can update their brand profile" ON brand_profiles;
DROP POLICY IF EXISTS "Admins can view all brand profiles" ON brand_profiles;

DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;

-- ================================================
-- 2. Applications 테이블 RLS 정책 재생성
-- ================================================

-- 사용자는 자신의 신청 내역 조회 가능
CREATE POLICY "Users can view own applications"
ON applications FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- 사용자는 신청 생성 가능
CREATE POLICY "Users can create applications"
ON applications FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- 관리자는 모든 신청 조회 가능
CREATE POLICY "Admins can view all applications"
ON applications FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- 관리자는 모든 신청 수정 가능
CREATE POLICY "Admins can update all applications"
ON applications FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- ================================================
-- 3. Counter Proposals 테이블 RLS 정책 재생성
-- ================================================

-- 사용자는 자신의 역제안 조회 가능
CREATE POLICY "Users can view own counter proposals"
ON counter_proposals FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- 사용자는 역제안 생성 가능
CREATE POLICY "Users can create counter proposals"
ON counter_proposals FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- 사용자는 자신의 역제안 수정 가능
CREATE POLICY "Users can update own counter proposals"
ON counter_proposals FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- 관리자는 모든 역제안 조회 가능
CREATE POLICY "Admins can view all counter proposals"
ON counter_proposals FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- 관리자는 모든 역제안 수정 가능
CREATE POLICY "Admins can update all counter proposals"
ON counter_proposals FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- ================================================
-- 4. Brand Profiles 테이블 RLS 정책 재생성
-- ================================================

-- 사용자는 자신의 브랜드 프로필 조회 가능
CREATE POLICY "Users can view own brand profile"
ON brand_profiles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- 사용자는 브랜드 프로필 생성 가능
CREATE POLICY "Users can create brand profile"
ON brand_profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- 사용자는 자신의 브랜드 프로필 수정 가능
CREATE POLICY "Users can update own brand profile"
ON brand_profiles FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- 관리자는 모든 브랜드 프로필 조회 가능
CREATE POLICY "Admins can view all brand profiles"
ON brand_profiles FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- ================================================
-- 5. Profiles 테이블 RLS 정책 재생성
-- ================================================

-- 사용자는 자신의 프로필 조회 가능
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- 사용자는 자신의 프로필 수정 가능
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id);

-- 관리자는 모든 프로필 조회 가능
CREATE POLICY "Admins can view all profiles"
ON profiles FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- ================================================
-- 6. 프로필 자동 생성 트리거 확인 (이미 있으면 무시)
-- ================================================

-- handle_new_user 함수가 없으면 생성
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    'user'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 트리거가 없으면 생성
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ================================================
-- 7. 현재 사용자를 관리자로 설정 (이메일 수정 필요)
-- ================================================

-- renderpopupp@gmail.com 계정을 관리자로 설정
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'renderpopupp@gmail.com';

-- 확인
SELECT id, email, name, role FROM profiles WHERE email = 'renderpopupp@gmail.com';
