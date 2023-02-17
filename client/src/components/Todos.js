import './Todos.css'
import React, { useState, useContext, useEffect } from 'react'
import { CredentialContext } from '../App';

// const API_BASE = "https://clean-parka-ox.cyclic.app";
// const API_BASE = "http://localhost:5000";

const Todos = () => {
  const [todos, setTodos] = useState([]);
  const [todoText, settodoText] = useState("");
  const [credentials,] = useContext(CredentialContext);

  const persist = (newTodos) => {
    fetch("/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${credentials.username}:${credentials.pass}`
      },
      body: JSON.stringify(newTodos)
    })
      .then(() => { })
  }

  useEffect(() => {
    fetch(API_BASE + "/todos", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${credentials.username}:${credentials.pass}`
      }
    })
      .then((res) => res.json())
      .then((todos) => setTodos(todos));
  },[])

  const addTodo = (e) => {
    e.preventDefault();
    if (!todoText) return;
    const newTodo = { checked: false, text: todoText }
    const newTodos = [...todos, newTodo];
    setTodos(newTodos);
    settodoText("");
    persist(newTodos);
  }

  const textHandler = (event) => {
    const { value } = event.target;
    settodoText(value);
  }

  const toggleHandler = (index) => {
    const newList = [...todos];
    newList.splice(index, 1);
    setTodos(newList);
    persist(newList);
  }

  return (
    <div className="container">
      <div className="heading">
        <h1>To-Do List</h1>
      </div>
      <div className="form">
        <input type="text" onChange={textHandler} value={todoText} />
        <button onClick={addTodo}><span>Add</span></button>
      </div>
      <div>
        <ul>
          {todos.map((todo, index) => (
            <div key={index}>
              <li onClick={() => toggleHandler(index)}>{todo.text}</li>
            </div>
          ))}
        </ul>
      </div>
      <p className='footer'>@ 2023 Copyright. All rights reseved</p>
    </div>
  )
}

export default Todos;