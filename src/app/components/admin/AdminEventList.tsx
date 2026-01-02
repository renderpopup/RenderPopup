import { Link } from 'react-router-dom';
import AdminLayout from '../layout/AdminLayout';
import { mockEvents } from '../../data/mockData';
import { Plus, Edit, Trash2, Users, Calendar } from 'lucide-react';

export default function AdminEventList() {
  const handleDelete = (id: string) => {
    if (confirm('이 행사를 삭제하시겠습니까?')) {
      alert(`행사 ${id} 삭제됨`);
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
                {mockEvents.map(event => (
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
                        <span className="text-sm">{event.applicationsCount}</span>
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
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
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
            {mockEvents.map(event => (
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
                        <span>{event.applicationsCount}</span>
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
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                    삭제
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
