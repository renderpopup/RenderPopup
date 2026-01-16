import { useState, useEffect } from 'react';
import AdminLayout from '../layout/AdminLayout';
import { getAllCounterProposals, updateCounterProposalStatus } from '../../../lib/api/counterProposals';
import type { CounterProposal } from '../../../lib/database.types';
import { CheckCircle, XCircle, Clock, DollarSign, Calendar, Loader2, User, Tag } from 'lucide-react';

export default function AdminCounterProposals() {
  const [proposals, setProposals] = useState<CounterProposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchProposals = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllCounterProposals();
      setProposals(data);
    } catch (err: any) {
      console.error('Error fetching counter proposals:', err);
      setError('역제안 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProposals();
  }, []);

  const handleAccept = async (id: string) => {
    if (!confirm('이 역제안을 수락하시겠습니까?')) return;
    
    try {
      setUpdating(id);
      await updateCounterProposalStatus(id, 'accepted');
      // 목록 새로고침
      await fetchProposals();
      alert('역제안이 수락되었습니다.');
    } catch (err: any) {
      console.error('Error accepting proposal:', err);
      alert('역제안 수락에 실패했습니다.');
    } finally {
      setUpdating(null);
    }
  };
  
  const handleReject = async (id: string) => {
    if (!confirm('이 역제안을 거절하시겠습니까?')) return;
    
    try {
      setUpdating(id);
      await updateCounterProposalStatus(id, 'rejected');
      // 목록 새로고침
      await fetchProposals();
      alert('역제안이 거절되었습니다.');
    } catch (err: any) {
      console.error('Error rejecting proposal:', err);
      alert('역제안 거절에 실패했습니다.');
    } finally {
      setUpdating(null);
    }
  };
  
  const getStatusInfo = (status: string) => {
    const config = {
      pending: {
        icon: Clock,
        text: '검토 중',
        className: 'bg-yellow-100 text-yellow-800',
      },
      accepted: {
        icon: CheckCircle,
        text: '수락',
        className: 'bg-green-100 text-green-800',
      },
      rejected: {
        icon: XCircle,
        text: '거절',
        className: 'bg-red-100 text-red-800',
      },
    };
    return config[status as keyof typeof config] || config.pending;
  };
  
  return (
    <AdminLayout>
      <div>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl">역제안 관리</h1>
          <button
            onClick={fetchProposals}
            disabled={loading}
            className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
          >
            새로고침
          </button>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-3 text-gray-600">역제안을 불러오는 중...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}
        
        {!loading && !error && (
          <div className="space-y-4">
            {proposals.map(proposal => {
              const statusInfo = getStatusInfo(proposal.status);
              const StatusIcon = statusInfo.icon;
              const isUpdating = updating === proposal.id;
              
              return (
                <div key={proposal.id} className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3 flex-wrap">
                        <h3 className="text-lg font-medium">{proposal.brand_name}</h3>
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                          <Tag className="w-3 h-3" />
                          {proposal.category}
                        </span>
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm ${statusInfo.className}`}>
                          <StatusIcon className="w-4 h-4" />
                          {statusInfo.text}
                        </span>
                      </div>
                      
                      <p className="text-gray-700 mb-4">{proposal.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <DollarSign className="w-5 h-5" />
                          <div>
                            <p className="text-xs text-gray-500">예산</p>
                            <p className="text-sm font-medium">{proposal.budget}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="w-5 h-5" />
                          <div>
                            <p className="text-xs text-gray-500">희망 일정</p>
                            <p className="text-sm font-medium">{proposal.target_date}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <User className="w-5 h-5" />
                          <div>
                            <p className="text-xs text-gray-500">신청자 ID</p>
                            <p className="text-sm font-medium truncate max-w-[150px]">{proposal.user_id}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock className="w-5 h-5" />
                          <div>
                            <p className="text-xs text-gray-500">제출일</p>
                            <p className="text-sm font-medium">
                              {new Date(proposal.submitted_at).toLocaleDateString('ko-KR')}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col md:flex-row gap-3 pt-4 border-t border-gray-200">
                    <div className="flex-1 text-sm text-gray-600">
                      현재 {proposal.proposals_count || 0}개의 제안이 등록되어 있습니다
                    </div>
                    
                    {proposal.status === 'pending' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAccept(proposal.id)}
                          disabled={isUpdating}
                          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                        >
                          {isUpdating ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <CheckCircle className="w-4 h-4" />
                          )}
                          수락
                        </button>
                        <button
                          onClick={() => handleReject(proposal.id)}
                          disabled={isUpdating}
                          className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 disabled:opacity-50"
                        >
                          {isUpdating ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <XCircle className="w-4 h-4" />
                          )}
                          거절
                        </button>
                      </div>
                    )}
                    
                    {proposal.status === 'accepted' && (
                      <span className="px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm">
                        ✅ 수락 완료
                      </span>
                    )}
                    
                    {proposal.status === 'rejected' && (
                      <span className="px-4 py-2 bg-red-50 text-red-700 rounded-lg text-sm">
                        ❌ 거절됨
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
            
            {proposals.length === 0 && (
              <div className="bg-white rounded-lg p-12 text-center border border-gray-200">
                <p className="text-gray-500">등록된 역제안이 없습니다.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
