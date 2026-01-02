import { useLocation, Link } from 'react-router-dom';
import UserLayout from '../layout/UserLayout';
import { CheckCircle, Calendar, ArrowRight, Zap, Building2 } from 'lucide-react';

export default function ApplicationComplete() {
  const location = useLocation();
  const event = location.state?.event;
  const profile = location.state?.profile; // 프로필 정보가 있는 경우
  
  return (
    <UserLayout>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg p-8 md:p-12 text-center">
          {/* Success Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          
          {/* Success Message */}
          <h1 className="text-2xl md:text-3xl mb-4">신청이 완료되었습니다!</h1>
          <p className="text-gray-600 mb-8">
            신청하신 행사 정보를 확인해주세요.
          </p>
          
          {/* Profile Quick Apply Notification */}
          {profile && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-blue-600" />
                <p className="font-semibold text-blue-900">원클릭 신청으로 완료되었습니다</p>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-700">
                <Building2 className="w-4 h-4" />
                <span>{profile.brandName}의 프로필 정보로 자동 신청됨</span>
              </div>
            </div>
          )}
          
          {/* Event Info */}
          {event && (
            <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
              <h2 className="text-lg mb-4">{event.title}</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-600">
                  <Calendar className="w-5 h-5" />
                  <span>{event.date}</span>
                </div>
                <div className="text-gray-600">
                  <p>장소: {event.location}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-8 text-left">
            <p className="text-sm text-blue-900">
              💌 신청 확인 이메일이 발송되었습니다.<br />
              행사 안내는 이메일을 통해 전달될 예정입니다.
            </p>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/my-applications"
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <span>내 신청 보기</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/"
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <span>행사 더 찾아보기</span>
            </Link>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}