import './App.css';
import React, { useState } from 'react';
import { socket } from '../../socket';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Signin from "../Signin/Signin";
import Error from "../Error/Error";
import Home from '../Home/Home';


function App() {
  const [usernameAlreadySelected, setUsernameAlreadySelected] = useState(false);
  const [connectedUsers, setConnectedUsers] = useState([])
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  socket.on("connect_error", (err) => {
    if (err.message === "invalid username") {
      setUsernameAlreadySelected(false);
    }
  });

  socket.on("users", (users) => {
    console.log('users', users);
    setConnectedUsers(users);
  });

  socket.on("user connected", (user) => {
    console.log('user connected', user);
    setConnectedUsers((users) => ([
      ...users,
      user
    ]));
  });

  const onUsernameSelection = (userName) => {
    setUserName(userName);
    socket.auth = { userName };
    socket.connect();
    setUsernameAlreadySelected(true);
    navigate('/home');
  };
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
