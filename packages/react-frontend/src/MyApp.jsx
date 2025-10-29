import React, { useState, useEffect } from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import ProfilePage from './Pages/Profile_Page.jsx';
import Table from './Table';
import Form from './Form';


// <Table characterData={characters}/> where characters is being passed to table as a prop
function MyApp() {
  return(
   <Router>
      <Routes>
        <Route path="/profile/:userId" element={<ProfilePage/>} />
      </Routes>
   </Router>
  );
}
export default MyApp;