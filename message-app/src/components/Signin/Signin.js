import { useState } from "react";
import "./Signin.css";

function Signin(props) {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [signUp, setSignUp] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (signUp) {
      console.log('User loggedin', userName, password);
      props.submitUser(userName);
    } else {
      console.log('Create new user', userName, password);
      // create new user here
    }
  };

  const onChangeScreen = () => {
    setSignUp((state) => !state);
  }

  return (
    <div className="Signin">
      <div className="flex items-center justify-center h-screen">
        <form onSubmit={handleSubmit} className=" shadow-md rounded px-8 pt-6 pb-8 mb-4" >
          <h2 className="text-center mb-1 font-medium">Messaging App</h2>
          <div className="px-2 mb-5 flex justify-center">
            <span className="text-sm pr-1">
              {signUp ?
                "Don't have an account?" :
                "Already have an account?"
              }
            </span>
            <a
              className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
              onClick={onChangeScreen}>
              {signUp ?
                "Sign Up" :
                "Sign In"
              }
            </a>
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="username">
              Username
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="username"
              type="text"
              placeholder="Username"
              pattern="[A-Za-z0-9].{5,}"
              title="Username can not contain symbols and must contain at least 5 characters,"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </div>
          <div className="mb-5">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password">
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{5,}"
              title="Password must contain at least one number, one uppercase and lowercase letter, and at least 5 characters"
              placeholder="*************"
              value={password}
              onChange={(e) => setPassword(e.target.value)}

            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
              type="submit"
            // onClick={handleSubmit}
            >
              {signUp ?
                "Sign In" :
                "Sign Up"
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Signin;