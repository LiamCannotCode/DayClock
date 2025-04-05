// Helper function to pad numbers
function pad(num) {
    return String(num).padStart(2, '0');
  }
  
  // Helper function to format a duration (in milliseconds) as hh:mm:ss
  function formatTime(duration) {
    let totalSeconds = Math.floor(duration / 1000);
    const hours = pad(Math.floor(totalSeconds / 3600));
    totalSeconds %= 3600;
    const minutes = pad(Math.floor(totalSeconds / 60));
    const seconds = pad(totalSeconds % 60);
    return `${hours}:${minutes}:${seconds}`;
  }
  
  // Alarm times and their associated sound file URLs
  const alarms = {
    "08:00": "sounds/morningAlarm.mp3",     // 8:00 AM morning alarm
    "12:00": "sounds/specialNoon.mp3",        // 12:00 PM special sound
    "14:00": "sounds/specialTwoPM.mp3",       // 2:00 PM special sound
    "20:00": "sounds/eveningAlarm.mp3",       // 8:00 PM end-of-day alarm
    "22:00": "sounds/bedtimeFirst.mp3",       // 10:00 PM bedtime first call
    "23:00": "sounds/bedtimeLast.mp3"         // 11:00 PM bedtime last call
  };
  
  // Variable to track the last minute when an alarm was played
  let lastAlarmMinute = "";
  
  // Function to play an alarm sound given a URL
  function playSound(url) {
    const audio = new Audio(url);
    audio.play().catch((error) => {
      console.error("Error playing sound:", error);
    });
  }
  
  // Main update function: updates the clock, the custom timer, and checks alarms
  function updateClock() {
    const now = new Date();
  
    // Display current time
    const hoursStr = pad(now.getHours());
    const minutesStr = pad(now.getMinutes());
    const secondsStr = pad(now.getSeconds());
    document.getElementById('current-time').textContent = `${hoursStr}:${minutesStr}:${secondsStr}`;
  
    // Alarm check: form current time in HH:MM format
    const currentMinuteStr = `${hoursStr}:${minutesStr}`;
    // Check if we haven't played an alarm this minute and if this minute is one of our alarm times
    if (currentMinuteStr !== lastAlarmMinute && alarms.hasOwnProperty(currentMinuteStr)) {
      // To trigger the alarm at the beginning of the minute, only play if seconds are "00"
      if (secondsStr === "00") {
        playSound(alarms[currentMinuteStr]);
        lastAlarmMinute = currentMinuteStr;
      }
    }
    // Reset lastAlarmMinute if minute changes (to allow future alarms)
    if (currentMinuteStr !== lastAlarmMinute && secondsStr !== "00") {
      lastAlarmMinute = "";
    }
  
    // Set key times for today
    const year = now.getFullYear();
    const month = now.getMonth(); // zero-indexed
    const day = now.getDate();
  
    const time8am = new Date(year, month, day, 8, 0, 0);
    const time8pm = new Date(year, month, day, 20, 0, 0);
    const time10pm = new Date(year, month, day, 22, 0, 0);
  
    let timerDisplay = "";
    let modeText = "";
  
    // Determine which period we are in
    if (now >= time8am && now < time8pm) {
      // From 8:00 am to 8:00 pm: countdown to 8:00 pm
      const diff = time8pm - now;
      timerDisplay = formatTime(diff);
      modeText = "Countdown to 8:00 PM";
    } else if (now >= time8pm && now < time10pm) {
      // From 8:00 pm to 10:00 pm: countdown to 10:00 pm
      const diff = time10pm - now;
      timerDisplay = formatTime(diff);
      modeText = "Countdown to 10:00 PM";
    } else {
      // From 10:00 pm to 8:00 am: count up from 10:00 pm.
      // For times after midnight (before 8:00 am), use yesterday's 10:00 pm.
      let startTime;
      if (now >= time10pm) {
        startTime = time10pm;
      } else {
        startTime = new Date(year, month, day - 1, 22, 0, 0);
      }
      const diff = now - startTime;
      timerDisplay = formatTime(diff);
      modeText = "Count up from 10:00 PM";
    }
  
    document.getElementById('timer').textContent = timerDisplay;
    document.getElementById('mode').textContent = `Mode: ${modeText}`;
  }
  
  // Start updating every second
  setInterval(updateClock, 1000);
  updateClock();