import Papa from "papaparse";
// DEDICATED FILE FOR UTILITY FUNCTIONS TO HELP DECLUTTER COMPONENTS

export function calcHRPercent(heartRate, age){
    return Math.round(heartRate * 100 / (220 - age));
}

export function chooseBackgroundColor(heartRatePercent){
    var bgColor = "";
    switch (true){
        case (0 <= heartRatePercent && heartRatePercent < 60):
            bgColor = "#c2cbca"; //grey
            break
        case (60 <= heartRatePercent && heartRatePercent < 70):
            bgColor = "#46c7ee"; //blue
            break
        case (70 <= heartRatePercent && heartRatePercent < 80):
            bgColor = "#9dbe4b"; //green
            break
        case (80 <= heartRatePercent && heartRatePercent < 90):
            bgColor = "#ffcb2d"; //yellow
            break
        case (90 <= heartRatePercent && heartRatePercent < 100):
            bgColor = "#de105b"; //red
            break
        case (100 <= heartRatePercent && heartRatePercent <= 150):
            bgColor = "#b100cd"; //purple
            break
        default: bgColor = "#c2cbca"; //grey
    }
    return {backgroundColor: bgColor};
}

export function chooseStatusColor(deviceStatus){
    var bgColor = "";
    switch (true){
        case (deviceStatus === "connected"):
            bgColor = "green";
            break
        case (deviceStatus === "disconnected"):
            bgColor = "red";
            break
        case (deviceStatus === "paused"):
            bgColor = "blue";
            break
        case (deviceStatus === "reconnecting" || deviceStatus === "connecting"):
            bgColor = "orange";
            break
        case (deviceStatus === "mock data"):
            bgColor = "lightseagreen";
            break
        default: bgColor = "red";
    }
    return {backgroundColor: bgColor};
}

// Calculate match duration as a unix timestamp from matchDetails start and end times
export function getMatchDuration(start, finish){
    const startTimestamp = new Date(`1970-01-01T${start}`).getTime();
    const finishTimestamp = new Date(`1970-01-01T${finish}`).getTime();
    const duration = new Date(finishTimestamp - startTimestamp);
    const matchDuration = duration.getTime(); // unix timestamp value in ms

    return matchDuration;
}

// Get current date in text format to be displayed inside Dashboard
export function getCurrentDateText(date){
// export function getCurrentDateText(){
    // const weekdayArray = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const weekdayArray = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dayArray = [
        "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th",
        "11th", "12th", "13th", "14th", "15th", "16th", "17th", "18th", "19th", "20th",
        "21st", "22nd", "23rd", "24th", "25th", "26th", "27th", "28th", "29th", "30th", "31st"
    ];
    const monthArray = [
        "January", "February", "March", "April", "May", "June", 
        "July", "August", "September", "October", "November", "December"
    ];

    // const fullDate = new Date();
    const fullDate = new Date(date * 1000);
    const weekdayText = weekdayArray[fullDate.getDay()];
    const dayText = dayArray[fullDate.getDate() - 1];
    const monthText = monthArray[fullDate.getMonth()];
    const year = fullDate.getFullYear();
    
    const currentDateText = `${weekdayText} ${dayText} ${monthText}, ${year}`;
    // const currentDate = fullDate.getTime();
    
    return currentDateText;
}

// Calculate match duration in text format from matchDetails start and end times (will be used in Dashboard)
export function getMatchDurationText(duration){
// export function getMatchDurationText(start, finish){
    // const startTimestamp = new Date(`1970-01-01T${start}`).getTime();
    // const finishTimestamp = new Date(`1970-01-01T${finish}`).getTime();
    // const duration = new Date(finishTimestamp - startTimestamp);

    const durationValue = new Date(duration);
    // debugging
    // console.log("durationValue:", durationValue);

    // Important to use UTC time here when displaying match duration to ignore daylight savings time offset
    const hours = durationValue.getUTCHours();
    // console.log("hours:", hours);
    const minutes = durationValue.getMinutes();
    const seconds = durationValue.getSeconds();
    let matchDurationText = "";

    // Choosing a duration text format based on hours, minutes and seconds
    // Conditional statements are laid out with the most common scenario first, least common scenario last
    if (hours === 0 && minutes > 0){
        matchDurationText = `${minutes} minute${minutes > 1 ? "s" : ""}`;
    } 
    else if (hours != 0 && minutes != 0){
        matchDurationText = `${hours}h ${minutes}m`;
    }
    else if (hours != 0 && minutes === 0){
        matchDurationText = `${hours} hour${hours > 1 ? "s" : ""}`;
    }
    else {
        matchDurationText = `${seconds} second${seconds > 1 ? "s" : ""}`;
    }

    return matchDurationText;
}

// Convert JSON data into CSV format (scoring)
export function generateScoreHistoryCSV(json){
    const csvData = Papa.unparse(json);
    console.log("csvData:", csvData);
    return csvData;
}