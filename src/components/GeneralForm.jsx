import { useState } from 'react'
import PlayerForm from './PlayerForm';

export default function GeneralForm({sport, setSport, matchType, setMatchType, bestOf, setBestOf, addPlayer}){
    function handleSubmit(event){
        event.preventDefault();
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
                            onChange={e => setSport(e.target.value)}
                            value={sport}
                            className=""
                            required
                        >
                            <option value="">Choose Sport</option>
                            <option value="table-tennis">Table Tennis</option>
                        </select>
                    </div>

                    <legend className="">Match Type</legend>
                    <input 
                        type="radio"
                        id="singles"
                        name="matchType"
                        value="singles"
                        checked={matchType === "singles"}
                        onChange={(e) => setMatchType(e.target.value)}
                    />
                    <label htmlFor="singles" className="">Singles</label>
                    <br />

                    <input 
                        type="radio"
                        id="doubles"
                        name="matchType"
                        value="doubles"
                        checked={matchType === "doubles"}
                        onChange={(e) => setMatchType(e.target.value)}
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
                        checked={bestOf === "1"}
                        onChange={(e) => setBestOf(e.target.value)}
                    />
                    <label htmlFor="bo1" className="">Best of 1</label>
                    <br />

                    <input 
                        type="radio"
                        id="bo3"
                        name="bestOf"
                        value="3"
                        checked={bestOf === "3"}
                        onChange={(e) => setBestOf(e.target.value)}
                    />
                    <label htmlFor="bo3" className="">Best of 3</label>
                    <br />
                </fieldset>
                    

                <PlayerForm 
                    addPlayer={addPlayer}
                />
                
                <button className="">Start Game</button>
                
            </form>
        </>
    )
}