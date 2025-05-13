import MatchList from "./MatchList";

export default function Dashboard(){
    return (
        <div className="dashboard-container">
            <h1 className="title-text">Dashboard (Previous Matches)</h1>
            <MatchList />
        </div>
    )
}