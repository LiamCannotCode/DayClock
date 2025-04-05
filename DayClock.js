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

// Function to update the progress circle
function updateCircle(progress) {
  const circle = document.querySelector('.progress-ring');
  const radius = 45; // Radius of the circle
  const circumference = 2 * Math.PI * radius; // Circumference of the circle
  const offset = circumference - (progress / 100) * circumference; // Calculate offset based on progress
  circle.style.strokeDasharray = `${circumference} ${circumference}`; // Set the dash array
  circle.style.strokeDashoffset = offset; // Set the dash offset to show progress
}

// Main update function: updates the clock, the custom timer, and checks alarms
function updateClock() {
  const now = new Date();

  // Display current time
  const hoursStr = pad(now.getHours());
  const minutesStr = pad(now.getMinutes());
  const secondsStr = pad(now.getSeconds());
  document.getElementById('current-time').textContent = `${hoursStr}:${minutesStr}:${secondsStr}`;

  // Set key times for today
  const year = now.getFullYear();
  const month = now.getMonth(); // zero-indexed
  const day = now.getDate();

  const time8am = new Date(year, month, day, 8, 0, 0);
  const time8pm = new Date(year, month, day, 20, 0, 0);
  const time10pm = new Date(year, month, day, 22, 0, 0);
  const time8amNextDay = new Date(year, month, day + 1, 8, 0, 0); // For the next day, 8 AM

  let timerDisplay = "";
  let modeText = "";
  let progress = 0;

  // Determine which period we are in
  if (now >= time8am && now < time8pm) {
    // From 8:00 am to 8:00 pm: countdown to 8:00 pm
    const diff = time8pm - now;
    progress = ((time8pm - now) / (time8pm - time8am)) * 100; // Calculate progress as percentage
    timerDisplay = formatTime(diff);
    modeText = "Countdown to 8:00 PM";
  } else if (now >= time8pm && now < time10pm) {
    // From 8:00 pm to 10:00 pm: countdown to 10:00 pm
    const diff = time10pm - now;
    progress = ((time10pm - now) / (time10pm - time8pm)) * 100;
    timerDisplay = formatTime(diff);
    modeText = "Countdown to 10:00 PM";
  } else {
    // From 10:00 pm to 8:00 am: count up from 10:00 pm.
    let startTime = now >= time10pm ? time10pm : time8amNextDay;
    const diff = now - startTime;
    progress = ((now - time10pm) / (time8amNextDay - time10pm)) * 100; // Count up from 10 PM to 8 AM
    timerDisplay = formatTime(diff);
    modeText = "Count up from 10:00 PM";
  }

  // Update the circle's visual progress
  updateCircle(progress);

  // Update the timer and mode text
  document.getElementById('timer').textContent = timerDisplay;
  document.getElementById('mode').textContent = modeText;
}

// Start updating every second
setInterval(updateClock, 1000);
updateClock();
