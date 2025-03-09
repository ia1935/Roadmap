import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Landing from './Pages/Landing';
import Register from './Pages/NewUser';
import Sheet from './Pages/SpreadSheet';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import Home from './Pages/Home';

const queryClient = new QueryClient();
function App() {
  return (
    <QueryClientProvider client={queryClient}>
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/sheet/:sheetId" element={<Sheet />} />
      </Routes>
    </Router>
    <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default App;
