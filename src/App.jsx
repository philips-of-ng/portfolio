import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AboutMe from './pages/AboutMe';
import Projects from './pages/Projects';
import Tools from './pages/Tools';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import BookACall from './pages/BookACall';
import OneProjectPage from './pages/OneProjectPage';
import NotFound from './pages/NotFound';
import UploadInfo from './admin/admin-pages/UploadInfo';
import OneAlbumPage from './pages/OneAlbumPage';


export default function App() {
  return (
    <div className='whole-app'>

      <div className='glow-1'></div>
      <div className='glow-2'></div>
      <div className='glow-3'></div>

      <Router>
        <Navbar />
        <main>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about-me" element={<AboutMe />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/book-a-call" element={<BookACall />} />
            <Route path="/projects/:projectId" element={<OneProjectPage />} />

            <Route path='/album' element={<OneAlbumPage />} />

            <Route path='*' element={<NotFound />} />
            <Route path='/admin-only' element={<UploadInfo />} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </div>
  );
}
