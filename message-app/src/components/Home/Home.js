import { useEffect, useState } from "react";
import './Home.css';
import UserList from "./UserList/UserList";
import ChatBody from "./ChatBody/ChatBody";
import ChatBox from "./ChatBox/ChatBox";

function Home(props) {
  const [selectedUser, setSelectedUser] = useState({ userID: '', username: '' })
  const [messages, setMessages] = useState([])


  const sendMessage = (message) => {
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
          <UserList
            connectedUsers={props.connectedUsers}
            onSelectUser={onSelectUser}
          />
        </div>
        <div className="Home-right md:col-span-2">
          <div className="flex flex-col h-full">
            <div className="grow bg-slate-500 overflow-y-auto">
              <ChatBody messages={messages} />
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