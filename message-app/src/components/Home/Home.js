import { useEffect, useState } from "react";
import './Home.css';
import UserList from "./UserList/UserList";
import ChatBody from "./ChatBody/ChatBody";
import ChatBox from "./ChatBox/ChatBox";

function Home(props) {
    const [message, setMessage] = useState("");
    const [selectedUser, setSelectedUser] = useState({ userID: '', username: '' })
    const [messages, setMessages] = useState([])


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
            setMessages((data) => [...data, {
                content: message,
                fromSelf: true,
            }])
            console.log(messages)
        }
    }
    props.socket.on("private message", ({ content, from }) => {
        console.log('received:', content, from);

        setMessages((data) => [...data, {
            content: content,
            fromSelf: false,
        }])
    });

    const onSelectUser = (user) => {
        if (user.userID && user.username) {
            setSelectedUser(user);
        }
    }

    return (
        <div className="Home">
            <div className="grid md:grid-cols-3">
                <div className="Home-left">
                    <UserList />
                </div>
                <div className="Home-right md:col-span-2">
                    <div className="grid">
                        <div className="row-span-3 bg-slate-500">
                            <ChatBody />
                        </div>
                        <div className="bg-slate-700">
                            <ChatBox />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Home;