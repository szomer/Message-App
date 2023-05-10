
function Error(props) {
    return (<div className="Error">
        {props.errorMessage || "The page does not exist"}

    </div>)
}

export default Error;