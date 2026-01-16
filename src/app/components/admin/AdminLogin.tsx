import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Loader2, AlertCircle } from 'lucide-react';
import { supabase, signInWithGoogle } from '../../../lib/supabase';
import { useAuth } from '../../../lib/contexts/AuthContext';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 이미 로그인한 관리자라면 대시보드로 리다이렉트
  useEffect(() => {
    if (!authLoading && user && isAdmin) {
      navigate('/admin/dashboard');
    }
  }, [user, isAdmin, authLoading, navigate]);

  // 로그인은 되어있지만 관리자가 아닌 경우
  useEffect(() => {
    if (!authLoading && user && !isAdmin) {
      setError('관리자 권한이 없습니다. 관리자 계정으로 로그인해주세요.');
    }
  }, [user, isAdmin, authLoading]);
  
  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);

    try {
      await signInWithGoogle();
      // OAuth 리다이렉트 후 콜백에서 처리됨
    } catch (err: any) {
      console.error('Google login error:', err);
      setError(err.message || 'Google 로그인에 실패했습니다.');
      setLoading(false);
    }
  };

  const handleLogoutAndRetry = async () => {
    await supabase.auth.signOut();
    setError(null);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-semibold mb-2">관리자 로그인</h1>
          <p className="text-gray-600">행사요약 관리자 페이지</p>
        </div>
        
        {/* Login Form */}
        <div className="bg-white rounded-lg p-8 shadow-sm">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-700 text-sm">{error}</p>
                  {user && !isAdmin && (
                    <button
                      onClick={handleLogoutAndRetry}
                      className="mt-2 text-sm text-red-600 hover:text-red-700 underline"
                    >
                      다른 계정으로 로그인
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {authLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <span className="ml-3 text-gray-600">로딩 중...</span>
            </div>
          ) : user && isAdmin ? (
            <div className="text-center py-4">
              <p className="text-green-600 mb-4">✅ 관리자로 로그인되었습니다!</p>
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                대시보드로 이동
              </button>
            </div>
          ) : (
            <>
              {/* Google Login Button */}
              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 mb-4"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                )}
                <span>{loading ? '로그인 중...' : 'Google 계정으로 로그인'}</span>
              </button>

              <div className="text-center text-sm text-gray-500">
                관리자 권한이 있는 Google 계정으로 로그인하세요
              </div>
            </>
          )}
          
          <div className="mt-6 text-center">
            <Link to="/" className="text-sm text-gray-500 hover:text-gray-700">
              ← 사용자 페이지로 돌아가기
            </Link>
          </div>

          {/* Admin Info Box */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
            <p className="text-xs text-blue-800 text-center">
              💡 관리자 권한은 Supabase에서 설정합니다.
              <br />
              profiles 테이블에서 role을 'admin'으로 변경하세요.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
