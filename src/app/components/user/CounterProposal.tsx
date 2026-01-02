import { useState } from 'react';
import UserLayout from '../layout/UserLayout';
import { mockCounterProposals } from '../../data/mockData';
import { MessageSquare, Calendar, DollarSign, Tag, Send, CheckCircle, Clock } from 'lucide-react';

export default function CounterProposal() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    brandName: '',
    description: '',
    budget: '',
    targetDate: '',
    category: 'IT/기술',
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('역제안이 등록되었습니다!');
    setShowForm(false);
    setFormData({
      brandName: '',
      description: '',
      budget: '',
      targetDate: '',
      category: 'IT/기술',
    });
  };
  
  const getStatusBadge = (status: string) => {
    const config = {
      pending: { icon: Clock, text: '검토 중', className: 'bg-yellow-100 text-yellow-800' },
      accepted: { icon: CheckCircle, text: '수락됨', className: 'bg-green-100 text-green-800' },
      rejected: { icon: MessageSquare, text: '거절됨', className: 'bg-red-100 text-red-800' },
    };
    const info = config[status as keyof typeof config];
    const Icon = info.icon;
    
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm ${info.className}`}>
        <Icon className="w-4 h-4" />
        {info.text}
      </span>
    );
  };
  
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
                      <option>IT/기술</option>
                      <option>비즈니스</option>
                      <option>디자인</option>
                      <option>마케팅</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm mb-2 text-gray-700">예산</label>
                    <input
                      type="text"
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      placeholder="예: 1000만원"
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
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      취소
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      등록
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
          
          {/* Proposals List */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl mb-4">내 역제안 목록</h2>
            
            {mockCounterProposals.slice(0, 2).map(proposal => (
              <div key={proposal.id} className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg mb-2">{proposal.brandName}</h3>
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
                    <span className="text-sm">{proposal.targetDate}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MessageSquare className="w-4 h-4" />
                    <span className="text-sm">{proposal.proposals}개 제안</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <span className="text-sm text-gray-500">등록일: {proposal.submittedAt}</span>
                  {proposal.proposals > 0 && (
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                      제안 확인하기
                    </button>
                  )}
                </div>
              </div>
            ))}
            
            {mockCounterProposals.length === 0 && (
              <div className="bg-white rounded-lg p-12 text-center border border-gray-200">
                <p className="text-gray-500">등록된 역제안이 없습니다.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
