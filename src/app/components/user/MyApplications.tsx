import { Link } from 'react-router-dom';
import UserLayout from '../layout/UserLayout';
import { mockApplications, mockEvents } from '../../data/mockData';
import { Calendar, MapPin, CheckCircle, Clock, XCircle } from 'lucide-react';

export default function MyApplications() {
  const getStatusInfo = (status: string) => {
    const config = {
      pending: {
        icon: Clock,
        text: '검토 중',
        className: 'bg-yellow-100 text-yellow-800',
        iconColor: 'text-yellow-600',
      },
      approved: {
        icon: CheckCircle,
        text: '승인됨',
        className: 'bg-green-100 text-green-800',
        iconColor: 'text-green-600',
      },
      rejected: {
        icon: XCircle,
        text: '거절됨',
        className: 'bg-red-100 text-red-800',
        iconColor: 'text-red-600',
      },
    };
    return config[status as keyof typeof config];
  };
  
  // 사용자의 신청 목록 (실제로는 로그인한 사용자의 데이터를 가져와야 함)
  const userApplications = mockApplications.slice(0, 3);
  
  return (
    <UserLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl mb-6">내 신청</h1>
        
        {userApplications.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center">
            <p className="text-gray-500 mb-6">아직 신청한 행사가 없습니다.</p>
            <Link
              to="/"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              행사 둘러보기
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {userApplications.map(application => {
              const event = mockEvents.find(e => e.id === application.eventId);
              if (!event) return null;
              
              const statusInfo = getStatusInfo(application.status);
              const StatusIcon = statusInfo.icon;
              
              return (
                <div key={application.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                          {event.category}
                        </span>
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm ${statusInfo.className}`}>
                          <StatusIcon className={`w-4 h-4 ${statusInfo.iconColor}`} />
                          {statusInfo.text}
                        </span>
                      </div>
                      
                      <h2 className="text-xl mb-3">
                        <Link to={`/events/${event.id}`} className="hover:text-blue-600">
                          {event.title}
                        </Link>
                      </h2>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm">{event.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm">{event.location}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-sm text-gray-500">
                        신청일: {application.appliedAt}
                      </span>
                      <Link
                        to={`/events/${event.id}`}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                      >
                        상세보기
                      </Link>
                    </div>
                  </div>
                  
                  {application.status === 'approved' && (
                    <div className="bg-green-50 border border-green-100 rounded-lg p-4 mt-4">
                      <p className="text-sm text-green-900">
                        ✅ 신청이 승인되었습니다! 행사 당일 참석 안내 이메일을 확인해주세요.
                      </p>
                    </div>
                  )}
                  
                  {application.status === 'pending' && (
                    <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 mt-4">
                      <p className="text-sm text-yellow-900">
                        ⏳ 주최측에서 신청을 검토 중입니다. 곧 결과를 알려드립니다.
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </UserLayout>
  );
}
