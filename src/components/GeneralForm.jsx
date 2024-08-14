import { useState } from 'react'

export default function GeneralForm({matchDetails, setMatchDetails, toScores, players}){
    // Simple form validation logic
    const correctPlayers = players.length === 2;

    function handleSubmit(event){
        event.preventDefault();

        if (!correctPlayers){
            alert("Make sure you have two players added below.");
        } else {
            console.log("Submitted general form");
            toScores();
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit} className="">
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
                            <option value="squash">Squash</option>
                            <option value="badminton">Badminton</option>
                            <option value="tennis">Tennis</option>
                        </select>
                    </div>

                    <legend className="">Match Type</legend>
                    <input 
                        type="radio"
                        id="singles"
                        name="matchType"
                        value="singles"
                        checked={matchDetails.matchType === "singles"}
                        onChange={(e) => setMatchDetails({
                            ...matchDetails,
                            matchType: e.target.value
                        })}
                    />
                    <label htmlFor="singles" className="">Singles</label>
                    <br />

                    <input 
                        type="radio"
                        id="doubles"
                        name="matchType"
                        value="doubles"
                        checked={matchDetails.matchType === "doubles"}
                        onChange={(e) => setMatchDetails({
                            ...matchDetails,
                            matchType: e.target.value
                        })}
                        disabled
                    />
                    <label htmlFor="doubles" className="">Doubles</label>
                    <br />

                    <legend className="">Match Format</legend>
                    <input 
                        type="radio"
                        id="bo1"
                        name="bestOf"
                        value="1"
                        checked={matchDetails.bestOf === "1"}
                        onChange={(e) => setMatchDetails({
                            ...matchDetails,
                            bestOf: e.target.value
                        })}
                    />
                    <label htmlFor="bo1" className="">Best of 1</label>
                    <br />

                    <input 
                        type="radio"
                        id="bo3"
                        name="bestOf"
                        value="3"
                        checked={matchDetails.bestOf === "3"}
                        onChange={(e) => setMatchDetails({
                            ...matchDetails,
                            bestOf: e.target.value
                        })}
                        disabled
                    />
                    <label htmlFor="bo3" className="">Best of 3</label>
                    <br />
                </fieldset>   
                <button className="">Start Game</button>
            </form>
        </>
    )
}