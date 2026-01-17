import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, ArrowRight } from 'lucide-react';
import { useAuth } from '../../../lib/contexts/AuthContext';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { user, isAdmin, loading } = useAuth();

  // 이미 로그인한 관리자라면 대시보드로 리다이렉트
  useEffect(() => {
    if (!loading && user && isAdmin) {
      navigate('/admin/dashboard');
    }
  }, [user, isAdmin, loading, navigate]);

  // 로그인은 되어있지만 관리자가 아닌 경우
  if (!loading && user && !isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <Shield className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-semibold mb-2">관리자 권한 없음</h1>
          <p className="text-gray-600 mb-6">
            현재 로그인된 계정은 관리자 권한이 없습니다.
          </p>
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            메인 페이지로 이동
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-semibold mb-2">관리자 페이지</h1>
          <p className="text-gray-600">행사요약 관리자 페이지</p>
        </div>
        
        {/* Login Form */}
        <div className="bg-white rounded-lg p-8 shadow-sm">
          <div className="text-center mb-6">
            <p className="text-gray-700 mb-4">
              관리자 기능을 사용하려면 먼저 로그인해주세요.
            </p>
            <p className="text-sm text-gray-500">
              로그인 후 관리자 계정이면 상단에 <strong>"관리자"</strong> 버튼이 표시됩니다.
            </p>
          </div>

          <Link
            to="/login"
            className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            로그인 페이지로 이동
            <ArrowRight className="w-4 h-4" />
          </Link>
          
          <div className="mt-6 text-center">
            <Link to="/" className="text-sm text-gray-500 hover:text-gray-700">
              ← 메인 페이지로 돌아가기
            </Link>
          </div>

          {/* Admin Info Box */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
            <p className="text-xs text-blue-800 text-center">
              💡 관리자 권한은 Supabase profiles 테이블에서
              <br />
              role을 'admin'으로 설정하면 부여됩니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
