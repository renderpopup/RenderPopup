import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../lib/contexts/AuthContext';

// User Pages
import EventList from './components/user/EventList';
import EventDetail from './components/user/EventDetail';
import ApplicationComplete from './components/user/ApplicationComplete';
import MyApplications from './components/user/MyApplications';
import Login from './components/user/Login';
import Register from './components/user/Register';
import CounterProposal from './components/user/CounterProposal';
import MyProfile from './components/user/MyProfile';
import AuthCallback from './components/user/AuthCallback';

// Admin Pages
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminEventList from './components/admin/AdminEventList';
import AdminEventForm from './components/admin/AdminEventForm';
import AdminApplications from './components/admin/AdminApplications';
import AdminCounterProposals from './components/admin/AdminCounterProposals';
import AdminStats from './components/admin/AdminStats';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* User Routes */}
          <Route path="/" element={<EventList />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/application-complete" element={<ApplicationComplete />} />
          <Route path="/my-applications" element={<MyApplications />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/counter-proposal" element={<CounterProposal />} />
          <Route path="/my-profile" element={<MyProfile />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/events" element={<AdminEventList />} />
          <Route path="/admin/events/new" element={<AdminEventForm />} />
          <Route path="/admin/events/:id/edit" element={<AdminEventForm />} />
          <Route path="/admin/applications" element={<AdminApplications />} />
          <Route path="/admin/counter-proposals" element={<AdminCounterProposals />} />
          <Route path="/admin/stats" element={<AdminStats />} />
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}