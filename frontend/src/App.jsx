import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Map from './pages/Map';
import SpeciesDetail from './pages/SpeciesDetail';
import Dashboard from './pages/Dashboard';
import Alert from './pages/Alert';
import Report from './pages/Report';


function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/map" element={<Map />} />
        <Route path="/species/:id" element={<SpeciesDetail />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/alert" element={<Alert />} />
        <Route path="/report" element={<Report />} />
      </Routes>
    </Router>
  )
}

export default App
