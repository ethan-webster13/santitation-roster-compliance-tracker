import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const base64Payload = token.split(".")[1];
        const payload = JSON.parse(atob(base64Payload));
        setUser({ id: payload.sub, username: payload.username, role: payload.role });
      } catch (e) {
        localStorage.removeItem("token"); // Clear corrupt token
      }
    }
    setLoading(false);
  }, []);

  const loginUser = (mockJwtToken, userData) => {
    localStorage.setItem("token", mockJwtToken);
    setUser(userData);
  };

  const logoutUser = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, user, loginUser, logoutUser, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => useContext(AuthContext);