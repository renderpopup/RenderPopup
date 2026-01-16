import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserLayout from '../layout/UserLayout';
import { useAuth } from '../../../lib/contexts/AuthContext';
import { createBrandProfile, updateBrandProfile } from '../../../lib/api/brandProfiles';
import { Building2, Mail, Phone, Globe, MapPin, FileText, Image, Save, Edit, Loader2 } from 'lucide-react';

export default function MyProfile() {
  const navigate = useNavigate();
  const { user, brandProfile, refreshBrandProfile } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const hasProfile = !!brandProfile;
  
  const [isEditing, setIsEditing] = useState(!hasProfile);
  const [formData, setFormData] = useState({
    brandName: '',
    companyName: '',
    businessNumber: '',
    representativeName: '',
    email: '',
    phone: '',
    website: '',
    description: '',
    industry: '플리마켓',
    address: '',
  });

  // 프로필 데이터 로드
  useEffect(() => {
    if (brandProfile) {
      setFormData({
        brandName: brandProfile.brand_name || '',
        companyName: brandProfile.company_name || '',
        businessNumber: brandProfile.business_number || '',
        representativeName: brandProfile.representative_name || '',
        email: brandProfile.email || '',
        phone: brandProfile.phone || '',
        website: brandProfile.website || '',
        description: brandProfile.description || '',
        industry: brandProfile.industry || '플리마켓',
        address: brandProfile.address || '',
      });
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  }, [brandProfile]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    setSaving(true);
    try {
      const profileData = {
        user_id: user.id,
        brand_name: formData.brandName,
        company_name: formData.companyName,
        business_number: formData.businessNumber,
        representative_name: formData.representativeName,
        email: formData.email,
        phone: formData.phone,
        website: formData.website || null,
        description: formData.description,
        industry: formData.industry,
        address: formData.address,
      };

      if (hasProfile) {
        await updateBrandProfile(user.id, profileData);
      } else {
        await createBrandProfile(profileData);
      }
      
      // 프로필 데이터 새로고침
      await refreshBrandProfile();
      
      alert(hasProfile ? '프로필이 수정되었습니다!' : '프로필이 등록되었습니다!');
      setIsEditing(false);
    } catch (err: any) {
      console.error('Profile save error:', err);
      alert(err.message || '프로필 저장 중 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  };
  
  const handleCancel = () => {
    if (hasProfile && brandProfile) {
      setIsEditing(false);
      // 원래 데이터로 복원
      setFormData({
        brandName: brandProfile.brand_name || '',
        companyName: brandProfile.company_name || '',
        businessNumber: brandProfile.business_number || '',
        representativeName: brandProfile.representative_name || '',
        email: brandProfile.email || '',
        phone: brandProfile.phone || '',
        website: brandProfile.website || '',
        description: brandProfile.description || '',
        industry: brandProfile.industry || '플리마켓',
        address: brandProfile.address || '',
      });
    } else {
      navigate('/');
    }
  };

  // 로그인 체크
  if (!user) {
    return (
      <UserLayout>
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <p className="text-gray-600 mb-4">로그인이 필요합니다.</p>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            로그인하기
          </button>
        </div>
      </UserLayout>
    );
  }
  
  return (
    <UserLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl mb-2">내 프로필</h1>
            <p className="text-gray-600">
              {hasProfile 
                ? '등록된 프로필 정보로 모든 행사에 원클릭 신청이 가능합니다' 
                : '프로필을 등록하고 원클릭으로 행사에 신청하세요'}
            </p>
          </div>
          {hasProfile && !isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Edit className="w-4 h-4" />
              수정
            </button>
          )}
        </div>
        
        {/* Info Banner */}
        {!hasProfile && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-900">
              💡 프로필을 한 번만 등록하면 이후 모든 행사에 클릭 한 번으로 간편하게 신청할 수 있습니다.
            </p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6 md:p-8">
          <div className="space-y-6">
            {/* Brand Name */}
            <div>
              <label className="block text-sm mb-2">
                브랜드명 <span className="text-red-500">*</span>
              </label>
              {isEditing ? (
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={formData.brandName}
                    onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                    placeholder="브랜드 이름을 입력하세요"
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-lg">
                  <Building2 className="w-5 h-5 text-gray-400" />
                  <span>{formData.brandName}</span>
                </div>
              )}
            </div>
            
            {/* Company Name */}
            <div>
              <label className="block text-sm mb-2">
                회사명 <span className="text-red-500">*</span>
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  placeholder="회사명을 입력하세요"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <div className="px-4 py-3 bg-gray-50 rounded-lg">
                  {formData.companyName}
                </div>
              )}
            </div>
            
            {/* Business Number & Representative */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-2">
                  사업자등록번호 <span className="text-red-500">*</span>
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.businessNumber}
                    onChange={(e) => setFormData({ ...formData, businessNumber: e.target.value })}
                    placeholder="123-45-67890"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <div className="px-4 py-3 bg-gray-50 rounded-lg">
                    {formData.businessNumber}
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm mb-2">
                  대표자명 <span className="text-red-500">*</span>
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.representativeName}
                    onChange={(e) => setFormData({ ...formData, representativeName: e.target.value })}
                    placeholder="대표자 이름"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <div className="px-4 py-3 bg-gray-50 rounded-lg">
                    {formData.representativeName}
                  </div>
                )}
              </div>
            </div>
            
            {/* Email & Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-2">
                  이메일 <span className="text-red-500">*</span>
                </label>
                {isEditing ? (
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="example@email.com"
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-lg">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <span>{formData.email}</span>
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm mb-2">
                  연락처 <span className="text-red-500">*</span>
                </label>
                {isEditing ? (
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="010-1234-5678"
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-lg">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <span>{formData.phone}</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Industry & Website */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-2">
                  업종 <span className="text-red-500">*</span>
                </label>
                {isEditing ? (
                  <select
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option>플리마켓</option>
                    <option>박람회</option>
                    <option>팝업스토어</option>
                    <option>패션/뷰티</option>
                    <option>푸드/F&B</option>
                    <option>핸드메이드</option>
                    <option>기타</option>
                  </select>
                ) : (
                  <div className="px-4 py-3 bg-gray-50 rounded-lg">
                    {formData.industry}
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm mb-2">
                  웹사이트
                </label>
                {isEditing ? (
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      placeholder="https://example.com"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-lg">
                    <Globe className="w-5 h-5 text-gray-400" />
                    <span>{formData.website || '-'}</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Address */}
            <div>
              <label className="block text-sm mb-2">
                주소 <span className="text-red-500">*</span>
              </label>
              {isEditing ? (
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="서울 강남구 테크노밸리 123"
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-lg">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <span>{formData.address}</span>
                </div>
              )}
            </div>
            
            {/* Description */}
            <div>
              <label className="block text-sm mb-2">
                소개 <span className="text-red-500">*</span>
              </label>
              {isEditing ? (
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="브랜드 및 제품/서비스 소개"
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <div className="px-4 py-3 bg-gray-50 rounded-lg">
                  {formData.description}
                </div>
              )}
            </div>
            
            {/* File Uploads */}
            {isEditing && (
              <>
                <div>
                  <label className="block text-sm mb-2">
                    <FileText className="inline w-4 h-4 mr-2" />
                    사업자등록증
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-2">PDF, JPG, PNG 파일만 업로드 가능</p>
                </div>
                
                <div>
                  <label className="block text-sm mb-2">
                    <Image className="inline w-4 h-4 mr-2" />
                    제품 이미지 (최대 5개)
                  </label>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    multiple
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-2">JPG, PNG 파일만 업로드 가능 (각 파일 최대 5MB)</p>
                </div>
              </>
            )}
          </div>
          
          {/* Actions */}
          {isEditing && (
            <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCancel}
                disabled={saving}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Save className="w-5 h-5" />
                )}
                {saving ? '저장 중...' : (hasProfile ? '수정 완료' : '프로필 등록')}
              </button>
            </div>
          )}
        </form>
      </div>
    </UserLayout>
  );
}
