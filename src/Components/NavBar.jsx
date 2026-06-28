import { Link } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";


const NavBar = () => {
    const { isAuthenticated, logoutUser, user } = useAuth();
    const { isDarkMode, toggleTheme } = useTheme(); 
    const navigate = useNavigate();

    const handleLogOut = () => {
        logoutUser();
        navigate("/login")
    }

    return (
        <>
            <header>
                <nav className='navBar'>
                    <Link to="/">Home</Link>
                    <Link to="/roster">Roster</Link>
                    <Link to="/compliance">Compliance</Link>
                    <Link to="/scheduler">Scheduler</Link>

                    <button onClick={toggleTheme} className="btn-global-theme">{isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}</button>
                    <button onClick={handleLogOut}>Logout</button>
                </nav>  
                <hr />
            </header>
        </>
    )
}

export default NavBar;