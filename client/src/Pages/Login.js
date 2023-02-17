import React, { useState, useContext } from 'react'
import { useNavigate } from "react-router-dom";
import { CredentialContext } from '../App';
import secureLocalStorage from "react-secure-storage";
import "./Login.css"

// const API_BASE = "https://clean-parka-ox.cyclic.app";
// const API_BASE = "http://localhost:5000";

const Login = () => {

  const navigate = useNavigate();
  const [username, setUserName] = useState("");
  const [pass, setPass] = useState("");
  const [isError, setIsError] = useState("");

  const [, setCredentials] = useContext(CredentialContext);

  const handleErrors = async (res) => {
    if (!res.ok) {
      const { message } = await res.json();
      throw Error(message);
    }
    return res.json();
  }

  function userHandler(e) {
    setIsError("");
    const { value } = e.target;
    setUserName(value);
  }

  function userPass(e) {
    setIsError("");
    const { value } = e.target;
    setPass(value);
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    if (username === "" || pass === "") {
      alert("Please enter Valid Details")
      return;
    }
    await fetch( "/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: username, pass: pass
      })
    })
      .then(handleErrors)
      .then((res) => {
        setCredentials({
          username, pass
        })
        secureLocalStorage.setItem("id", username);
        secureLocalStorage.setItem("pass", pass);
        navigate("/");
      }

      )
      .catch((error) => {
        setIsError(error.message);
      })

  }
  return (
    <div className='main-div'>
      <h1>Login</h1>
      {isError}
      <form onSubmit={submitHandler} className="form">
        <label>Enter email id</label>
        <input className='input' type="text" placeholder='username' onChange={userHandler} value={username} />
        <label>Enter password</label>
        <input className='input' type="password" placeholder='password' onChange={userPass} value={pass} />
        <button className='butt' type='submit'>Login</button>
      </form>
      <p className='footer'>@ 2023 Copyright. All rights reseved</p>
    </div>
  )
}

export default Login