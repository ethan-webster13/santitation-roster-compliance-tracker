import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Components/AuthContext";
import mockUsers from "../data/users.json";

export const Login = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!userName || !password) {
      setError("Please fill in all fields.");
      return;
    }

    const user = mockUsers.find(
      (u) =>
        u.username.toLowerCase() === userName.toLowerCase() &&
        u.password === password
    );

    if (user) {
      const mockHeader = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
      const mockPayload = btoa(
        JSON.stringify({ sub: user.id, username: user.username, role: user.role })
      );
      const mockToken = `${mockHeader}.${mockPayload}.mock_signature_xyz123`;
      loginUser(mockToken, { id: user.id, username: user.username, role: user.role });
      navigate("/home");
    } else {
      setError("Invalid username or password.");
    }
  };

  return (
    <>
      <div className="login-container">
        <h3>Login</h3>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <form className="login-form" onSubmit={handleLoginSubmit}>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">Login</button>
        </form>
      </div>

      <div>
        Not a user? <button type="button">Sign up</button>
      </div>
    </>
  );
};