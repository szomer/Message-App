import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from "react";

function App() {

  const [data, setData] = useState();

  useEffect(() => {
    fetch('/api')
      .then((data) => data.json())
      .then((data) => setData(data.message));
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

        {data &&
          <p>{data}</p>
        }

      </header>
    </div>
  );
}

export default App;
