import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../layout/AdminLayout';
import { useAuth } from '../../../lib/contexts/AuthContext';
import { getEvents, getEventStats } from '../../../lib/api/events';
import { getAllApplications, getApplicationStats } from '../../../lib/api/applications';
import { getCounterProposalStats } from '../../../lib/api/counterProposals';
import type { Event } from '../../../lib/database.types';
import { Calendar, Users, MessageSquare, TrendingUp, ArrowUpRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

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
  } | null;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, isAdmin, loading: authLoading } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);
  const [applications, setApplications] = useState<ApplicationWithEvent[]>([]);
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalApplications: 0,
    totalProposals: 0,
    pendingApplications: 0,
    pendingProposals: 0,
  });

  // 권한 체크
  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate('/admin/login');
    }
  }, [user, isAdmin, authLoading, navigate]);

  // 데이터 로딩
  useEffect(() => {
    const fetchData = async () => {
      if (!user || !isAdmin) return;

      try {
        setLoading(true);
        
        // 병렬로 데이터 로딩
        const [eventsData, appsData, eventStats, appStats, proposalStats] = await Promise.all([
          getEvents({ }),
          getAllApplications(),
          getEventStats(),
          getApplicationStats(),
          getCounterProposalStats(),
        ]);

        setEvents(eventsData);
        setApplications(appsData as ApplicationWithEvent[]);
        setStats({
          totalEvents: eventStats.totalEvents,
          totalApplications: appStats.total,
          totalProposals: proposalStats.total,
          pendingApplications: appStats.pending,
          pendingProposals: proposalStats.pending,
        });
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, isAdmin]);

  const statsCards = [
    {
      title: '등록된 행사',
      value: stats.totalEvents,
      change: `+${stats.totalEvents}`,
      icon: Calendar,
      color: 'blue',
      link: '/admin/events',
    },
    {
      title: '총 신청 수',
      value: stats.totalApplications,
      change: `${stats.pendingApplications} 대기중`,
      icon: Users,
      color: 'green',
      link: '/admin/applications',
    },
    {
      title: '역제안 등록',
      value: stats.totalProposals,
      change: `${stats.pendingProposals} 대기중`,
      icon: MessageSquare,
      color: 'purple',
      link: '/admin/counter-proposals',
    },
  ];
  
  const getColorClasses = (color: string) => {
    const colors = {
      blue: {
        bg: 'bg-blue-50',
        icon: 'bg-blue-600',
        text: 'text-blue-600',
      },
      green: {
        bg: 'bg-green-50',
        icon: 'bg-green-600',
        text: 'text-green-600',
      },
      purple: {
        bg: 'bg-purple-50',
        icon: 'bg-purple-600',
        text: 'text-purple-600',
      },
    };
    return colors[color as keyof typeof colors];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
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

  const recentEvents = events.slice(0, 5);
  const recentApplications = applications.slice(0, 5);
  
  return (
    <AdminLayout>
      <div>
        <h1 className="text-3xl mb-8">대시보드</h1>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {statsCards.map((stat) => {
            const Icon = stat.icon;
            const colors = getColorClasses(stat.color);
            
            return (
              <Link
                key={stat.title}
                to={stat.link}
                className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${colors.bg}`}>
                    <Icon className={`w-6 h-6 text-white ${colors.icon}`} />
                  </div>
                  <div className="flex items-center gap-1 text-green-600">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm">{stat.change}</span>
                  </div>
                </div>
                <div>
                  <p className="text-gray-600 text-sm mb-1">{stat.title}</p>
                  <p className="text-3xl">{stat.value}</p>
                </div>
              </Link>
            );
          })}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Events */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl">최근 등록된 행사</h2>
              <Link to="/admin/events" className="text-blue-600 text-sm hover:text-blue-700 flex items-center gap-1">
                전체 보기
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-3">
              {recentEvents.length === 0 ? (
                <p className="text-gray-500 text-center py-4">등록된 행사가 없습니다.</p>
              ) : (
                recentEvents.map(event => (
                  <div key={event.id} className="flex items-start justify-between py-3 border-b border-gray-100 last:border-0">
                    <div className="flex-1">
                      <p className="font-medium mb-1">{event.title}</p>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <span>{event.date}</span>
                        <span>•</span>
                        <span>{event.applications_count}명 신청</span>
                      </div>
                    </div>
                    <Link
                      to={`/admin/events/${event.id}/edit`}
                      className="text-blue-600 text-sm hover:text-blue-700"
                    >
                      수정
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>
          
          {/* Recent Applications */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl">최근 신청 내역</h2>
              <Link to="/admin/applications" className="text-blue-600 text-sm hover:text-blue-700 flex items-center gap-1">
                전체 보기
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-3">
              {recentApplications.length === 0 ? (
                <p className="text-gray-500 text-center py-4">신청 내역이 없습니다.</p>
              ) : (
                recentApplications.map(app => {
                  const statusColors = {
                    pending: 'bg-yellow-100 text-yellow-800',
                    approved: 'bg-green-100 text-green-800',
                    rejected: 'bg-red-100 text-red-800',
                  };
                  const statusLabels = {
                    pending: '검토 중',
                    approved: '승인',
                    rejected: '거절',
                  };
                  
                  return (
                    <div key={app.id} className="flex items-start justify-between py-3 border-b border-gray-100 last:border-0">
                      <div className="flex-1">
                        <p className="font-medium mb-1">{app.events?.title || '행사명 없음'}</p>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <span>{app.user_name}</span>
                          <span>•</span>
                          <span>{formatDate(app.applied_at)}</span>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs ${statusColors[app.status]}`}>
                        {statusLabels[app.status]}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
