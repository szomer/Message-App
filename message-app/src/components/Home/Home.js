import { useCallback, useEffect, useState } from "react";
import './Home.css';
import UserList from "./UserList/UserList";
import ChatBody from "./ChatBody/ChatBody";
import ChatBox from "./ChatBox/ChatBox";

function Home(props) {
  // Keep track of which user is currently selected
  const [selectedUser, setSelectedUser] = useState({ userID: '', username: '' })
  // Store messages of users
  const [messages, setMessages] = useState({});
  // Store users
  const [userList, setUserList] = useState([])

  // Add message to array
  const setNewMessage = useCallback((content, fromSelf, userID) => {
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
    // Handle newmessages notification
    if (!fromSelf) {
      if (!(selectedUser.userID === userID)) {
        setMessagesNotification(userID);
      }
    }
  }, [selectedUser, messages]);

  // Set notification ++
  const setMessagesNotification = (userID) => {
    setUserList((users) => {
      for (let user of users) {
        if (user.userID === userID) {
          user.newmessages++;
          break;
        }
      }
      return users;
    })
  };

  // Set notification to 0
  const setMessagesNotificationToZero = (userID) => {
    setUserList((users) => {
      for (let user of users) {
        if (user.userID === userID) {
          user.newmessages = 0;
          break;
        }
      }
      return users;
    })
  };

  useEffect(() => {
    // Get all the users
    props.socket.on("users", (users) => setUsers(users));
    // User connects
    props.socket.on("user connected", (user) => setConnected(user));
    // User disconnects
    props.socket.on("disconnect", (userID) => setDisconnected(userID));
    // Receive a message
    props.socket.on("private message", ({ content, from }) => setNewMessage(content, false, from));

    // Set users in userList
    const setUsers = (users) => {
      // Add self and newmessages property
      const list = users.map((usr) => {
        usr.newmessages = 0;
        if (usr.userID === props.socket.userID) usr["self"] = true;
        return usr;
      });
      setUserList(list);
    };
    // Connect user
    const setConnected = (connectedUser) => {
      // Check if user already in list
      for (let user of userList) {
        // Update existing user
        if (user.userID === connectedUser.userID) {
          user.connected = true;
          setUserList(userList);
          return;
        }
      }
      // Add new user
      connectedUser.newmessages = 0;
      setUserList((existing) => ([...existing, connectedUser]));
    }
    // Disconnect user
    const setDisconnected = (userID) => {
      for (let user of userList) {
        // If user found, update connected
        if (user.userID === userID) {
          user.connected = false;
          setUserList(userList);
          return;
        }
      }
    }
    return () => {
      // Remove eventlisteners
      props.socket.off("users");
      props.socket.off("user connected");
      props.socket.off("disconnect");
      props.socket.off("private message");
    };
  }, [props.socket, setNewMessage, userList]);

  // Select a user from list
  const handleSelectUser = (user) => {
    if (user.userID) {
      setSelectedUser({ userID: user.userID, username: user.username });
      setMessagesNotificationToZero(user.userID);
    }
  };

  // Send a message
  const handleSendMessage = (message) => {
    if (message && selectedUser.userID) {
      // Emit message socketio
      props.socket.emit("private message", {
        content: message,
        to: selectedUser.userID,
      });
      setNewMessage(message, true, selectedUser.userID)
    }
  };

  return (
    <div className="Home">
      <div className="grid md:grid-cols-3">
        <div className="Home-left">
          <UserList
            userList={userList}
            onSelectUser={handleSelectUser}
          />
        </div>
        <div className="Home-right md:col-span-2">
          <div className="flex flex-col h-full">
            <div className="grow bg-slate-500 overflow-y-auto">
              <ChatBody messages={messages[selectedUser.userID]} />
            </div>
            <div className="col bg-slate-700">
              <ChatBox onSendMessage={handleSendMessage} />
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Home;