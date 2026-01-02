import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import UserLayout from '../layout/UserLayout';
import { getEventById } from '../../../lib/api/events';
import { createApplication, hasUserApplied } from '../../../lib/api/applications';
import { useAuth } from '../../../lib/contexts/AuthContext';
import type { Event } from '../../../lib/database.types';
import { Calendar, MapPin, Users, Building2, CheckCircle, Share2, Sparkles, Zap, Edit, Loader2 } from 'lucide-react';

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, brandProfile } = useAuth();
  
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applying, setApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  const hasProfile = !!brandProfile;

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await getEventById(id);
        setEvent(data);
        
        // Check if user has already applied
        if (user) {
          const applied = await hasUserApplied(user.id, id);
          setHasApplied(applied);
        }
      } catch (err) {
        console.error('Error fetching event:', err);
        setError('행사 정보를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, user]);
  
  useEffect(() => {
    if (searchParams.get('apply') === 'true' && !hasApplied) {
      setShowApplyModal(true);
    }
  }, [searchParams, hasApplied]);
  
  if (loading) {
    return (
      <UserLayout>
        <div className="max-w-4xl mx-auto px-4 py-12 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-3 text-gray-600">행사 정보를 불러오는 중...</span>
        </div>
      </UserLayout>
    );
  }

  if (error || !event) {
    return (
      <UserLayout>
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <p className="text-gray-500">{error || '행사를 찾을 수 없습니다.'}</p>
          <Link to="/" className="mt-4 inline-block text-blue-600 hover:text-blue-700">
            ← 행사 목록으로 돌아가기
          </Link>
        </div>
      </UserLayout>
    );
  }
  
  const handleApply = async () => {
    if (!user) {
      if (confirm('로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?')) {
        navigate('/login');
      }
      return;
    }

    setApplying(true);
    try {
      await createApplication({
        event_id: event.id,
        user_id: user.id,
        user_name: brandProfile?.representative_name || user.email?.split('@')[0] || 'Unknown',
        user_email: user.email || '',
      });
      
      navigate('/application-complete', { state: { event } });
    } catch (err: any) {
      alert(err.message || '신청 중 오류가 발생했습니다.');
    } finally {
      setApplying(false);
      setShowApplyModal(false);
    }
  };
  
  const handleQuickApply = async () => {
    if (!user) {
      if (confirm('로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?')) {
        navigate('/login');
      }
      return;
    }

    if (!hasProfile) {
      if (confirm('프로필이 등록되지 않았습니다. 프로필 등록 페이지로 이동하시겠습니까?')) {
        navigate('/my-profile');
      }
      return;
    }
    
    setApplying(true);
    try {
      await createApplication({
        event_id: event.id,
        user_id: user.id,
        user_name: brandProfile.representative_name,
        user_email: brandProfile.email,
      });
      
      navigate('/application-complete', { state: { event, profile: brandProfile } });
    } catch (err: any) {
      alert(err.message || '신청 중 오류가 발생했습니다.');
    } finally {
      setApplying(false);
    }
  };
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: event.summary,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('링크가 복사되었습니다!');
    }
  };
  
  return (
    <UserLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Image */}
        <div className="h-64 md:h-96 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg mb-6 relative overflow-hidden">
          {event.image_url && (
            <img 
              src={event.image_url} 
              alt={event.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          )}
        </div>
        
        {/* Event Header */}
        <div className="bg-white rounded-lg p-6 md:p-8 mb-6">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
            <div>
              <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm mb-2">
                {event.category}
              </span>
              <h1 className="text-2xl md:text-3xl mb-2">{event.title}</h1>
            </div>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">공유</span>
            </button>
          </div>
          
          {/* Key Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-gray-400 mt-1" />
              <div>
                <p className="text-sm text-gray-500">일정</p>
                <p className="font-medium">{event.date}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gray-400 mt-1" />
              <div>
                <p className="text-sm text-gray-500">장소</p>
                <p className="font-medium">{event.location}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Building2 className="w-5 h-5 text-gray-400 mt-1" />
              <div>
                <p className="text-sm text-gray-500">주최</p>
                <p className="font-medium">{event.organizer}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 text-gray-400 mt-1" />
              <div>
                <p className="text-sm text-gray-500">신청자</p>
                <p className="font-medium">{event.applications_count}명</p>
              </div>
            </div>
          </div>
          
          {/* AI Summary Section */}
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <h2 className="font-semibold text-blue-900">AI 자동 요약</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">{event.summary}</p>
          </div>
          
          {/* Participation Conditions */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
            <h3 className="font-semibold mb-2">참가 조건</h3>
            <p className="text-gray-700">{event.eligibility}</p>
          </div>
          
          {/* Detailed Description */}
          <div className="mb-6">
            <h2 className="text-xl mb-4">상세 설명</h2>
            <div className="prose max-w-none text-gray-700 whitespace-pre-line">
              {event.description}
            </div>
          </div>
          
          {/* CTA Section */}
          <div className="border-t border-gray-200 pt-6">
            {hasApplied ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-green-800 font-medium">이미 이 행사에 신청하셨습니다.</p>
                <Link to="/my-applications" className="text-green-700 hover:text-green-800 text-sm mt-2 inline-block">
                  내 신청 목록 보기 →
                </Link>
              </div>
            ) : event.status === 'open' ? (
              <div className="space-y-4">
                {/* Profile Quick Apply Section */}
                {user && hasProfile && (
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6 mb-4">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Zap className="w-5 h-5 text-blue-600" />
                          <h3 className="font-semibold text-blue-900">원클릭 신청</h3>
                        </div>
                        <p className="text-sm text-gray-700 mb-3">
                          등록된 프로필 정보로 바로 신청할 수 있습니다
                        </p>
                        <div className="bg-white rounded-lg p-4 border border-blue-100">
                          <div className="flex items-center gap-3">
                            <Building2 className="w-10 h-10 text-blue-600 bg-blue-100 rounded-lg p-2" />
                            <div className="flex-1">
                              <p className="font-medium">{brandProfile.brand_name}</p>
                              <p className="text-sm text-gray-600">{brandProfile.company_name}</p>
                            </div>
                            <Link 
                              to="/my-profile"
                              className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                            >
                              <Edit className="w-4 h-4" />
                              수정
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={handleQuickApply}
                      disabled={applying}
                      className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                    >
                      {applying ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Zap className="w-5 h-5" />
                      )}
                      <span className="text-lg">{applying ? '신청 중...' : '내 프로필로 신청하기'}</span>
                    </button>
                  </div>
                )}
                
                {/* No Profile - Guide to register */}
                {user && !hasProfile && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-4">
                    <div className="flex items-start gap-3 mb-4">
                      <Zap className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-yellow-900 mb-2">프로필을 등록하고 원클릭으로 신청하세요!</h3>
                        <p className="text-sm text-yellow-800 mb-3">
                          프로필을 한 번만 등록하면 이후 모든 행사에 클릭 한 번으로 간편하게 신청할 수 있습니다.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Link
                        to="/my-profile"
                        className="flex-1 px-4 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 text-center"
                      >
                        프로필 등록하고 신청하기
                      </Link>
                      <button
                        onClick={() => setShowApplyModal(true)}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        일반 신청하기
                      </button>
                    </div>
                  </div>
                )}

                {/* Not logged in */}
                {!user && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-4">
                    <p className="text-blue-900 mb-4">로그인하고 행사에 신청하세요!</p>
                    <div className="flex gap-3">
                      <Link
                        to="/login"
                        className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-center"
                      >
                        로그인
                      </Link>
                      <Link
                        to="/register"
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 text-center"
                      >
                        회원가입
                      </Link>
                    </div>
                  </div>
                )}
                
                {/* Regular Apply Button */}
                {user && hasProfile && (
                  <button
                    onClick={() => setShowApplyModal(true)}
                    className="w-full md:w-auto px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    <span>일반 신청하기</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                {event.status === 'closed' ? '신청이 마감되었습니다' : '곧 신청이 시작됩니다'}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl mb-4">신청 확인</h3>
            <p className="text-gray-600 mb-6">
              <strong>{event.title}</strong> 행사에 신청하시겠습니까?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowApplyModal(false)}
                disabled={applying}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                취소
              </button>
              <button
                onClick={handleApply}
                disabled={applying}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {applying && <Loader2 className="w-4 h-4 animate-spin" />}
                {applying ? '신청 중...' : '신청하기'}
              </button>
            </div>
          </div>
        </div>
      )}
    </UserLayout>
  );
}
