import { createPlayers } from "../api";

export default function GeneralForm({players, playerIdsRef, matchDetails, setMatchDetails, toScores}){
    // Simple form validation logic
    const correctPlayers = players.length === 2;

    async function handleSubmit(event){
        event.preventDefault();
        if (!correctPlayers){
            alert("Make sure you have two players added below.");
        } else {
            playerIdsRef.current = await createPlayers(players);
            toScores();
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit} className="general-form">
                <fieldset className="">
                    <legend className="">General details</legend>
                    <div className="">
                        <label htmlFor="sport-choice" className="">Sport choice</label>
                        <select 
                            id="sport-choice"
                            onChange={e => setMatchDetails({
                                ...matchDetails,
                                sport: e.target.value
                            })}
                            value={matchDetails.sport}
                            className=""
                            required
                        >
                            <option value="">Choose Sport</option>
                            <option value="table-tennis">Table Tennis</option>
                            <option value="badminton">Badminton</option>
                            <option value="squash">Squash</option>
                            {/* <option value="tennis">Tennis</option> */}
                        </select>
                    </div>                    
                </fieldset>   
                <button className="">Start Game</button>
            </form>

            {/* Only allow navigation if players have been chosen / matchStatus != pending */}
            {(playerIdsRef.current) && 
                <svg onClick={toScores} className="next-button" width="48" height="48" clipRule="evenodd" fillRule="evenodd" strokeLinejoin="round" strokeMiterlimit="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="m13.022 14.999v3.251c0 .412.335.75.752.75.188 0 .375-.071.518-.206 1.775-1.685 4.945-4.692 6.396-6.069.2-.189.312-.452.312-.725 0-.274-.112-.536-.312-.725-1.451-1.377-4.621-4.385-6.396-6.068-.143-.136-.33-.207-.518-.207-.417 0-.752.337-.752.75v3.251h-9.02c-.531 0-1.002.47-1.002 1v3.998c0 .53.471 1 1.002 1z" fillRule="nonzero"/>
                </svg>
            }            
        </>
    )
}