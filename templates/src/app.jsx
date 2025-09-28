import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Layout from './Layout';
import Home from './HomePage';
import About from './AboutPage';
import Readme from './ReadmePage';

import './styles/appstyles.css';

function App() {
  console.log("rendering app");
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="readme" element={<Readme />} />
        </Route>
      </Routes>
    </Router>
  );
}

const container = document.getElementById('AppRoot');
const root = createRoot(container);
root.render(<App />);