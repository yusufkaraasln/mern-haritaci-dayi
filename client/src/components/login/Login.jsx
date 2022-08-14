import axios from "axios";
import React from "react";
import "../auth.scss";
function Login(props) {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newLogin = {
      username,
      password,
    }

    try {
      const res = await axios.post("/auth/login", newLogin);

      console.log(res.data);

      if (res.data) {
        setSuccess(true);

        setError(false);
        props.userStorage.setItem("user", res.data.username);

        props.setCurrentUser(res.data.username);
        props.setShowLogin(false);


      } else {
        setSuccess(false);
        setError(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="auth">
      <form onSubmit={handleSubmit} className="auth-container">
        <i
          onClick={() => props.setShowLogin(false)}
          class="fa-solid fa-circle-xmark"
        ></i>

        <input
          type="text"
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
        <input
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        {success && (
          <span style={{ color: "lime", fontSize: "1rem" }}>Success</span>
        )}
        {error && (
          <span style={{ color: "red", fontSize: "1rem" }}>Fail</span>
        )}

        <button>Login</button>
      </form>
    </div>
  );
}

export default Login;
