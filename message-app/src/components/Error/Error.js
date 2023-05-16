import "./Error.css";

function Error(props) {
  return (
    <div className="Error flex flex-col justify-center align-middle">
      <div className="text-center">
        <h2 className="">Error</h2>
        <p>
          {props.errorMessage || "The page does not exist"}
        </p>
        <p>Return to the <a className="" href="/">Homepage</a></p>
      </div>
    </div>
  )
}

export default Error;