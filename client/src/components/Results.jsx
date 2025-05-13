import CombinedGraph from "./CombinedGraph";

export default function Results({players, matchDetails, heartRateOne, heartRateTwo, smoothHeartRateData, scoreHistory}){
    return (
        <>
            <div className="results-container">
                <h1 className="title-text">Results</h1>
                <div className="results-graph">
                    <CombinedGraph
                        matchDetails={matchDetails} 
                        players={players}
                        heartRateOne={heartRateOne}
                        heartRateTwo={heartRateTwo}
                        smoothHeartRateData={smoothHeartRateData}
                        scoreHistory={scoreHistory}
                    />
                </div>
            </div>
        </>
    )
}