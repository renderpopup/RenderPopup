import AdminLayout from '../layout/AdminLayout';
import { mockApplications, mockEvents } from '../../data/mockData';
import { CheckCircle, XCircle, Clock, Calendar } from 'lucide-react';

export default function AdminApplications() {
  const handleApprove = (id: string) => {
    if (confirm('이 신청을 승인하시겠습니까?')) {
      alert(`신청 ${id} 승인됨`);
    }
  };
  
  const handleReject = (id: string) => {
    if (confirm('이 신청을 거절하시겠습니까?')) {
      alert(`신청 ${id} 거절됨`);
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
  
  return (
    <AdminLayout>
      <div>
        <h1 className="text-3xl mb-8">신청 관리</h1>
        
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
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
                {mockApplications.map(app => {
                  const statusInfo = getStatusInfo(app.status);
                  const StatusIcon = statusInfo.icon;
                  const event = mockEvents.find(e => e.id === app.eventId);
                  
                  return (
                    <tr key={app.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <p className="font-medium">{app.eventTitle}</p>
                        {event && (
                          <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                            <Calendar className="w-4 h-4" />
                            <span>{event.date}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {app.userName}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {app.userEmail}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {app.appliedAt}
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
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleReject(app.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
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
            {mockApplications.map(app => {
              const statusInfo = getStatusInfo(app.status);
              const StatusIcon = statusInfo.icon;
              
              return (
                <div key={app.id} className="p-4">
                  <div className="mb-3">
                    <p className="font-medium mb-2">{app.eventTitle}</p>
                    <div className="space-y-1 text-sm text-gray-600 mb-2">
                      <p>{app.userName}</p>
                      <p>{app.userEmail}</p>
                      <p>{app.appliedAt}</p>
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
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4" />
                        승인
                      </button>
                      <button
                        onClick={() => handleReject(app.id)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
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
        </div>
      </div>
    </AdminLayout>
  );
}
