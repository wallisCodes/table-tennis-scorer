import { useNavigate, Link } from "react-router-dom";
import { logoutUser } from "../api";

export default function Navbar({user, setUser, matchStatus}){
    // Function to handleLogout
    const handleLogout = async () => {
        const success = await logoutUser();
        if (success) {
            setUser(null); // Clear user state
        }

        let navigate = useNavigate();

        // Navigate to correct page after logging out, depending on matchStatus
        if (matchStatus.current === "pending"){
            navigate("/create");
        } else if (matchStatus.current === "active"){
            navigate("/scores");
        } else {
            navigate("/results");
        }
    };
    
    return (
        <div className="navbar">
            <h2 className="nav-title">tRacket</h2>
            
            {/* TODO: Make this a hamburger menu for app navigation */}
            <nav>
                <ul className="nav-links">
                    <li className="nav-link"><Link to="/">Home</Link></li>
                    <li className="nav-link"><Link to="/create">Create</Link></li>
                    <li className="nav-link"><Link to="/scores">Scores</Link></li>
                    <li className="nav-link"><Link to="/results">Results</Link></li>
                    {/* TODO: Navigate to auth/dashboard depending on user status */}
                    <li className="nav-link"><Link to="/dashboard">Dashboard</Link></li>
                </ul>
            </nav>

            {/* Display login or logout button depending on user status */}
            {user ? 
                /* TODO: update onClick of Logout button to actually log user out!! */
                <button onClick={handleLogout} className="nav-auth-button">Logout</button> : 
                <Link to="/auth" className="nav-auth-button">Login</Link>
            }
        </div>
    )
}