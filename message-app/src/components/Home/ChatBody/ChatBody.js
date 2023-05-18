import "./ChatBody.css";

function ChatBody(props) {

  return (
    <div className="ChatBody">

      {props.messages && props.messages.map((message, index) => {
        return <div key={index} className={message.fromSelf ? "sent_message" : "received_message"}>
          <div className="p-2 mx-3 my-2 bg-slate-200 rounded shadow-sm shadow-slate-800">
            {message.content}
          </div>
        </div>
      })}

    </div>
  )
}

export default ChatBody;