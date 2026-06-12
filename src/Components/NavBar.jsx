import { Link } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";


const NavBar = () => {
    const { isAuthenticated, logoutUser, user } = useAuth();
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
                    <button onClick={handleLogOut}>Logout</button>
                </nav>  
                <hr />
            </header>
        </>
    )
}

export default NavBar;