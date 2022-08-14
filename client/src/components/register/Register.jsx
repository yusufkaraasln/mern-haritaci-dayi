import axios from "axios";
import React from "react";
import "../auth.scss";
function Register(props) {


     
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [email, setEmail] = React.useState("");

  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newUser = {
      username,
      email,
      password,
    };

    try {
      const res = await axios.post("/auth/register", newUser);

      console.log(res.data);

      if (res.data) {
        setSuccess(true);
        setError(false);
      } else {
        setSuccess(false);
        setError(true);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="auth">
      <form onSubmit={handleSubmit} className="auth-container">
        <i onClick={()=>props.setShowRegister(false)} class="fa-solid fa-circle-xmark"></i>

        <input
          type="text"
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
        <input
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        {success && (
          <span style={{ color: "lime", fontSize: "1rem" }}>Success</span>
        )}
        {error && <span style={{ color: "red", fontSize: "1rem" }}>Fail</span>}
        <button>Register</button>
      </form>
    </div>
  );
}

export default Register;
