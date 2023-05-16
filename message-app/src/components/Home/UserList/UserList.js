import { useState } from "react";
import Menu from "../Menu/Menu";
import "./UserList.css";

function UserList(props) {

  const onUserClick = (user) => {
    props.onSelectUser(user);
  }

  return (
    <div className="UserList">
      <div className="text-center py-4 border-b-2 border-sky-500">
        <h2 className="my-2">Your Chat</h2>
        <Menu />
      </div>
      {props.userList.map((user) => {
        return <div
          onClick={() => onUserClick(user)}
          className="py-3 px-2 bg-slate-200 border-solid border-b-2 hover:bg-slate-300 border-sky-500 flex flex-row justify-between"
        >

          <span>{user.username} ({user.userID}) {user.self && "(Yourself)"}</span>

          <span>{user.connected ? "Online" : "Offline"}</span>

          {props.notifications[user.userID] > 0 &&
            <div className="notification">
              <span>{props.notifications[user.userID]}</span>
            </div>
          }

        </div>
      })}
    </div>
  )
}

export default UserList;