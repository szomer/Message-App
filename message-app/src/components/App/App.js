import './App.css';
import React, { useState } from 'react';
import { socket } from '../../socket';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Signin from "../Signin/Signin";
import Error from "../Error/Error";
import Home from '../Home/Home';


function App() {
  const [connectedUsers, setConnectedUsers] = useState([])
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  socket.onAny((event, ...args) => {
    console.log(event, args);
  });
  // Get all the users
  socket.on("users", (users) => {
    setConnectedUsers(users);
  });
  // When new user joins
  socket.on("user connected", (user) => {
    setConnectedUsers((users) => ([
      ...users,
      user
    ]));
  });
  // Log in
  const onUsernameSelection = (userName) => {
    setUserName(userName);
    socket.auth = { userName };
    socket.connect();
    navigate('/home');
  };
  // Error with login
  socket.on("connect_error", (err) => {
    if (err.message === "invalid username") {
      console.log('error with username');
      setUserName('');
    }
  });

  return (
    <div className="App">
      <Routes>
        <Route exact path='/' element={<Signin submitUser={(userName) => onUsernameSelection(userName)} />} />
        <Route path='/signin' element={<Signin submitUser={(userName) => onUsernameSelection(userName)} />} />
        <Route path='/home' element={<Home socket={socket} connectedUsers={connectedUsers} userName={userName} />} />
        <Route path='*' element={<Error />} />
      </Routes>
    </div>
  );
}

export default App;
