import './App.css';
import React, { useEffect, useState } from 'react';
import { socket } from '../../socket';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Signin from "../Signin/Signin";
import Error from "../Error/Error";
import Home from '../Home/Home';


function App() {
  const [connectedUsers, setConnectedUsers] = useState([])
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    socket.onAny((event, ...args) => {
      console.log('EVENT', event, args);
    });
    // Get all the users
    socket.on("users", (users) => {
      setConnectedUsers((users.filter((user) => (user.username !== userName))));
    });
    // Error with login
    socket.on("connect_error", (err) => {
      if (err.message === "invalid username") {
        setUserName('');
      }
    });
  }, [connectedUsers, userName, socket]);

  // Log in
  const onUsernameSelection = (userName) => {
    setUserName(userName);
    socket.auth = { userName };
    socket.connect();
    navigate('/home');
  };

  return (
    <div className="App">
      <Routes>
        <Route exact path='/' element={<Signin submitUser={(userName) => onUsernameSelection(userName)} />} />
        <Route path='/home' element={<Home socket={socket} connectedUsers={connectedUsers} userName={userName} />} />
        <Route path='*' element={<Error />} />
      </Routes>
    </div>
  );
}

export default App;
