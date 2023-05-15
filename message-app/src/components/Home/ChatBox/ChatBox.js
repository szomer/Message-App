import { useState } from "react";
import "./ChatBox.css"

function ChatBox(props) {

  const [message, setMessage] = useState("");

  const onClickSend = (e) => {
    e.preventDefault();
    if (message) {
      console.log('send message', message);
      props.sendMessage(message);
    }
  }
  return (
    <div className="ChatBox">
      <form
        onSubmit={onClickSend}
        className="w-full flex flex-nowrap"
      >
        <input
          className="grow px-3"
          placeholder="write a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          type="submit"
          className="px-3 py-2 bg-slate-200 hover:bg-slate-300">
          Send
        </button>
      </form>
    </div>
  )
}

export default ChatBox;