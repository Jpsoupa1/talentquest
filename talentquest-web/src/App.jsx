import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import JobsDashboard from './pages/JobsDashboard';
import ChallengePage from './pages/ChallengePage';
import CreateJob from './pages/CreateJob';  // <-- NOVO
import ProfilePage from './pages/ProfilePage'; // <-- NOVO
import CandidatesPage from './pages/CandidatesPage';

function PrivateRoute({ children }) {
  const user = localStorage.getItem('user');
  return user ? children : <Navigate to="/" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/jobs" element={<PrivateRoute><JobsDashboard /></PrivateRoute>} />
        <Route path="/challenge" element={<PrivateRoute><ChallengePage /></PrivateRoute>} />
        
        {/* NOVAS ROTAS */}
        <Route path="/create-job" element={<PrivateRoute><CreateJob /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
        <Route path="/job/:jobId/candidates" element={<PrivateRoute><CandidatesPage /></PrivateRoute>} />

      </Routes>
    </BrowserRouter>
  );
}