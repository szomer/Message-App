import "./Menu.css";

function Menu() {
  return (
    <div className="Menu flex flex-row flex-nowrap justify-evenly">
      <button
        className="m-2 px-2 py-1 hover:bg-slate-300 bg-slate-200 rounded"
      >
        New Chat
      </button>
      <button
        className="m-2 px-2 py-1 hover:bg-slate-300 bg-slate-200 rounded"
      >
        Settings
      </button>
    </div>
  )
}

export default Menu;