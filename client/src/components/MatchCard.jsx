import { getCurrentDateText, getMatchDurationText } from "../utility";

export default function MatchCard({ match }){
    return (
        <div className="match-overview-card">
            <h2>{`${match.sport} (Match ID: ${match.id})`}</h2>
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