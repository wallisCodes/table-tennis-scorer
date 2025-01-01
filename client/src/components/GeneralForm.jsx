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
                            {/* <option value="tennis">Tennis</option> */}
                        </select>
                    </div>                    
                </fieldset>   
                <button className="">Start Game</button>
            </form>
        </>
    )
}