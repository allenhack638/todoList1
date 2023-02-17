import './Welcome.css';
import React, { useContext, useEffect } from 'react'
import { Link } from "react-router-dom"
import { CredentialContext } from '../App';
import Todos from '../components/Todos';
import secureLocalStorage from "react-secure-storage";

const Welcome = () => {
  const [credentials,setCredentials] = useContext(CredentialContext);

  useEffect(() => {
    const username = secureLocalStorage.getItem("id");
    const pass = secureLocalStorage.getItem("pass");
    if (username !== null || pass !== null) {
      setCredentials({ username, pass })
    }
  }, [])

  function Logout() {
    secureLocalStorage.removeItem("id");
    secureLocalStorage.removeItem("pass");
    setCredentials(null);
  }

  return (
    <div>
      <h1>Welcome {credentials != null && credentials.username}</h1>
      <div className='cont'>
        {!credentials && <Link className='reg' to="/register">Register</Link>}
        <br />
        {!credentials && <Link className='log' to="/login">Login</Link>}
        {credentials != null && <Todos />}
      </div>
      {credentials && <button className='butt bot' onClick={Logout}>Logout</button>}
      <p className='footer'>@ 2023 Copyright. All rights reseved</p>
    </div>
  )

}

export default Welcome