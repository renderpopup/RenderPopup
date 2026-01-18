import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Calendar, Users, MessageSquare, BarChart3, LogOut, Home, Loader2 } from 'lucide-react';
import { useAuth } from '../../../lib/contexts/AuthContext';
import { signOut } from '../../../lib/api';
import { useState } from 'react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoggingOut(false);
    }
  };
  
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
          <Link to="/" className="block">
            <span className="text-2xl tracking-tight text-gray-900" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
              RenderPopup
            </span>
          </Link>
          <div className="flex items-center gap-2 mt-2">
            <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded">Admin</span>
            {profile && (
              <span className="text-sm text-gray-500">{profile.name || profile.email}</span>
            )}
          </div>
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
        
        <div className="absolute bottom-0 w-64 p-4 space-y-2">
          {/* 사용자 페이지로 전환 버튼 */}
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg w-full"
          >
            <Home className="w-5 h-5" />
            <span>사용자 페이지</span>
          </Link>
          
          {/* 로그아웃 버튼 */}
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg w-full disabled:opacity-50"
          >
            {loggingOut ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <LogOut className="w-5 h-5" />
            )}
            <span>{loggingOut ? '로그아웃 중...' : '로그아웃'}</span>
          </button>
        </div>
      </aside>
      
      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-xl tracking-tight text-gray-900" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
              RenderPopup
            </span>
            <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded">Admin</span>
          </div>
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-2 bg-green-50 text-green-700 rounded-lg text-sm"
          >
            <Home className="w-4 h-4" />
            <span>사용자</span>
          </Link>
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
