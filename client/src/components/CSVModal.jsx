import { useState } from "react";
import { getCurrentDateText, getMatchDurationText } from "../utility";
import Papa from "papaparse";

export default function CSVModal({ isOpen, onClose, players, matchDetails, scoreHistory, heartRateOne, heartRateTwo }){
    const [exportOptions, setExportOptions] = useState({
        heartRateOptionOne: false,
        heartRateOptionTwo: false,
        scoreHistoryOption: true
    });


    // Modern File System Access API (Chrome/Edge only currently)
    const saveWithFileSystemAPI = async (csvContent, suggestedName) => {
        try {
            if ('showSaveFilePicker' in window) {
                const fileHandle = await window.showSaveFilePicker({
                suggestedName,
                types: [{
                    description: 'CSV files',
                    accept: { 'text/csv': ['.csv'] }
                    }]
                });
                
                const writable = await fileHandle.createWritable();
                await writable.write(csvContent);
                await writable.close();
                
                return true; // Success
            }
            return false; // API not supported

        } catch (error) {
            if (error.name === 'AbortError') {
                // User cancelled the dialog
                return null;
            }
            console.error('File save error:', error);
            return false;
        }
    };


    // Fallback: Traditional download (goes to Downloads folder)
    const downloadCSV = (csvContent, filename) => {
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url); // Clean up memory
    };


    // Generate combined CSV data
    function generateCombinedCSV(hrOne, hrTwo, scores) {
        const output = []; // Array to store combined JSON data to be parsed
        const timeToRow = {};

        // Add Player 1 HR data if selected and available
        if (exportOptions.heartRateOptionOne && hrOne) {
            hrOne.forEach(entry => {
                if (!timeToRow[entry.time]) {
                    timeToRow[entry.time] = {};
                }
                timeToRow[entry.time].hrOne = entry.value;
            });
        }

        // Add Player 2 HR data if selected and available
        if (exportOptions.heartRateOptionTwo && hrTwo) {
            hrTwo.forEach(entry => {
                if (!timeToRow[entry.time]) {
                    timeToRow[entry.time] = {};
                }
                timeToRow[entry.time].hrTwo = entry.value;
            });
        }

        // Add score history data if selected and available
        if (exportOptions.scoreHistoryOption && scores) {
            scores.forEach(entry => {
                if (!timeToRow[entry.time]) {
                    timeToRow[entry.time] = {};
                }
                timeToRow[entry.time].pointWinner = entry.winner;
            });
        }

        // Convert merged timeToRow map into rows
        const sortedTimes = Object.keys(timeToRow).sort();
        sortedTimes.forEach(time => {
            const row = timeToRow[time];
            output.push({
                Time: time,
                "HR One (bpm)": row.hrOne ?? '',
                "HR Two (bpm)": row.hrTwo ?? '',
                "Point winner": row.pointWinner ?? ''
            });
        });

        return Papa.unparse(output, {
            columns: ["Time", "HR One (bpm)", "HR Two (bpm)", "Point winner"]
        });
    }



    // Handle CSV save with file picker attempt
    const handleSaveCSV = async () => {
        if (!exportOptions.heartRateOptionOne && !exportOptions.heartRateOptionTwo && !exportOptions.scoreHistoryOption) {
            alert('Please select at least one data type to export');
            return;
        }

        const csvContent = generateCombinedCSV(heartRateOne, heartRateTwo, scoreHistory);
        // const timestamp = new Date().toISOString().split('T')[0];
        const timeSuffix = matchDetails.startTime.slice(0, 2) >= 12 ? "pm" : "am";
        const formattedStartTime = `${matchDetails.startTime.slice(0, 5)}${timeSuffix}`; // go from 16:07:13 to 16_07pm
        const filename = `${players[0].name} vs. ${players[1].name} (${matchDetails.sport}), ${getCurrentDateText(matchDetails.date)}, ${formattedStartTime} (${getMatchDurationText(matchDetails.duration)}).csv`; // tweak this

        // Try modern File System Access API first
        const fileSystemResult = await saveWithFileSystemAPI(csvContent, filename);
        
        if (fileSystemResult === true) {
            // Successfully saved with file picker
            onClose();
        } else if (fileSystemResult === null) {
            // User cancelled - do nothing
            return;
        } else {
            // Fallback to traditional download
            console.log('File System Access API not supported, using traditional download');
            downloadCSV(csvContent, filename);
            onClose();
        }
    };

    // if CSVModal is closed, no need to render anything
    if (!isOpen) return null;


    return (
        <div className="export-modal-container">
            <h2 className="modal-header">Save Match Data (.csv format)</h2>
            
            {/* Data Selection */}
            <div className="">
                <p className="">Select data to export:</p>

                {/* P1 Heart Rate checkbox */}
                <div className="export-checkbox">
                    <label htmlFor="hr-one-checkbox" className="">Heart Rate One</label>
                    <input
                        id="hr-one-checkbox"
                        type="checkbox"
                        checked={exportOptions.heartRateOptionOne}
                        onChange={(e) => setExportOptions(prev => ({
                            ...prev,
                            heartRateOptionOne: e.target.checked
                        }))}
                    />
                </div>
                
                {/* P2 Heart Rate checkbox */}
                <div className="export-checkbox">
                    <label htmlFor="hr-two-checkbox" className="">Heart Rate Two</label>
                    <input
                        id="hr-two-checkbox"
                        type="checkbox"
                        checked={exportOptions.heartRateOptionTwo}
                        onChange={(e) => setExportOptions(prev => ({
                            ...prev,
                            heartRateOptionTwo: e.target.checked
                        }))}
                    />
                </div>
                
                {/* Score History checkbox */}
                <div className="export-checkbox">
                    <label htmlFor="score-history-checkbox" className="">Score History</label>
                    <input
                        id="score-history-checkbox"
                        type="checkbox"
                        checked={exportOptions.scoreHistoryOption}
                        onChange={(e) => setExportOptions(prev => ({
                            ...prev,
                            scoreHistoryOption: e.target.checked
                        }))}
                    />
                </div>
            </div>

            {/* Info Box */}
            {/* <div className="">
                <p className="">
                    <strong>Note:</strong> All selected data will be combined into one CSV file. 
                    {('showSaveFilePicker' in window) 
                    ? ' You can choose where to save it.' 
                    : ' It will be saved to your Downloads folder.'}
                </p>
            </div> */}

            {/* Modal Buttons */}
            <div className="modal-buttons">
                <button
                    onClick={handleSaveCSV}
                    disabled={!exportOptions.heartRateOptionOne && !exportOptions.heartRateOptionTwo && !exportOptions.scoreHistoryOption}
                    className="modal-button"
                >
                    Save CSV
                </button>
                <button onClick={onClose} className="modal-button">Cancel</button>
            </div>
        </div>
    );
}