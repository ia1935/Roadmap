import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Landing from './Pages/Landing';
import Register from './Pages/NewUser';
import Sheet from './Pages/Sheet';

import Home from './Pages/Home';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/sheet/:sheetId" element={<Sheet />} />
      </Routes>
    </Router>
  );
}

export default App;
