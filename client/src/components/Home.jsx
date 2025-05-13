import { Link } from 'react-router-dom';

export default function Home({ }){
    return (
        <>
            <h1 className="home-title">What would you like to do?</h1>
            <div className="home-links">
                <Link to="/create" className="match-start-button">Create Match</Link>
                <Link to="/dashboard" className="match-start-button">View Previous Matches</Link>
            </div>
        </>
    )
}