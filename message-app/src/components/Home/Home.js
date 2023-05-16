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
  const [notifications, setNotifications] = useState({});
  const [userList, setUserList] = useState([])

  useEffect(() => {
    // Receive a message
    props.socket.on("private message", ({ content, from }) => {
      addMessage(content, false, from);
    });

    // Get all the users
    props.socket.on("users", (users) => {
      const list = users.map((usr) => {
        if (usr.userID === props.socket.userID) usr["self"] = true;
        return usr;
      });
      setUserList(list);
    });

    // User connects
    props.socket.on("user connected", (user) => {
      for (let userFromList of userList) {
        if (userFromList.userID === user.userID) {
          userFromList.connected = true;
          return;
        }
        setUserList((existing) => {
          if (existing[user.userID]) {
            existing[user.userID].connected = true;
            return existing;
          } else {
            return { ...existing, user };
          }
        })
      }
    })

    // User disconnects
    props.socket.on("disconnect", (userID) => {
      for (let userFromList of userList) {
        if (userFromList.userID === userID) {
          userFromList.connected = false;
          break;
        }
      }
    })
  }, [messages, userList]);

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
    });
    if (!fromSelf && (selectedUser.userID !== userID)) {
      setNotifications((notifications) => {
        notifications[userID] = (notifications[userID] || 0) + 1;
        return notifications;
      });
    }
  }

  // Select a user from list
  const onSelectUser = (user) => {
    if (user.userID && user.username) {
      setSelectedUser(user);
      notifications[user.userID] = 0;
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

  return (
    <div className="Home">
      <div className="grid md:grid-cols-3">
        <div className="Home-left">
          <UserList
            userList={userList}
            onSelectUser={onSelectUser}
            notifications={notifications}
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