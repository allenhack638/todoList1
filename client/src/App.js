import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Welcome from './Pages/Welcome';
import Register from './Pages/Register'
import Login from './Pages/Login'
import React, { useState } from 'react';
export const CredentialContext = React.createContext(null);

function App() {
  const credentialstate = useState(null);
  
  return (
    <div>
      <CredentialContext.Provider value={credentialstate}>
        <Router>
          <Routes>
            <Route exact path='/' element={<Welcome />} />
            <Route exact path='/register' element={<Register />} />
            <Route exact path='/login' element={<Login />} />
          </Routes>
        </Router>
      </CredentialContext.Provider>
    </div>
  )
};

export default App;
