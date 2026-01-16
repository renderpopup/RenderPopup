import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AdminLayout from '../layout/AdminLayout';
import { useAuth } from '../../../lib/contexts/AuthContext';
import { getEvents, deleteEvent } from '../../../lib/api/events';
import type { Event } from '../../../lib/database.types';
import { Plus, Edit, Trash2, Users, Calendar, Loader2 } from 'lucide-react';

export default function AdminEventList() {
  const navigate = useNavigate();
  const { user, isAdmin, loading: authLoading } = useAuth();
  
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  // 권한 체크
  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate('/admin/login');
    }
  }, [user, isAdmin, authLoading, navigate]);

  // 행사 목록 로드
  useEffect(() => {
    const fetchEvents = async () => {
      if (!user || !isAdmin) return;

      try {
        setLoading(true);
        const data = await getEvents({});
        setEvents(data);
      } catch (err) {
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [user, isAdmin]);

  const handleDelete = async (id: string) => {
    if (!confirm('이 행사를 삭제하시겠습니까?')) return;
    
    setDeleting(id);
    try {
      await deleteEvent(id);
      setEvents(events.filter(e => e.id !== id));
      alert('행사가 삭제되었습니다.');
    } catch (err: any) {
      console.error('Error deleting event:', err);
      alert(err.message || '행사 삭제 중 오류가 발생했습니다.');
    } finally {
      setDeleting(null);
    }
  };
  
  const getStatusBadge = (status: string) => {
    const styles = {
      open: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800',
      upcoming: 'bg-blue-100 text-blue-800',
    };
    const labels = {
      open: '진행중',
      closed: '마감',
      upcoming: '예정',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-sm ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
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
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl">행사 관리</h1>
          <Link
            to="/admin/events/new"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" />
            행사 등록
          </Link>
        </div>
        
        {/* Events Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {events.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">등록된 행사가 없습니다.</p>
              <Link
                to="/admin/events/new"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-5 h-5" />
                첫 행사 등록하기
              </Link>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm text-gray-600">행사명</th>
                      <th className="px-6 py-3 text-left text-sm text-gray-600">카테고리</th>
                      <th className="px-6 py-3 text-left text-sm text-gray-600">일정</th>
                      <th className="px-6 py-3 text-left text-sm text-gray-600">상태</th>
                      <th className="px-6 py-3 text-left text-sm text-gray-600">신청자</th>
                      <th className="px-6 py-3 text-right text-sm text-gray-600">관리</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.map(event => (
                      <tr key={event.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <p className="font-medium">{event.title}</p>
                          <p className="text-sm text-gray-500">{event.organizer}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                            {event.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {event.date}
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(event.status)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Users className="w-4 h-4" />
                            <span className="text-sm">{event.applications_count}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              to={`/admin/events/${event.id}/edit`}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                            >
                              <Edit className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => handleDelete(event.id)}
                              disabled={deleting === event.id}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50"
                            >
                              {deleting === event.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Mobile Cards */}
              <div className="md:hidden divide-y divide-gray-100">
                {events.map(event => (
                  <div key={event.id} className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <p className="font-medium mb-1">{event.title}</p>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                            {event.category}
                          </span>
                          {getStatusBadge(event.status)}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{event.date}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{event.applications_count}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        to={`/admin/events/${event.id}/edit`}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        <Edit className="w-4 h-4" />
                        수정
                      </Link>
                      <button
                        onClick={() => handleDelete(event.id)}
                        disabled={deleting === event.id}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 disabled:opacity-50"
                      >
                        {deleting === event.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                        삭제
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
