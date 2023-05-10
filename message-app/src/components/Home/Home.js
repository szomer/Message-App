import { useEffect, useState } from "react";

function Home(props) {

    const [message, setMessage] = useState("");
    const [selectedUser, setSelectedUser] = useState({ userID: '', username: '', messages: [] })


    const handleSubmitMessage = (e) => {
        e.preventDefault();
        console.log(message);
        sendMessage();
    };

    const sendMessage = () => {
        console.log('send message', message, selectedUser.userID);
        if (message && selectedUser.userID) {
            props.socket.emit("private message", {
                content: message,
                to: selectedUser.userID,
            });
        }
    }

    const onSelectUser = (user) => {
        if (user.userID && user.username) {
            setSelectedUser(user);
        }
    }

    return (
        <div className="Home">
            <h2>Welcome {props.userName}</h2>

            <h2>All connected users:</h2>
            {props.connectedUsers.map(user =>
                <p>USER: <a onClick={() => onSelectUser(user)}>{user.username}</a></p>
            )}

            <h2>Selected user:</h2>
            <p>{selectedUser.userID}, {selectedUser.username}</p>

            <h2>Send a message:</h2>
            <form>
                <input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your message.."
                />
                <button onClick={handleSubmitMessage}>Send</button>
            </form>

        </div>
    )
}

export default Home;