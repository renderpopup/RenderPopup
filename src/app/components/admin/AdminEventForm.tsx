import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../layout/AdminLayout';
import { mockEvents } from '../../data/mockData';
import { Save, Sparkles } from 'lucide-react';

export default function AdminEventForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  
  const [formData, setFormData] = useState({
    title: '',
    category: 'IT/기술',
    date: '',
    location: '',
    organizer: '',
    eligibility: '',
    description: '',
    summary: '',
    status: 'upcoming' as 'open' | 'closed' | 'upcoming',
  });
  
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  
  useEffect(() => {
    if (isEdit && id) {
      const event = mockEvents.find(e => e.id === id);
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
        });
      }
    }
  }, [isEdit, id]);
  
  const handleGenerateSummary = () => {
    setIsGeneratingSummary(true);
    // AI 요약 생성 시뮬레이션
    setTimeout(() => {
      const summary = formData.description.split('\n').slice(0, 2).join(' ');
      setFormData({ ...formData, summary });
      setIsGeneratingSummary(false);
      alert('AI 요약이 생성되었습니다!');
    }, 1500);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(isEdit ? '행사가 수정되었습니다!' : '행사가 등록되었습니다!');
    navigate('/admin/events');
  };
  
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
                  <option>IT/기술</option>
                  <option>비즈니스</option>
                  <option>디자인</option>
                  <option>마케팅</option>
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
                  placeholder="예: 코엑스 3층 컨퍼런스홀"
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
                placeholder="예: 누구나 참여 가능"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            {/* Description */}
            <div>
              <label className="block text-sm mb-2">
                상세 설명 <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="행사에 대한 상세한 설명을 입력하세요"
                required
                rows={8}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  <Sparkles className="w-4 h-4" />
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
                💡 상세 설명을 먼저 입력한 후 'AI 요약 생성' 버튼을 클릭하세요
              </p>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/admin/events')}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Save className="w-5 h-5" />
              {isEdit ? '수정 완료' : '등록하기'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
