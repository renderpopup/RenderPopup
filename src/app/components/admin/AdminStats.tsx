import AdminLayout from '../layout/AdminLayout';
import { mockEvents, mockApplications, mockCounterProposals } from '../../data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Calendar, MessageSquare } from 'lucide-react';

export default function AdminStats() {
  // 카테고리별 행사 수 데이터
  const categoryData = [
    { name: 'IT/기술', value: mockEvents.filter(e => e.category === 'IT/기술').length },
    { name: '비즈니스', value: mockEvents.filter(e => e.category === '비즈니스').length },
    { name: '디자인', value: mockEvents.filter(e => e.category === '디자인').length },
    { name: '마케팅', value: mockEvents.filter(e => e.category === '마케팅').length },
  ];
  
  // 월별 신청 수 데이터 (시뮬레이션)
  const monthlyData = [
    { month: '11월', applications: 45 },
    { month: '12월', applications: 78 },
    { month: '1월', applications: 102 },
  ];
  
  // 신청 상태별 데이터
  const statusData = [
    { name: '검토 중', value: mockApplications.filter(a => a.status === 'pending').length },
    { name: '승인', value: mockApplications.filter(a => a.status === 'approved').length },
    { name: '거절', value: mockApplications.filter(a => a.status === 'rejected').length },
  ];
  
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];
  
  const totalEvents = mockEvents.length;
  const totalApplications = mockApplications.length;
  const totalProposals = mockCounterProposals.length;
  const avgApplicationsPerEvent = Math.round(mockEvents.reduce((sum, e) => sum + e.applicationsCount, 0) / totalEvents);
  
  const kpiCards = [
    {
      title: '총 행사 수',
      value: totalEvents,
      icon: Calendar,
      color: 'blue',
      change: '+2 이번 달',
    },
    {
      title: '총 신청 수',
      value: totalApplications,
      icon: Users,
      color: 'green',
      change: '+15 이번 달',
    },
    {
      title: '역제안 수',
      value: totalProposals,
      icon: MessageSquare,
      color: 'purple',
      change: '+1 이번 달',
    },
    {
      title: '평균 신청자',
      value: avgApplicationsPerEvent,
      icon: TrendingUp,
      color: 'orange',
      change: '행사당',
    },
  ];
  
  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-600',
      green: 'bg-green-50 text-green-600',
      purple: 'bg-purple-50 text-purple-600',
      orange: 'bg-orange-50 text-orange-600',
    };
    return colors[color as keyof typeof colors];
  };
  
  return (
    <AdminLayout>
      <div>
        <h1 className="text-3xl mb-8">통계 대시보드</h1>
        
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {kpiCards.map((kpi) => {
            const Icon = kpi.icon;
            const colorClass = getColorClasses(kpi.color);
            
            return (
              <div key={kpi.title} className="bg-white rounded-lg p-6 border border-gray-200">
                <div className={`inline-flex p-3 rounded-lg mb-4 ${colorClass}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <p className="text-gray-600 text-sm mb-1">{kpi.title}</p>
                <p className="text-3xl mb-2">{kpi.value}</p>
                <p className="text-sm text-gray-500">{kpi.change}</p>
              </div>
            );
          })}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Monthly Applications Chart */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-xl mb-6">월별 신청 수</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="applications" name="신청 수" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          {/* Category Pie Chart */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-xl mb-6">카테고리별 행사 분포</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Status Distribution */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h2 className="text-xl mb-6">신청 상태 분포</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {statusData.map((status, index) => (
              <div key={status.name} className="p-6 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-600">{status.name}</p>
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: COLORS[index] }}
                  />
                </div>
                <p className="text-3xl">{status.value}</p>
                <p className="text-sm text-gray-500 mt-2">
                  {((status.value / totalApplications) * 100).toFixed(1)}%
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
