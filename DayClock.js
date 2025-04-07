// Helper function to pad numbers
function pad(num) {
  return String(num).padStart(2, '0');
}

// Helper function to format a duration (in milliseconds) as h:mm
function formatTime(duration) {
  duration += 60000; // Add 1 minute (60,000 milliseconds)
  let totalSeconds = Math.floor(duration / 1000);
  const hours = Math.floor(totalSeconds / 3600); // No leading zero for hours
  totalSeconds %= 3600;
  const minutes = pad(Math.floor(totalSeconds / 60));
  return `${hours}:${minutes}`; // Exclude seconds
}

// Function to update the progress circle
function updateCircle(progress) {
  const circle = document.querySelector('.progress-ring');
  const radius = 45; // Radius of the circle
  const circumference = 2 * Math.PI * radius; // Circumference of the circle
  const offset = circumference - (progress / 100) * circumference; // Calculate offset for clockwise direction
  circle.style.strokeDasharray = `${circumference} ${circumference}`; // Set the dash array
  circle.style.strokeDashoffset = offset; // Set the dash offset to show progress
}

// Main update function: updates the clock, the custom timer, and checks alarms
function updateClock() {
  const now = new Date();

  // Display current time in 12-hour format with AM/PM
  let hours = now.getHours();
  const minutes = pad(now.getMinutes());
  const period = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12; // Convert to 12-hour format (0 becomes 12)
  document.getElementById('current-time').textContent = `${hours}:${minutes}`;
  document.getElementById('period').textContent = period;

  // Set key times for today
  const year = now.getFullYear();
  const month = now.getMonth(); // zero-indexed
  const day = now.getDate();

  const time8am = new Date(year, month, day, 8, 0, 0); // 8:00 AM
  const time725pm = new Date(year, month, day, 19, 25, 0); // 7:25 PM
  const time10pm = new Date(year, month, day, 22, 0, 0); // 10:00 PM
  const time8amNextDay = new Date(year, month, day + 1, 8, 0, 0); // For the next day, 8 AM

  let timerDisplay = "";
  let progress = 0;

  // Determine which period we are in
  if (now >= time8am && now < time725pm) {
    // From 8:00 AM to 7:25 PM: countdown to 7:25 PM
    const diff = time725pm - now;
    progress = ((time725pm - now) / (time725pm - time8am)) * 100; // Calculate progress as percentage
    timerDisplay = formatTime(diff);
    document.querySelector('.progress-ring').style.stroke = "#ffffff"; // White color
  } else if (now >= time725pm && now < time10pm) {
    // From 7:25 PM to 10:00 PM: countdown to 10:00 PM
    const diff = time10pm - now;
    progress = ((time10pm - now) / (time10pm - time725pm)) * 100;
    timerDisplay = formatTime(diff);
    document.querySelector('.progress-ring').style.stroke = "#ffffff"; // White color
  } else {
    // From 10:00 PM to 8:00 AM: count up from 10:00 PM.
    let startTime = now >= time10pm ? time10pm : time8amNextDay;
    const diff = now - startTime;
    progress = ((now - time10pm) / (time8amNextDay - time10pm)) * 100; // Count up from 10 PM to 8 AM
    timerDisplay = formatTime(diff);
    document.querySelector('.progress-ring').style.stroke = "#ff4500"; // Red color (Pomodoro app color)
  }

  // Update the circle's visual progress
  updateCircle(progress);

  // Update the timer text
  document.getElementById('timer').textContent = timerDisplay;
}

// Start updating every second
setInterval(updateClock, 1000);
updateClock();
