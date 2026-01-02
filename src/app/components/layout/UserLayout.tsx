import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CalendarDays, LogIn, User, LogOut, Loader2 } from 'lucide-react';
import { useAuth } from '../../../lib/contexts/AuthContext';
import { signOut } from '../../../lib/api';
import { useState } from 'react';

interface UserLayoutProps {
  children: React.ReactNode;
}

export default function UserLayout({ children }: UserLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, loading } = useAuth();
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
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <CalendarDays className="w-8 h-8 text-blue-600" />
              <span className="font-semibold text-lg md:text-xl">행사요약</span>
            </Link>
            
            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <Link 
                to="/" 
                className={`${location.pathname === '/' ? 'text-blue-600' : 'text-gray-600'} hover:text-blue-600`}
              >
                행사 리스트
              </Link>
              <Link 
                to="/counter-proposal" 
                className={`${location.pathname === '/counter-proposal' ? 'text-blue-600' : 'text-gray-600'} hover:text-blue-600`}
              >
                역제안
              </Link>
              {user && (
                <>
                  <Link 
                    to="/my-applications" 
                    className={`${location.pathname === '/my-applications' ? 'text-blue-600' : 'text-gray-600'} hover:text-blue-600`}
                  >
                    내 신청
                  </Link>
                  <Link 
                    to="/my-profile" 
                    className={`${location.pathname === '/my-profile' ? 'text-blue-600' : 'text-gray-600'} hover:text-blue-600`}
                  >
                    내 프로필
                  </Link>
                </>
              )}
            </nav>
            
            {/* Auth Buttons */}
            <div className="flex items-center gap-2">
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
              ) : user ? (
                <div className="flex items-center gap-3">
                  <span className="hidden sm:inline text-sm text-gray-600">
                    {profile?.name || user.email}
                  </span>
                  <button
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-red-600 disabled:opacity-50"
                  >
                    {loggingOut ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <LogOut className="w-4 h-4" />
                    )}
                    <span className="hidden sm:inline">로그아웃</span>
                  </button>
                </div>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-blue-600"
                  >
                    <LogIn className="w-4 h-4" />
                    <span className="hidden sm:inline">로그인</span>
                  </Link>
                  <Link 
                    to="/register" 
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline">회원가입</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="flex justify-around py-2">
            <Link 
              to="/" 
              className={`flex-1 text-center py-2 ${location.pathname === '/' ? 'text-blue-600' : 'text-gray-600'}`}
            >
              행사 리스트
            </Link>
            <Link 
              to="/counter-proposal" 
              className={`flex-1 text-center py-2 ${location.pathname === '/counter-proposal' ? 'text-blue-600' : 'text-gray-600'}`}
            >
              역제안
            </Link>
            {user && (
              <Link 
                to="/my-applications" 
                className={`flex-1 text-center py-2 ${location.pathname === '/my-applications' ? 'text-blue-600' : 'text-gray-600'}`}
              >
                내 신청
              </Link>
            )}
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main>{children}</main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-500">
            © 2025 AI 기반 행사 요약 & 간편 신청 플랫폼. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
