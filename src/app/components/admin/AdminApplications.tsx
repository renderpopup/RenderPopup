import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../layout/AdminLayout';
import { useAuth } from '../../../lib/contexts/AuthContext';
import { getAllApplications, updateApplicationStatus } from '../../../lib/api/applications';
import { CheckCircle, XCircle, Clock, Calendar, Loader2 } from 'lucide-react';

interface ApplicationWithEvent {
  id: string;
  event_id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  status: 'pending' | 'approved' | 'rejected';
  applied_at: string;
  events: {
    id: string;
    title: string;
    date: string;
  } | null;
}

export default function AdminApplications() {
  const navigate = useNavigate();
  const { user, isAdmin, loading: authLoading } = useAuth();
  
  const [applications, setApplications] = useState<ApplicationWithEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  // 권한 체크
  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate('/admin/login');
    }
  }, [user, isAdmin, authLoading, navigate]);

  // 신청 목록 로드
  useEffect(() => {
    const fetchApplications = async () => {
      if (!user || !isAdmin) return;

      try {
        setLoading(true);
        const data = await getAllApplications();
        setApplications(data as ApplicationWithEvent[]);
      } catch (err) {
        console.error('Error fetching applications:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [user, isAdmin]);

  const handleApprove = async (id: string) => {
    if (!confirm('이 신청을 승인하시겠습니까?')) return;
    
    setUpdating(id);
    try {
      await updateApplicationStatus(id, 'approved');
      setApplications(applications.map(app => 
        app.id === id ? { ...app, status: 'approved' } : app
      ));
      alert('신청이 승인되었습니다.');
    } catch (err: any) {
      console.error('Error approving application:', err);
      alert(err.message || '신청 승인 중 오류가 발생했습니다.');
    } finally {
      setUpdating(null);
    }
  };
  
  const handleReject = async (id: string) => {
    if (!confirm('이 신청을 거절하시겠습니까?')) return;
    
    setUpdating(id);
    try {
      await updateApplicationStatus(id, 'rejected');
      setApplications(applications.map(app => 
        app.id === id ? { ...app, status: 'rejected' } : app
      ));
      alert('신청이 거절되었습니다.');
    } catch (err: any) {
      console.error('Error rejecting application:', err);
      alert(err.message || '신청 거절 중 오류가 발생했습니다.');
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
      approved: {
        icon: CheckCircle,
        text: '승인',
        className: 'bg-green-100 text-green-800',
      },
      rejected: {
        icon: XCircle,
        text: '거절',
        className: 'bg-red-100 text-red-800',
      },
    };
    return config[status as keyof typeof config];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
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
      <div>
        <h1 className="text-3xl mb-8">신청 관리</h1>
        
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {applications.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">신청 내역이 없습니다.</p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm text-gray-600">행사명</th>
                      <th className="px-6 py-3 text-left text-sm text-gray-600">신청자</th>
                      <th className="px-6 py-3 text-left text-sm text-gray-600">이메일</th>
                      <th className="px-6 py-3 text-left text-sm text-gray-600">신청일</th>
                      <th className="px-6 py-3 text-left text-sm text-gray-600">상태</th>
                      <th className="px-6 py-3 text-right text-sm text-gray-600">관리</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map(app => {
                      const statusInfo = getStatusInfo(app.status);
                      const StatusIcon = statusInfo.icon;
                      
                      return (
                        <tr key={app.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <p className="font-medium">{app.events?.title || '행사명 없음'}</p>
                            {app.events?.date && (
                              <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                <Calendar className="w-4 h-4" />
                                <span>{app.events.date}</span>
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {app.user_name}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {app.user_email}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {formatDate(app.applied_at)}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm ${statusInfo.className}`}>
                              <StatusIcon className="w-4 h-4" />
                              {statusInfo.text}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {app.status === 'pending' && (
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => handleApprove(app.id)}
                                  disabled={updating === app.id}
                                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg disabled:opacity-50"
                                >
                                  {updating === app.id ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <CheckCircle className="w-4 h-4" />
                                  )}
                                </button>
                                <button
                                  onClick={() => handleReject(app.id)}
                                  disabled={updating === app.id}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50"
                                >
                                  <XCircle className="w-4 h-4" />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              
              {/* Mobile Cards */}
              <div className="md:hidden divide-y divide-gray-100">
                {applications.map(app => {
                  const statusInfo = getStatusInfo(app.status);
                  const StatusIcon = statusInfo.icon;
                  
                  return (
                    <div key={app.id} className="p-4">
                      <div className="mb-3">
                        <p className="font-medium mb-2">{app.events?.title || '행사명 없음'}</p>
                        <div className="space-y-1 text-sm text-gray-600 mb-2">
                          <p>{app.user_name}</p>
                          <p>{app.user_email}</p>
                          <p>{formatDate(app.applied_at)}</p>
                        </div>
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm ${statusInfo.className}`}>
                          <StatusIcon className="w-4 h-4" />
                          {statusInfo.text}
                        </span>
                      </div>
                      
                      {app.status === 'pending' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApprove(app.id)}
                            disabled={updating === app.id}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                          >
                            {updating === app.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <CheckCircle className="w-4 h-4" />
                            )}
                            승인
                          </button>
                          <button
                            onClick={() => handleReject(app.id)}
                            disabled={updating === app.id}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 disabled:opacity-50"
                          >
                            <XCircle className="w-4 h-4" />
                            거절
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
