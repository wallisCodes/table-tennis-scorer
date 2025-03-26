import React, { useState } from "react";
import { registerUser, loginUser, logoutUser, claimMatch } from "../api";

export default function AuthForm({ userIdRef, setUser, matchIdRef, matchDetails, setMatchDetails, matchStatus, toInput, toScores, toResults }){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginMode, setLoginMode] = useState(true); // Used to toggle between login/register forms

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Logic when logging in
        if (loginMode){
            const userData = await loginUser(email, password);
            userIdRef.current = userData.id;
            setUser(userData);

            // Check if match exists and needs to be claimed (i.e. has null userId)
            if (matchIdRef.current && !matchDetails.userId) {
                console.log("Attempting to claim match...");
                const claimedMatch = await claimMatch(matchIdRef.current, userIdRef.current);
                if (claimedMatch) {
                    setMatchDetails({
                        ...matchDetails,
                        userId: userIdRef.current
                    });
                }
            } 
            else {
                setMatchDetails({
                    ...matchDetails,
                    userId: userIdRef.current
                });
            }

            // Navigate to correct page after logging in, depending on matchStatus
            if (matchStatus.current === "pending"){
                toInput();
            } else if (matchStatus.current === "active"){
                toScores();
            } else {
                toResults();
            }
        
        // Logic when registering
        } else {
            userIdRef.current = await registerUser(email, password);
            console.log("Register userIdRef:", userIdRef.current);
            setMatchDetails({
                ...matchDetails,
                userId: userIdRef.current
            });
            setLoginMode(true);
        }
    };

    return (
        <div className="auth-container">
            <h2 className="auth-heading">{loginMode ? "Login" : "Register"}</h2>
            <form onSubmit={handleSubmit} className="auth-form">
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit" className="auth-button">
                    {loginMode ? "Login" : "Register"}
                </button>
            </form>
            <p>
                {loginMode
                    ? "Don't have an account? Register "
                    : "Already have an account? Login "}
                <span onClick={() => setLoginMode(!loginMode)} className="auth-toggle">here</span>.
            </p>
            <button onClick={logoutUser} className="auth-button">Logout</button>
        </div>
    );
};