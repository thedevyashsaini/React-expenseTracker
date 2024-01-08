import "./LogoutButton.css";

const LogoutButton = (props) => {
  return (
    <i className="fa-solid fa-arrow-right-from-bracket logout" onClick={props.onLogout} aria-hidden="true"></i>
  );
};

export default LogoutButton;
