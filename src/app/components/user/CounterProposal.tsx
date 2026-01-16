import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserLayout from '../layout/UserLayout';
import { useAuth } from '../../../lib/contexts/AuthContext';
import { getUserCounterProposals, createCounterProposal } from '../../../lib/api/counterProposals';
import type { CounterProposal as CounterProposalType } from '../../../lib/database.types';
import { MessageSquare, Calendar, DollarSign, Tag, Send, CheckCircle, Clock, Loader2, XCircle } from 'lucide-react';

export default function CounterProposal() {
  const navigate = useNavigate();
  const { user, brandProfile } = useAuth();
  
  const [proposals, setProposals] = useState<CounterProposalType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    brandName: '',
    description: '',
    budget: '',
    targetDate: '',
    category: '플리마켓',
  });

  // 역제안 목록 불러오기
  const fetchProposals = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      const data = await getUserCounterProposals(user.id);
      setProposals(data);
    } catch (err) {
      console.error('Error fetching proposals:', err);
      setError('역제안 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProposals();
  }, [user]);

  // 프로필에서 브랜드명 자동 채우기
  useEffect(() => {
    if (brandProfile && !formData.brandName) {
      setFormData(prev => ({
        ...prev,
        brandName: brandProfile.brand_name || '',
      }));
    }
  }, [brandProfile]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    setSubmitting(true);
    try {
      await createCounterProposal({
        user_id: user.id,
        brand_name: formData.brandName,
        description: formData.description,
        budget: formData.budget,
        target_date: formData.targetDate,
        category: formData.category,
      });

      // 목록 새로고침
      await fetchProposals();
      
      alert('역제안이 등록되었습니다!');
      setShowForm(false);
      setFormData({
        brandName: brandProfile?.brand_name || '',
        description: '',
        budget: '',
        targetDate: '',
        category: '플리마켓',
      });
    } catch (err: any) {
      console.error('Error creating proposal:', err);
      alert(err.message || '역제안 등록 중 오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  };
  
  const getStatusBadge = (status: string) => {
    const config = {
      pending: { icon: Clock, text: '검토 중', className: 'bg-yellow-100 text-yellow-800' },
      accepted: { icon: CheckCircle, text: '수락됨', className: 'bg-green-100 text-green-800' },
      rejected: { icon: XCircle, text: '거절됨', className: 'bg-red-100 text-red-800' },
    };
    const info = config[status as keyof typeof config] || config.pending;
    const Icon = info.icon;
    
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm ${info.className}`}>
        <Icon className="w-4 h-4" />
        {info.text}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // 로그인 체크
  if (!user) {
    return (
      <UserLayout>
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <p className="text-gray-600 mb-4">로그인이 필요합니다.</p>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            로그인하기
          </button>
        </div>
      </UserLayout>
    );
  }
  
  return (
    <UserLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl mb-2">역제안</h1>
          <p className="text-gray-600">원하는 행사 조건을 등록하면 주최사가 제안을 보내드립니다</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Proposal Form/Button */}
          <div className="lg:col-span-1">
            {!showForm ? (
              <div className="bg-white rounded-lg p-6 border border-gray-200 sticky top-24">
                <h2 className="text-xl mb-4">새 역제안 등록</h2>
                <p className="text-gray-600 mb-6">원하는 행사 조건을 알려주세요</p>
                <button
                  onClick={() => setShowForm(true)}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Send className="w-5 h-5" />
                  역제안 등록하기
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-lg p-6 border border-gray-200 sticky top-24">
                <h2 className="text-xl mb-4">역제안 등록</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm mb-2 text-gray-700">브랜드명</label>
                    <input
                      type="text"
                      value={formData.brandName}
                      onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                      placeholder="회사/브랜드 이름"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm mb-2 text-gray-700">카테고리</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option>플리마켓</option>
                      <option>박람회</option>
                      <option>팝업스토어</option>
                      <option>패션/뷰티</option>
                      <option>푸드/F&B</option>
                      <option>핸드메이드</option>
                      <option>기타</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm mb-2 text-gray-700">예산</label>
                    <input
                      type="text"
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      placeholder="예: 100만원"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm mb-2 text-gray-700">희망 일정</label>
                    <input
                      type="date"
                      value={formData.targetDate}
                      onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm mb-2 text-gray-700">상세 설명</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="원하는 행사 규모, 장소, 특별 요구사항 등을 자세히 작성해주세요"
                      required
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      disabled={submitting}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                    >
                      취소
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                      {submitting ? '등록 중...' : '등록'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
          
          {/* Proposals List */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl mb-4">내 역제안 목록</h2>

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-12 bg-white rounded-lg border border-gray-200">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                <span className="ml-3 text-gray-600">역제안 목록을 불러오는 중...</span>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {/* No Proposals */}
            {!loading && !error && proposals.length === 0 && (
              <div className="bg-white rounded-lg p-12 text-center border border-gray-200">
                <p className="text-gray-500">등록된 역제안이 없습니다.</p>
              </div>
            )}

            {/* Proposals */}
            {!loading && !error && proposals.map(proposal => (
              <div key={proposal.id} className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg mb-2">{proposal.brand_name}</h3>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                        {proposal.category}
                      </span>
                      {getStatusBadge(proposal.status)}
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-4">{proposal.description}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <DollarSign className="w-4 h-4" />
                    <span className="text-sm">{proposal.budget}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">{proposal.target_date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MessageSquare className="w-4 h-4" />
                    <span className="text-sm">{proposal.proposals_count || 0}개 제안</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <span className="text-sm text-gray-500">
                    등록일: {formatDate(proposal.submitted_at)}
                  </span>
                  {(proposal.proposals_count || 0) > 0 && (
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                      제안 확인하기
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
