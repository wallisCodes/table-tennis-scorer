import { getCurrentDateText, getMatchDurationText } from "../utility";

export default function MatchCard({ match }){
    // Delete specific match from database - delete match, matchPlayers, scores, relevant HRs and players too?
    // Don't delete players, that will interfere with other matches they are involved with
    function deleteMatchCard(){
        console.log(`Deleted match with match ID: ${match.id}`);
    }
    
    return (
        <div className="match-overview-card">
            <div className="match-card-banner">
                <h2>{`${match.sport} (Match ID: ${match.id})`}</h2>
                <svg onClick={() => deleteMatchCard(match.id)} className="dashboard-icon" clipRule="evenodd" fillRule="evenodd" strokeLinejoin="round" strokeMiterlimit="2" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                    <path d="m21 3.998c0-.478-.379-1-1-1h-16c-.62 0-1 .519-1 1v16c0 .621.52 1 1 1h16c.478 0 1-.379 1-1zm-16.5.5h15v15h-15zm7.491 6.432 2.717-2.718c.146-.146.338-.219.53-.219.404 0 .751.325.751.75 0 .193-.073.384-.22.531l-2.717 2.717 2.728 2.728c.147.147.22.339.22.531 0 .427-.349.75-.75.75-.192 0-.385-.073-.531-.219l-2.728-2.728-2.728 2.728c-.147.146-.339.219-.531.219-.401 0-.75-.323-.75-.75 0-.192.073-.384.22-.531l2.728-2.728-2.722-2.722c-.146-.147-.219-.338-.219-.531 0-.425.346-.749.75-.749.192 0 .384.073.53.219z" fill-rule="nonzero"/>
                </svg>
            </div>
            <p><strong>{getCurrentDateText(match.date)}</strong></p>
            <p><strong>Duration:</strong> {match.matchDuration ? getMatchDurationText(match.matchDuration) : "N/A"}</p>
            <p><strong>Winner:</strong> {match.winner}</p>

            <h3 className="players-card-title">Players:</h3>
            <div className="players">
                {match.players.map(player => (
                    <div key={player.id} className="player-info">
                        <p><strong>{player.name}</strong></p>
                        <p>Final Score: {player.finalScore}</p>
                        <p>Heart Rate Data: {match.heartRate.find(hr => hr.playerId === player.id)?.hasHeartRate ? "✅ Available" : "❌ Not Recorded"}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};