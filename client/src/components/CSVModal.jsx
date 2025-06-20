import { useState } from "react";
import { getMatchDurationText } from "../utility";
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
    function generateCombinedCSV(heartRateOne, heartRateTwo, scoreHistory){
        // Array to store combined JSON data to be parsed
        const allData = [];
    
        // Add heart rate data if selected and available
        if ((exportOptions.heartRateOptionOne && heartRateOne ) || (exportOptions.heartRateOptionTwo && heartRateTwo)) {
            // Process heart rate data for both players
            if (heartRateOne) {
                heartRateOne.forEach(entry => {
                    allData.push({
                        timestamp: `${matchDetails.date}T${entry.time}`,
                        time: entry.time,
                        value: entry.value,
                        details: `Heart rate: ${entry.value} bpm`
                    });
                });
            }

            if (heartRateTwo) {
                heartRateTwo.forEach(entry => {
                    allData.push({
                        timestamp: `${matchDetails.date}T${entry.time}`,
                        time: entry.time,
                        value: entry.value,
                        details: `Heart rate: ${entry.value} bpm`
                    });
                });
            }
        }

        // Add score history data if selected
        if (exportOptions.scoreHistoryOption && scoreHistory) {
            scoreHistory.forEach(entry => {
                allData.push({
                    timestamp: `${matchDetails.date}T${entry.time}`,
                    // timestamp: `T${entry.time}`,
                    time: entry.time,
                    value: entry.winner,
                    details: `${entry.winner} won the point`
                });
            });
        }

        // Sort all data by timestamp
        allData.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

        // Add match metadata as header rows
        const metadataRows = [
            {
                timestamp: getMatchDurationText(matchDetails.date),
                time: matchDetails.sport,
                value: `Players: ${players.map(p => p.name).join(' vs ')}`,
                details: matchDetails.duration ? `${Math.round(matchDetails.duration / 60000)} min` : 'N/A'
            },
            {
                timestamp: '',
                time: '',
                value: '',
                details: ''
            } // Empty row separator
        ];

        const finalData = [...metadataRows, ...allData];
        
        return Papa.unparse(finalData, {
            columns: ['timestamp', 'time', 'value', 'details']
        });
    };


    // Handle CSV save with file picker attempt
    const handleSaveCSV = async () => {
        if (!exportOptions.heartRateOptionOne && !exportOptions.heartRateOptionTwo && !exportOptions.scoreHistoryOption) {
            alert('Please select at least one data type to export');
            return;
        }

        const csvContent = generateCombinedCSV(heartRateOne, heartRateTwo, scoreHistory);
        const timestamp = new Date().toISOString().split('T')[0];
        const filename = `tracket_match_${matchDetails.sport}_${timestamp}.csv`; // tweak this

        // Try modern File System Access API first
        const fileSystemResult = await saveWithFileSystemAPI(csvContent, filename);
        
        if (fileSystemResult === true) {
            // Successfully saved with file picker
            alert('CSV file saved successfully!');
            onClose();
        } else if (fileSystemResult === null) {
            // User cancelled - do nothing
            return;
        } else {
            // Fallback to traditional download
            console.log('File System Access API not supported, using traditional download');
            downloadCSV(csvContent, filename);
            alert('CSV file downloaded to your Downloads folder');
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