import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Calendar, Users, MessageSquare, BarChart3, LogOut } from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();
  
  const navItems = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: '대시보드' },
    { path: '/admin/events', icon: Calendar, label: '행사 관리' },
    { path: '/admin/applications', icon: Users, label: '신청 관리' },
    { path: '/admin/counter-proposals', icon: MessageSquare, label: '역제안 관리' },
    { path: '/admin/stats', icon: BarChart3, label: '통계' },
  ];
  
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden lg:block fixed h-full">
        <div className="p-6">
          <h1 className="font-bold text-xl text-gray-800">관리자 페이지</h1>
        </div>
        
        <nav className="px-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || 
                           (item.path === '/admin/events' && location.pathname.startsWith('/admin/events'));
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        
        <div className="absolute bottom-0 w-64 p-4">
          <Link
            to="/admin/login"
            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg w-full"
          >
            <LogOut className="w-5 h-5" />
            <span>로그아웃</span>
          </Link>
        </div>
      </aside>
      
      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white border-b border-gray-200 p-4">
          <h1 className="font-bold text-xl text-gray-800">관리자 페이지</h1>
        </header>
        
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
      
      {/* Mobile Bottom Nav */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex justify-around">
          {navItems.slice(0, 4).map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || 
                           (item.path === '/admin/events' && location.pathname.startsWith('/admin/events'));
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center py-2 px-3 ${
                  isActive ? 'text-blue-600' : 'text-gray-600'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs mt-1">{item.label.split(' ')[0]}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
