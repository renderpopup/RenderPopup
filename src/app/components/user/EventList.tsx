import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import UserLayout from '../layout/UserLayout';
import { getEvents } from '../../../lib/api/events';
import type { Event } from '../../../lib/database.types';
import { Calendar, MapPin, Users, Search, Filter, Loader2 } from 'lucide-react';

export default function EventList() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const categories = ['all', 'IT/기술', '비즈니스', '디자인', '마케팅'];

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getEvents({
          category: selectedCategory !== 'all' ? selectedCategory : undefined,
          search: searchTerm || undefined,
        });
        setEvents(data);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('행사 목록을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchEvents, 300);
    return () => clearTimeout(debounce);
  }, [searchTerm, selectedCategory]);
  
  const getStatusBadge = (status: string) => {
    const styles = {
      open: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800',
      upcoming: 'bg-blue-100 text-blue-800',
    };
    const labels = {
      open: '신청 가능',
      closed: '마감',
      upcoming: '오픈 예정',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-sm ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };
  
  return (
    <UserLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <div className="mb-8">
          <h1 className="text-3xl mb-6">행사 찾기</h1>
          
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="행사명으로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full md:w-48 pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? '전체 카테고리' : cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-3 text-gray-600">행사를 불러오는 중...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Results Count */}
        {!loading && !error && (
          <div className="mb-4">
            <p className="text-gray-600">{events.length}개의 행사가 있습니다</p>
          </div>
        )}
        
        {/* Events Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map(event => (
              <div key={event.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                {/* Event Image */}
                <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 relative overflow-hidden">
                  {event.image_url && (
                    <img 
                      src={event.image_url} 
                      alt={event.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  )}
                </div>
                
                {/* Event Content */}
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      {event.category}
                    </span>
                    {getStatusBadge(event.status)}
                  </div>
                  
                  <h3 className="text-lg mb-2">
                    <Link to={`/events/${event.id}`} className="hover:text-blue-600">
                      {event.title}
                    </Link>
                  </h3>
                  
                  {/* AI Summary */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded">AI 자동 요약</span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">{event.summary}</p>
                  </div>
                  
                  {/* Event Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>{event.applications_count}명 신청</span>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Link
                      to={`/events/${event.id}`}
                      className="flex-1 text-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      자세히 보기
                    </Link>
                    {event.status === 'open' && (
                      <Link
                        to={`/events/${event.id}?apply=true`}
                        className="flex-1 text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        신청하기
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {!loading && !error && events.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">검색 결과가 없습니다.</p>
          </div>
        )}
      </div>
    </UserLayout>
  );
}
