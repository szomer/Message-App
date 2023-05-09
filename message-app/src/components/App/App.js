import './App.css';
import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
const socket = io.connect('http://localhost:3001');

function App() {

  const [data, setData] = useState();


  useEffect(() => {
    fetch('/api/test')
      .then((data) => data.json())
      .then((data) => setData(data.message));
  }, [])

  return (
    <div className="App">

      {data &&
        <p>{data}</p>
      }

    </div>
  );
}

export default App;
