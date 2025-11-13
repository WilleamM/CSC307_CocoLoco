import React, { useState, useEffect } from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import ProfilePage from './Pages/Profile_Page.jsx';
import Page_Header from './Headers/Page_Header.jsx';
import Profile_Page_Header from './Headers/Profile_Page_Header.jsx';



// <Table characterData={characters}/> where characters is being passed to table as a prop
function MyApp() {
  return(
    <Router>
      <Routes>
        <Route path="/profile/:userId" element={<><Profile_Page_Header /><ProfilePage /></>} />
        <Route path="/" element={<><Page_Header /></>} />
      </Routes>
    </Router>
  );
}

export default MyApp;