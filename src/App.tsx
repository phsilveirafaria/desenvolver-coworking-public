import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { BookingProvider } from './context/BookingContext';
import { CssBaseline } from '@mui/material';
import RoomsList from './pages/RoomsList';
import RoomCalendar from './pages/RoomCalendar';

function App() {
  return (
    <ThemeProvider>
      <CssBaseline />
      <BookingProvider>
        <Router>
          <Routes>
            <Route path="/" element={<RoomsList />} />
            <Route path="/room/:id" element={<RoomCalendar />} />
          </Routes>
        </Router>
      </BookingProvider>
    </ThemeProvider>
  );
}

export default App;