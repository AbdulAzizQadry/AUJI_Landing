import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import 'aos/dist/aos.css';
import AOS from 'aos';

import ComingSoon from './components/ComingSoon';
import Register from './components/Register';
import Landing from './components/Landing';

function App() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      offset: 100,
      once: true
    });
  }, []);

  return (
    <div className="font-montaser bg-[#f8f9fc]">
      <Router>
        <Routes>
          <Route path="/coming-soon" element={<ComingSoon />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Landing />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
