import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../layout/AdminLayout';
import { useAuth } from '../../../lib/contexts/AuthContext';
import { getEventById, createEvent, updateEvent } from '../../../lib/api/events';
import type { Event } from '../../../lib/database.types';
import { Save, Sparkles, Loader2, ImagePlus } from 'lucide-react';

export default function AdminEventForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin, loading: authLoading } = useAuth();
  const isEdit = !!id;
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: '플리마켓',
    date: '',
    location: '',
    organizer: '',
    eligibility: '',
    description: '',
    summary: '',
    status: 'upcoming' as 'open' | 'closed' | 'upcoming',
    image_url: '',
  });
  
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

  // 권한 체크
  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate('/admin/login');
    }
  }, [user, isAdmin, authLoading, navigate]);
  
  // 수정 모드일 때 기존 데이터 로드
  useEffect(() => {
    const fetchEvent = async () => {
      if (isEdit && id) {
        setLoading(true);
        try {
          const event = await getEventById(id);
          if (event) {
            setFormData({
              title: event.title,
              category: event.category,
              date: event.date,
              location: event.location,
              organizer: event.organizer,
              eligibility: event.eligibility,
              description: event.description,
              summary: event.summary,
              status: event.status,
              image_url: event.image_url || '',
            });
          }
        } catch (err) {
          console.error('Error fetching event:', err);
          alert('행사 정보를 불러오는데 실패했습니다.');
          navigate('/admin/events');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchEvent();
  }, [isEdit, id, navigate]);
  
  const handleGenerateSummary = () => {
    setIsGeneratingSummary(true);
    
    // AI 요약 생성 로직
    // 입력된 상세 설명을 분석하여 핵심 내용 추출
    setTimeout(() => {
      const description = formData.description;
      let summary = '';

      // 간단한 요약 로직: 첫 200자 + 핵심 키워드 추출
      if (description.length > 0) {
        // 이모지 제거 후 첫 번째 의미있는 문장들 추출
        const cleanText = description
          .replace(/[🌸✨🍀💼🎨🎪🏆🎄🎁📍📅📱💡✅⏳]/g, '')
          .replace(/\*\*/g, '')
          .replace(/\n+/g, ' ')
          .trim();
        
        // 첫 150자 정도로 요약
        if (cleanText.length > 150) {
          summary = cleanText.substring(0, 150).trim() + '...';
        } else {
          summary = cleanText;
        }

        // 행사 정보 포함
        if (formData.title && formData.date && formData.location) {
          summary = `${formData.title}이(가) ${formData.date}에 ${formData.location}에서 개최됩니다. ${summary}`;
        }
      }

      setFormData({ ...formData, summary });
      setIsGeneratingSummary(false);
      alert('AI 요약이 생성되었습니다!');
    }, 1500);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const eventData = {
        title: formData.title,
        category: formData.category,
        date: formData.date,
        location: formData.location,
        organizer: formData.organizer,
        eligibility: formData.eligibility,
        description: formData.description,
        summary: formData.summary || formData.description.substring(0, 150) + '...',
        status: formData.status,
        image_url: formData.image_url || null,
      };

      if (isEdit && id) {
        await updateEvent(id, eventData);
        alert('행사가 수정되었습니다!');
      } else {
        await createEvent(eventData);
        alert('행사가 등록되었습니다!');
      }
      
      navigate('/admin/events');
    } catch (err: any) {
      console.error('Error saving event:', err);
      alert(err.message || '행사 저장 중 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-3 text-gray-600">로딩 중...</span>
        </div>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout>
      <div className="max-w-4xl">
        <h1 className="text-3xl mb-8">{isEdit ? '행사 수정' : '행사 등록'}</h1>
        
        <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6 md:p-8">
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm mb-2">
                행사명 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="행사명을 입력하세요"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            {/* Category and Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-2">
                  카테고리 <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option>플리마켓</option>
                  <option>박람회</option>
                  <option>팝업</option>
                  <option>전시회</option>
                  <option>축제</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm mb-2">
                  상태 <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="upcoming">오픈 예정</option>
                  <option value="open">신청 가능</option>
                  <option value="closed">마감</option>
                </select>
              </div>
            </div>
            
            {/* Date and Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-2">
                  일정 <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm mb-2">
                  장소 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="예: 대구 동성로 CGV 앞 광장"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            {/* Organizer */}
            <div>
              <label className="block text-sm mb-2">
                주최 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.organizer}
                onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                placeholder="주최사 이름"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            {/* Eligibility */}
            <div>
              <label className="block text-sm mb-2">
                참가 조건 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.eligibility}
                onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })}
                placeholder="예: 핸드메이드 작가, 소상공인"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-sm mb-2">
                <ImagePlus className="inline w-4 h-4 mr-1" />
                이미지 URL
              </label>
              <input
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-2">
                💡 Unsplash 등에서 이미지 URL을 복사하여 붙여넣으세요
              </p>
              {formData.image_url && (
                <div className="mt-2">
                  <img 
                    src={formData.image_url} 
                    alt="미리보기" 
                    className="h-32 w-auto rounded-lg object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
            
            {/* Description */}
            <div>
              <label className="block text-sm mb-2">
                상세 설명 <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="행사에 대한 상세한 설명을 입력하세요 (마크다운, 이모지 사용 가능)"
                required
                rows={10}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
              />
            </div>
            
            {/* AI Summary */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm">
                  AI 자동 요약
                </label>
                <button
                  type="button"
                  onClick={handleGenerateSummary}
                  disabled={!formData.description || isGeneratingSummary}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 text-sm"
                >
                  {isGeneratingSummary ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                  {isGeneratingSummary ? 'AI 요약 생성중...' : 'AI 요약 생성'}
                </button>
              </div>
              <textarea
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                placeholder="AI가 자동으로 요약을 생성합니다"
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-blue-50"
              />
              <p className="text-xs text-gray-500 mt-2">
                💡 상세 설명을 먼저 입력한 후 'AI 요약 생성' 버튼을 클릭하세요. 요약을 직접 수정할 수도 있습니다.
              </p>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/admin/events')}
              disabled={saving}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              {saving ? '저장 중...' : (isEdit ? '수정 완료' : '등록하기')}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
