import { Routes, Route, Navigate } from 'react-router-dom';
import NSPHeader from './components/NSPHeader';
import Login from './pages/Login';
import Register from './pages/Register';
import LandingPage from './pages/LandingPage';
import FAQ from './pages/FAQ';
import Announcements from './pages/Announcements';
import Helpdesk from './pages/Helpdesk';
import Grievance from './pages/Grievance';
import ProtectedRoute from './utils/protectedRoute';
import StudentDashboard from './pages/StudentDashboard';
import VerifierDashboard from './pages/VerifierDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminAnalytics from './pages/AdminAnalytics';
import AdminGrievances from './pages/AdminGrievances';
import AdminExpiredDocuments from './pages/AdminExpiredDocuments';
import AdminSchemes from './pages/AdminSchemes';
import Officers from './pages/Officers';
import Students from './pages/Students';
import Institutes from './pages/Institutes';
import Schemes from './pages/Schemes';
import Public from './pages/Public';
import PaymentStatus from './pages/PaymentStatus';
import ComingSoon from './pages/ComingSoon';
import About from './pages/About';
import Contact from './pages/Contact';
import SiteMap from './pages/SiteMap';
import Eligibility from './pages/Eligibility';
import FAQs from './pages/FAQs';
import ScholarshipRecommendations from './pages/ScholarshipRecommendations';
import Crowdfunding from './pages/Crowdfunding';
import PolicySimulator from './pages/PolicySimulator';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50 font-sans">
        <NSPHeader />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/coming-soon" element={<ComingSoon />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['Student']} />}>
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/recommendations" element={<ScholarshipRecommendations />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['Verifier']} />}>
            <Route path="/verifier/dashboard" element={<VerifierDashboard />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/analytics" element={<AdminAnalytics />} />
            <Route path="/admin/grievances" element={<AdminGrievances />} />
            <Route path="/admin/expired-documents" element={<AdminExpiredDocuments />} />
            <Route path="/admin/simulator" element={<PolicySimulator />} />
            <Route path="/admin/schemes" element={<AdminSchemes />} />
          </Route>

          <Route path="/" element={<LandingPage />} />
          <Route path="/officers" element={<Officers />} />
          <Route path="/students" element={<Students />} />
          <Route path="/institutes" element={<Institutes />} />
          <Route path="/public" element={<Public />} />
          <Route path="/payment-status" element={<PaymentStatus />} />

          {/* Fallback for missing sidebar links */}
          <Route path="/institutes/*" element={<ComingSoon />} />
          <Route path="/grievance" element={<Grievance />} />
          <Route path="/schemes" element={<Schemes />} />
          <Route path="/aadhaar-seva-kendra" element={<ComingSoon />} />
          <Route path="/eligibility" element={<Eligibility />} />
          <Route path="/faqs" element={<FAQs />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/helpdesk" element={<Helpdesk />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/sitemap" element={<SiteMap />} />
          <Route path="/crowdfunding" element={<Crowdfunding />} />

          {/* Redirect old routes to login */}
          <Route path="/student/login" element={<Navigate to="/login" replace />} />
          <Route path="/student/register" element={<Navigate to="/register" replace />} />
          <Route path="/csc-login" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;

