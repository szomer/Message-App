import { useState } from "react";
import Menu from "../Menu/Menu";
import "./UserList.css";

function UserList(props) {

  const onUserClick = (e, user) => {
    props.onSelectUser(user);
    let listItems = document.querySelectorAll('#listitem')
    listItems.forEach(item => {
      item.classList.remove("selectedListItem");
    });
    e.target.classList.add('selectedListItem');
  }

  return (
    <div className="UserList">
      <div className="text-center py-4 border-b-2 border-sky-500">
        <h2 className="my-2">Your Chat</h2>
        <Menu />
      </div>
      {props.userList && props.userList.map((user) => {
        return <div
          key={user.userID}
          onClick={(e) => onUserClick(e, user)}
          className="py-3 px-2 bg-slate-200 border-solid border-b-2 hover:bg-slate-300 border-sky-500 flex flex-row justify-between"
          id="listitem"
        >
          <span>{user.username} ({user.userID}) {user.self && "(Yourself)"}</span>

          <div className="flex flex-row">
            {user.newmessages > 0 &&
              <span className="notification">New Messages</span>
            }
            <span>{user.connected ? "Online" : "Offline"}</span>
          </div>
        </div>
      })}
    </div>
  )
}

export default UserList;