import './App.css';
import React, { useEffect, useState } from 'react';
import { socket } from './socket';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Signin from "../Signin/Signin";
import Error from "../Error/Error";
import Home from '../Home/Home';


function App() {
  const navigate = useNavigate();
  const [userNameSelected, setUserNameSelected] = useState(false);

  useEffect(() => {
    const sessionID = localStorage.getItem("sessionID");
    if (sessionID) {
      socket.auth = { sessionID };
      socket.connect();
      navigate('/home');
    }

    socket.on("session", ({ sessionID, userID }) => {
      setUserNameSelected(true);
      // attach sessionID to the next reconnection attempts
      socket.auth = { sessionID };
      // store  in local storage
      localStorage.setItem("sessionID", sessionID);
      // save the ID of the user 
      socket.userID = userID;
    })

    // Error with login
    socket.on("connect_error", (err) => {
      if (err.message === "invalid username") {
        setUserNameSelected(false);
      }
    });
  }, [navigate]);

  // Log in
  const onUsernameSelection = (userName, password) => {
    // --- TO DO: add validation here
    setUserNameSelected(true);
    socket.auth = { userName };
    socket.connect();
    navigate("/home");
  };

  return (
    <div className="App">
      <Routes>
        <Route exact path='/' element={<Signin submitUser={onUsernameSelection} userNameSelected={userNameSelected} />} />
        <Route path='/home' element={<Home socket={socket} />} />
        <Route path='*' element={<Error />} />
      </Routes>
    </div>
  );
}

export default App;
