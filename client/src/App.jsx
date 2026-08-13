import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProjectsPage from './pages/ProjectsPage';
import ProfilePage from './pages/ProfilePage';
import ContactPage from './pages/ContactPage';
import RavenTransition from './components/RavenTransition'; 
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';


function App() {
  return (
    <Router>
      <div className="min-h-screen bg-black text-white font-sans overflow-x-hidden selection:bg-red-500 selection:text-white">
        <RavenTransition /> {/* <-- Active across all routes */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path={import.meta.env.VITE_SECRET_LOGIN_ROUTE || "/fallback-hidden-route"} element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;