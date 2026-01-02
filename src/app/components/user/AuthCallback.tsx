import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the session from the URL hash
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Auth callback error:', error);
          setError(error.message);
          setStatus('error');
          return;
        }

        if (data.session) {
          setStatus('success');
          // Redirect to home after a short delay
          setTimeout(() => {
            navigate('/', { replace: true });
          }, 1500);
        } else {
          // No session found, might be a verification link or error
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          const errorDescription = hashParams.get('error_description');
          
          if (errorDescription) {
            setError(errorDescription);
            setStatus('error');
          } else {
            // Try to exchange the code for a session
            const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(
              window.location.href
            );

            if (exchangeError) {
              setError(exchangeError.message);
              setStatus('error');
            } else {
              setStatus('success');
              setTimeout(() => {
                navigate('/', { replace: true });
              }, 1500);
            }
          }
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('인증 처리 중 오류가 발생했습니다.');
        setStatus('error');
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-lg p-8 shadow-sm">
          {status === 'loading' && (
            <>
              <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">로그인 처리 중...</h2>
              <p className="text-gray-600">잠시만 기다려주세요.</p>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">로그인 성공!</h2>
              <p className="text-gray-600">메인 페이지로 이동합니다...</p>
            </>
          )}

          {status === 'error' && (
            <>
              <XCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">로그인 실패</h2>
              <p className="text-gray-600 mb-4">{error || '인증에 실패했습니다.'}</p>
              <button
                onClick={() => navigate('/login')}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                로그인 페이지로 돌아가기
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

