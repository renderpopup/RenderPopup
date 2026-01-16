-- ================================================
-- 관리자 계정 생성 SQL
-- ================================================
-- 
-- 관리자 계정 생성 방법:
-- 1. Supabase Dashboard에서 Authentication > Users로 이동
-- 2. "Add user" 버튼을 클릭하여 관리자 이메일/비밀번호로 새 사용자 생성
-- 3. 생성된 사용자의 UUID를 복사
-- 4. 아래 SQL에서 'YOUR_ADMIN_USER_UUID'를 복사한 UUID로 교체
-- 5. SQL Editor에서 실행
--
-- 예시:
-- UPDATE profiles 
-- SET role = 'admin' 
-- WHERE id = '123e4567-e89b-12d3-a456-426614174000';

-- profiles 테이블에 admin role 추가
-- (사용자가 처음 로그인하면 profiles 테이블에 자동으로 레코드가 생성됩니다)

-- 특정 사용자를 관리자로 지정
-- 아래 UUID를 실제 관리자 계정의 UUID로 변경하세요
-- UPDATE profiles 
-- SET role = 'admin' 
-- WHERE id = 'YOUR_ADMIN_USER_UUID';

-- 또는 이메일로 관리자 지정
-- UPDATE profiles 
-- SET role = 'admin' 
-- WHERE email = 'admin@example.com';

-- 현재 사용자 목록 확인
-- SELECT id, email, role, created_at FROM profiles ORDER BY created_at DESC;

-- ================================================
-- 빠른 관리자 설정 (이메일로)
-- ================================================
-- renderpopupp@gmail.com 계정을 관리자로 설정
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'renderpopupp@gmail.com';
