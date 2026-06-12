import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Components/AuthContext"; // Adjust path accordingly
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

    try {
      const user = mockUsers.find(
        (u) => u.username.toLowerCase() === userName.toLowerCase() && u.password === password
      );

        if (user) {
            const mockHeader = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
            const mockPayload = btoa(JSON.stringify({ sub: user.id, username: user.username, role: user.role }));
            const mockSignature = "mock_signature_xyz123";
            const mockJwtToken = `${mockHeader}.${mockPayload}.${mockSignature}`;

            loginUser(mockJwtToken, { id: user.id, username: user.username, role: user.role });
            navigate("/home");
        } else {
            setError("Invalid username or password.");
      }
    } catch (err) {
        setError("Something went wrong during authentication.");
    }
  };

  return (
    <>
      <div className="login-container">
        <h3>Login:</h3>
        
        { error && <p style={{ color: "red" }}>{error}</p>}

        <form className="login-form" onSubmit={handleLoginSubmit}>
          <label htmlFor="username">UserName: </label>
          <input 
            type="text" 
            value={userName} 
            onChange={(e) => setUserName(e.target.value)} 
          />
          <br />
          <label htmlFor="password">Password:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
          <br />
          <button type="submit">Login</button>
        </form>
      </div>
      <div>
        Not a user? Signup here: <button>SignUp</button>
      </div>
    </>
    
  );
};