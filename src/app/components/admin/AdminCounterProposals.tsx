import AdminLayout from '../layout/AdminLayout';
import { mockCounterProposals } from '../../data/mockData';
import { CheckCircle, XCircle, Clock, DollarSign, Calendar } from 'lucide-react';

export default function AdminCounterProposals() {
  const handleAccept = (id: string) => {
    if (confirm('이 역제안을 수락하시겠습니까?')) {
      alert(`역제안 ${id} 수락됨`);
    }
  };
  
  const handleReject = (id: string) => {
    if (confirm('이 역제안을 거절하시겠습니까?')) {
      alert(`역제안 ${id} 거절됨`);
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
    return config[status as keyof typeof config];
  };
  
  return (
    <AdminLayout>
      <div>
        <h1 className="text-3xl mb-8">역제안 관리</h1>
        
        <div className="space-y-4">
          {mockCounterProposals.map(proposal => {
            const statusInfo = getStatusInfo(proposal.status);
            const StatusIcon = statusInfo.icon;
            
            return (
              <div key={proposal.id} className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg">{proposal.brandName}</h3>
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                        {proposal.category}
                      </span>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm ${statusInfo.className}`}>
                        <StatusIcon className="w-4 h-4" />
                        {statusInfo.text}
                      </span>
                    </div>
                    
                    <p className="text-gray-700 mb-4">{proposal.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <DollarSign className="w-5 h-5" />
                        <div>
                          <p className="text-xs text-gray-500">예산</p>
                          <p className="text-sm">{proposal.budget}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-5 h-5" />
                        <div>
                          <p className="text-xs text-gray-500">희망 일정</p>
                          <p className="text-sm">{proposal.targetDate}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <div>
                          <p className="text-xs text-gray-500">제출일</p>
                          <p className="text-sm">{proposal.submittedAt}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row gap-3 pt-4 border-t border-gray-200">
                  <div className="flex-1 text-sm text-gray-600">
                    현재 {proposal.proposals}개의 제안이 등록되어 있습니다
                  </div>
                  
                  {proposal.status === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAccept(proposal.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4" />
                        제안 보내기
                      </button>
                      <button
                        onClick={() => handleReject(proposal.id)}
                        className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
                      >
                        <XCircle className="w-4 h-4" />
                        거절
                      </button>
                    </div>
                  )}
                  
                  {proposal.status === 'accepted' && (
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      제안 관리하기
                    </button>
                  )}
                </div>
              </div>
            );
          })}
          
          {mockCounterProposals.length === 0 && (
            <div className="bg-white rounded-lg p-12 text-center border border-gray-200">
              <p className="text-gray-500">등록된 역제안이 없습니다.</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
