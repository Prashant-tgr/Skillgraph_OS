import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* The Root URL goes to  generative form */}
        <Route path="/" element={<Home />} />
        
        {/* The Dashboard URL catches the dynamic graph generation */}
        <Route path="/dashboard/dynamic" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}