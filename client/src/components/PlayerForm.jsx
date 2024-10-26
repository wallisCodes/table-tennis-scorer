import { useState } from 'react'

export default function PlayerForm({players, addPlayer, matchDetails}){
    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [colour, setColour] = useState("#000000");
    
    function handleSubmit(event){
        event.preventDefault();
        addPlayer(name, age, colour);

        setName("");
        setAge("");
        setColour("#000000");
        // console.log(`players array: ${JSON.stringify(players)}`);
    }


    
    return (
        <>
            <form onSubmit={handleSubmit} className=""> 
                <fieldset className="">
                    <legend className="">Player details</legend>
                    <div className="">
                        <label htmlFor="player-name" className="">Full Name</label>
                        <input 
                            type="text"
                            id="player-name"
                            placeholder="Enter Name"
                            onChange={e => setName(e.target.value)}
                            value={name}
                            className=""
                            required
                        />
                    </div>
                    <div className="">
                        <label htmlFor="player-age" className="">Age</label>
                        <input 
                            type="number"
                            id="player-age"
                            placeholder="Enter Age"
                            onChange={e => setAge(e.target.value)}
                            value={age}
                            className=""
                            required
                        />
                    </div>
                    <div className="">
                        <label htmlFor="player-colour" className="">Team Colour</label>
                        <input 
                            type="color"
                            id="player-colour"
                            onChange={e => setColour(e.target.value)}
                            value={colour}
                            className=""
                            required
                        />
                    </div>
                    <button className="" disabled={matchDetails.matchType === "singles" ? players.length >= 2 : players.length >= 4}>Add Player</button>
                </fieldset>
            </form>
        </>
    )
}