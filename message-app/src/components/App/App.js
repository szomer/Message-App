import './App.css';
import React, { useState, useEffect } from 'react';
import { socket } from '../../socket';
import Signin from "../Signin/Signin";

function App() {
  const [usernameAlreadySelected, setUsernameAlreadySelected] = useState(false);
  const [connectedUsers, setConnectedUsers] = useState([])
  const [data, setData] = useState();


  useEffect(() => {
    fetch('/api/test')
      .then((data) => data.json())
      .then((data) => setData(data.message));
  }, [])

  // socket.onAny((event, ...args) => {
  //   console.log(event, args);
  // });

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
    console.log('user connected', user)
  });

  const onUsernameSelection = (userName) => {
    console.log('sending username:', userName)
    socket.auth = { userName };
    socket.connect();
    setUsernameAlreadySelected(true);
  };

  return (
    <div className="App">

      {data &&
        <p>{data}</p>
      }
      {
        connectedUsers.map(user =>
          <p>USER: {user.username}</p>
        )}


      <Signin submitUser={(userName) => onUsernameSelection(userName)} />

    </div>
  );
}

export default App;
