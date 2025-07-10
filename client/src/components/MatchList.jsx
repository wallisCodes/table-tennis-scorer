import { useEffect, useState } from "react";
import { getAllMatches, getPlayersByMatch, getPlayerById, getHeartRate } from "../api";
import MatchCard from "./MatchCard";

export default function MatchList(){
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                const matchesData = await getAllMatches();
                const matchesWithDetails = await Promise.all(matchesData.map(async (match) => {
                    // Fetch players for the match
                    const matchPlayers = await getPlayersByMatch(match.id);

                    // Fetch player details (name, colour, points)
                    const playersWithDetails = await Promise.all(matchPlayers.map(async (playerRecord) => {
                        const player = await getPlayerById(playerRecord.playerId);
                        return {
                            ...player,
                            finalScore: playerRecord.finalScore? playerRecord.finalScore : "Unknown" // Add final score from match-player record
                        };
                    }));

                    // Determine winner
                    const winner = playersWithDetails.find(player => player.id === match.winnerId);

                    // Check heart rate availability
                    const heartRateAvailability = await Promise.all(playersWithDetails.map(async (player) => {
                        const heartRateData = await getHeartRate(match.id, player.id);
                        return { playerId: player.id, hasHeartRate: heartRateData.length > 0 };
                    }));

                    return {
                        ...match,
                        players: playersWithDetails,
                        winner: winner ? winner.name : "Unknown",
                        heartRate: heartRateAvailability
                    };
                }));

                // console.log("matchesData:", matchesData);
                // console.log("matchesWithDetails:", matchesWithDetails);
                setMatches(matchesWithDetails);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching matches:", error);
            }
        };

        fetchMatches();
    }, []);

    if (loading) {
        return <p>Loading matches...</p>;
    }

    return (
        <div className="match-list">
            {matches.map(match => (
                <MatchCard key={match.id} match={match} />
            ))}
        </div>
    );
};