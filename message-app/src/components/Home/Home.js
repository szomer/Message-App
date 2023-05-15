import { useEffect, useState } from "react";
import './Home.css';
import UserList from "./UserList/UserList";
import ChatBody from "./ChatBody/ChatBody";
import ChatBox from "./ChatBox/ChatBox";

function Home(props) {
  // Keep track of which user is currently selected
  const [selectedUser, setSelectedUser] = useState({ userID: '', username: '' })
  // Store messages of users
  const [messages, setMessages] = useState({});

  // Add message to array
  const addMessage = (content, fromSelf, userID) => {
    let arr = [];
    if (messages[selectedUser.userID]) {
      arr = messages[selectedUser.userID];
    }
    arr.push({ content, fromSelf });
    setMessages((data) => {
      return {
        ...data,
        [userID]: arr
      }
    })
  }

  // Select a user from list
  const onSelectUser = (user) => {
    if (user.userID && user.username) {
      setSelectedUser(user);
    }
  }

  // Send a message
  const sendMessage = (message) => {
    if (message && selectedUser.userID) {
      // Emit message socketio
      props.socket.emit("private message", {
        content: message,
        to: selectedUser.userID,
      });
      addMessage(message, true, selectedUser.userID)
    }
  }

  // Receive a message
  props.socket.on("private message", ({ content, from }) => {
    addMessage(content, false, from);
  });

  return (
    <div className="Home">
      <div className="grid md:grid-cols-3">
        <div className="Home-left">
          <UserList
            connectedUsers={props.connectedUsers}
            onSelectUser={onSelectUser}
          />
        </div>
        <div className="Home-right md:col-span-2">
          <div className="flex flex-col h-full">
            <div className="grow bg-slate-500 overflow-y-auto">
              <ChatBody messages={messages[selectedUser.userID]} />
            </div>
            <div className="col bg-slate-700">
              <ChatBox sendMessage={sendMessage} />
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Home;