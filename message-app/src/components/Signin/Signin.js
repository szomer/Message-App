import { useState } from "react";

function Signin(props) {
    const [userName, setUserName] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        props.submitUser(userName);
    };

    return (
        <div className="Signin">
            <form onSubmit={handleSubmit}>
                <h2 >Sign in to Open Chat</h2>
                <label htmlFor="username">Username</label>
                <input
                    type="text"
                    minLength={5}
                    name="username"
                    id="username"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                />
                <button >SIGN IN</button>
            </form>

        </div>
    )
}

export default Signin;