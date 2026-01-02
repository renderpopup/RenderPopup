-- ================================================
-- 행사 이미지 업데이트 (Unsplash 무료 이미지)
-- Supabase SQL Editor에서 실행하세요
-- ================================================

UPDATE events SET image_url = 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=600&fit=crop' 
WHERE title LIKE '%AI%' OR title LIKE '%개발자%' OR title LIKE '%DevFest%' OR title LIKE '%AWS%';

UPDATE events SET image_url = 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=600&fit=crop' 
WHERE title LIKE '%스타트업%' OR title LIKE '%IR%' OR title LIKE '%피칭%' OR title LIKE '%네트워킹%';

UPDATE events SET image_url = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop' 
WHERE title LIKE '%마케팅%' OR title LIKE '%이커머스%';

UPDATE events SET image_url = 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop' 
WHERE title LIKE '%UX%' OR title LIKE '%UI%' OR title LIKE '%디자인%' OR title LIKE '%Figma%';

UPDATE events SET image_url = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop' 
WHERE title LIKE '%컨퍼런스%' OR title LIKE '%페스타%' OR title LIKE '%페어%';

UPDATE events SET image_url = 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop' 
WHERE title LIKE '%부트캠프%' OR title LIKE '%PM%' OR title LIKE '%교육%';

UPDATE events SET image_url = 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=800&h=600&fit=crop' 
WHERE title LIKE '%뷰티%' OR title LIKE '%무신사%';

UPDATE events SET image_url = 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&h=600&fit=crop' 
WHERE title LIKE '%리더십%' OR title LIKE '%여성%';

UPDATE events SET image_url = 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop' 
WHERE title LIKE '%리빙%' OR title LIKE '%인테리어%';

-- 이미지가 없는 나머지 행사들에 기본 이미지 설정
UPDATE events SET image_url = 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&h=600&fit=crop' 
WHERE image_url IS NULL;

