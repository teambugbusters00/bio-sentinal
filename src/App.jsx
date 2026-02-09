import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/landing';
import Map from './pages/map';
import Dashboard from './pages/dashboard';
import Alert from './pages/alert';
import Report from './pages/report';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/map" element={<Map />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/alert" element={<Alert />} />
        <Route path="/report" element={<Report />} />
      </Routes>
    </Router>
  )
}

export default App
