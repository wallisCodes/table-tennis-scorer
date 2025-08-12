import { useState } from "react";
import CSVModal from "./CSVModal";
import { getCurrentDateText, getMatchDurationText } from "../utility";
import { deleteMatch, getScoreHistory, getHeartRate } from "../api";

export default function MatchCard({ match, setMatches }){
    // Defining state
    const [showCSVModal, setShowCSVModal] = useState(false);
    const [csvData, setCsvData] = useState(null); // Cache per card
    const [showDeleteModal, setShowDeleteModal] = useState(false);


    async function handleExportClick() {
        try {
            if (!csvData) {
                const [scoreHistory, heartRateOne, heartRateTwo] = await Promise.all([
                    getScoreHistory(match.id),
                    getHeartRate(match.id, match.players[0].id),
                    getHeartRate(match.id, match.players[1].id)
                ]);

                setCsvData({
                    players: match.players,
                    matchDetails: {
                        date: match.date,
                        startTime: match.startTime,
                        duration: match.matchDuration,
                        sport: match.sport
                    },
                    scoreHistory,
                    heartRateOne,
                    heartRateTwo
                });

            } 
            setShowCSVModal(true); // show regardless of cached data
        } catch (error) {
            console.error("Error preparing CSV export:", error);
        }
    }


    return (
        <div className="match-overview-card">
            <div className="match-card-banner">
                <h2>{`${match.sport} (Match ID: ${match.id})`}</h2>
                <button className="export-btn" onClick={handleExportClick}>
                    Export
                </button>

                <svg onClick={async () => {
                    setShowDeleteModal(true);
                }}
                    className="dashboard-icon"
                    clipRule="evenodd"
                    fillRule="evenodd"
                    strokeLinejoin="round"
                    strokeMiterlimit="2" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                    <path d="m21 3.998c0-.478-.379-1-1-1h-16c-.62 0-1 .519-1 1v16c0 .621.52 1 1 1h16c.478 0 1-.379 1-1zm-16.5.5h15v15h-15zm7.491 6.432 2.717-2.718c.146-.146.338-.219.53-.219.404 0 .751.325.751.75 0 .193-.073.384-.22.531l-2.717 2.717 2.728 2.728c.147.147.22.339.22.531 0 .427-.349.75-.75.75-.192 0-.385-.073-.531-.219l-2.728-2.728-2.728 2.728c-.147.146-.339.219-.531.219-.401 0-.75-.323-.75-.75 0-.192.073-.384.22-.531l2.728-2.728-2.722-2.722c-.146-.147-.219-.338-.219-.531 0-.425.346-.749.75-.749.192 0 .384.073.53.219z" fillRule="nonzero"/>
                </svg>
            </div>

            {(showCSVModal && csvData) && (
                <>
                    <div onClick={() => setShowCSVModal(false)} className="export-modal-overlay"/>
                    <CSVModal
                        isOpen={showCSVModal}
                        onClose={() => setShowCSVModal(false)}
                        {...csvData}
                    />
                </>
            )}

            {showDeleteModal && (
                <div onClick={() => setShowDeleteModal(false)} className="export-modal-overlay">
                    <div className="export-modal-container">
                        <h2>Are you sure you want to delete this match?</h2>
                        <div className="modal-buttons">
                            <button onClick={() => setShowDeleteModal(false)} className="modal-button">Cancel</button>
                            <button 
                                onClick={async () => {
                                    await deleteMatch(match.id);
                                    setMatches(prev => prev.filter(m => m.id !== match.id)); // Optimistic delete
                                    setShowDeleteModal(false);
                                }}
                                className="modal-button"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
            

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