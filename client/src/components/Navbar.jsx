import { logoutUser } from "../api";

export default function Navbar({user, setUser, matchStatus, toAuth, toInput, toScores, toResults}){
    // Function to handleLogout
    const handleLogout = async () => {
        const success = await logoutUser();
        if (success) {
            setUser(null); // Clear user state
        }

        // Navigate to correct page after logging out, depending on matchStatus
        if (matchStatus.current === "pending"){
            toInput();
        } else if (matchStatus.current === "active"){
            toScores();
        } else {
            toResults();
        }
    };
    
    return (
        <div className="navbar">
            <h2 className="nav-title">tRacket</h2>
            
            {/* Display login or logout button depending on user status */}
            {user ? 
                /* TODO: update onClick of Logout button to actually log user out!! */
                <button onClick={handleLogout} className="nav-auth-button">Logout</button> : 
                <button onClick={toAuth} className="nav-auth-button">Login</button>
            }
        </div>
    )
}