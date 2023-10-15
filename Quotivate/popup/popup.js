document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('homeNav').click();
});

// Reminder section
const reminderSection = document.getElementById('reminderSection');
const reminderNav = document.getElementById('reminderNav');

// Pomodoro section
const pomodoroSection = document.getElementById('pomodoroSection');
const pomodoroNav = document.getElementById('pomodoroNav');

// YouTube Integration section
const youtubeSection = document.getElementById('youtubeSection');
const youtubeNav = document.getElementById('youtubeNav');

// Website Blocking section
const blockSiteSection = document.getElementById('blockSiteSection');
const blockSiteNav = document.getElementById('blockSiteNav');

// Motivational Quotes section
const quoteSection = document.getElementById('quoteSection');
const quoteNav = document.getElementById('quoteNav');

// Home section
const homeSection = document.getElementById('homeSection');
const homeNav = document.getElementById('homeNav');

// Add event listeners to the sidebar
reminderNav.addEventListener('click', () => {
  reminderSection.style.display = 'block';
  pomodoroSection.style.display = 'none';
  youtubeSection.style.display = 'none';
  blockSiteSection.style.display = 'none';
  quoteSection.style.display = 'none';
  homeSection.style.display = 'none';
});

pomodoroNav.addEventListener('click', () => {
  reminderSection.style.display = 'none';
  pomodoroSection.style.display = 'block';
  youtubeSection.style.display = 'none';
  blockSiteSection.style.display = 'none';
  quoteSection.style.display = 'none';
  homeSection.style.display = 'none';
});

youtubeNav.addEventListener('click', () => {
  reminderSection.style.display = 'none';
  pomodoroSection.style.display = 'none';
  youtubeSection.style.display = 'block';
  blockSiteSection.style.display = 'none';
  quoteSection.style.display = 'none';
  homeSection.style.display = 'none';
});

blockSiteNav.addEventListener('click', () => {
  reminderSection.style.display = 'none';
  pomodoroSection.style.display = 'none';
  youtubeSection.style.display = 'none';
  blockSiteSection.style.display = 'block';
  quoteSection.style.display = 'none';
  homeSection.style.display = 'none';
});

quoteNav.addEventListener('click', () => {
  reminderSection.style.display = 'none';
  pomodoroSection.style.display = 'none';
  youtubeSection.style.display = 'none';
  blockSiteSection.style.display = 'none';
  quoteSection.style.display = 'block';
  homeSection.style.display = 'none';
});

homeNav.addEventListener('click', () => {
  reminderSection.style.display = 'none';
  pomodoroSection.style.display = 'none';
  youtubeSection.style.display = 'none';
  blockSiteSection.style.display = 'none';
  quoteSection.style.display = 'none';
  homeSection.style.display = 'block';
});

reminderSection.style.display = 'block';
pomodoroSection.style.display = 'none';
youtubeSection.style.display = 'none';
blockSiteSection.style.display = 'none';
quoteSection.style.display = 'none';
homeSection.style.display = 'none';



// Reminder section
const reminderInput = document.getElementById('reminderInput');
const dueDateInput = document.getElementById('dueDateInput');
const dueTimeInput = document.getElementById('dueTimeInput');
const setReminderButton = document.getElementById('setReminderButton');
const reminderList = document.getElementById('reminderList');


let reminders = []; // Array to store reminders

chrome.storage.local.get('reminders', (result) => {
  reminders = result.reminders || [];
  displayReminders();
});

setReminderButton.addEventListener('click', () => {
  const task = reminderInput.value;
  const dueDate = dueDateInput.value;
  const dueTime = dueTimeInput.value;

  if (task && dueDate && dueTime) {
    const reminder = {
      task,
      dueDate,
      dueTime,
    };

    reminders.push(reminder);
    chrome.storage.local.set({ reminders }, () => {
      // Call the function in background.js to create the ReminderAlarm alarm
      chrome.runtime.sendMessage({ createReminderAlarm: true, dueDate, dueTime });

      displayReminders();
    });
  } else {
    alert('Please enter both a task, due date, and due time.');
  }
});


function displayReminders() {
  reminderList.innerHTML = '';

  reminders.forEach((reminder, index) => {
    const reminderItem = document.createElement('div');
    reminderItem.classList.add('reminder-item');
    
    const taskContainer = document.createElement('div');
    taskContainer.classList.add('task-container');
    taskContainer.innerHTML = `
      <span>${reminder.task}, Due Date: ${reminder.dueDate}, Due Time: ${reminder.dueTime}</span>
    `;

    const buttonsContainer = document.createElement('div');
    buttonsContainer.classList.add('buttons-container');
    buttonsContainer.innerHTML = `
      <button class="edit-reminder" data-index="${index}">✎</button>
      <button class="delete-reminder" data-index="${index}">✖</button>
    `;

    reminderItem.appendChild(taskContainer);
    reminderItem.appendChild(buttonsContainer);

    reminderList.appendChild(reminderItem);
  });


  const editButtons = document.querySelectorAll('.edit-reminder');
  const deleteButtons = document.querySelectorAll('.delete-reminder');

  editButtons.forEach((editButton) => {
    editButton.addEventListener('click', (e) => {
      const index = e.target.getAttribute('data-index');
      editReminder(index);
    });
  });

  deleteButtons.forEach((deleteButton) => {
    deleteButton.addEventListener('click', (e) => {
      const index = e.target.getAttribute('data-index');
      deleteReminder(index);
    });
  });
}

function editReminder(index) {
  const reminder = reminders[index];

  reminderInput.value = reminder.task;
  dueDateInput.value = reminder.dueDate;
  dueTimeInput.value = reminder.dueTime;

  reminders.splice(index, 1);

  chrome.storage.local.set({ reminders }, () => {
    displayReminders();
  });
}

function deleteReminder(index) {
  reminders.splice(index, 1);
  chrome.storage.local.set({ reminders }, () => {
    displayReminders();
  });
}





//pomodoro section
let tasks = [];

function secondsToTime(t, tMax) {
  const change = tMax * 60 - t;
  if (change < 0) 
      return "Finished";
  const m = Math.floor((change % 3600) / 60)
      .toString()
      .padStart(2, "0"),
    s = Math.floor(change % 60)
      .toString()
      .padStart(2, "0");
  return m + ":" + s;
}

const time = document.getElementById("time");
const startCustomTimerBtn = document.getElementById("start-customtimer-btn");
const customTimeInput = document.getElementById("customTime");

startCustomTimerBtn.addEventListener("click", () => {
  const customTime = parseInt(customTimeInput.value, 10);

  if (customTime > 0) {
    chrome.storage.local.set({ timeOption: customTime });
    updateTime();
  } else {
    alert("Please enter a valid custom timer duration (greater than 0).");
  }
});


function updateTime() {
  chrome.storage.local.get(["timer", "timeOption"]).then((res) => {
    time.textContent = secondsToTime(res.timer, res.timeOption);
  });
}

updateTime();
setInterval(() => {
  updateTime();
}, 1000);

chrome.storage.local.get(["isRunning"]).then((res) => {
  startTimerBtn.textContent = res.isRunning ? "◼" : "▶";
});

const startTimerBtn = document.getElementById("start-timer-btn");
startTimerBtn.addEventListener("click", () => {
  chrome.storage.local.get(["isRunning"]).then((res) => {
    chrome.storage.local.set({ isRunning: !res.isRunning });
    startTimerBtn.textContent = res.isRunning ? "▶" : "◼";
  });
});

const resetTimerBtn = document.getElementById("reset-timer-btn");
resetTimerBtn.addEventListener("click", () => {
  chrome.storage.local.set({
    timer: 0,
    isRunning: false,
  });
  startTimerBtn.textContent = "▶";
});

const addTaskBtn = document.getElementById("add-task-btn");

addTaskBtn.addEventListener("click", () => {
  addTask();
});

chrome.storage.sync.get(["tasks"]).then((res) => {
  tasks = res.tasks ?? [];
  renderTasks();
});

function saveTasks() {
  chrome.storage.sync.set({ tasks });
}

function renderTask(taskNum) {
  const taskRow = document.createElement("div");

  const text = document.createElement("input");
  text.type = "text";
  text.placeholder = "Enter task here ...";
  text.value = tasks[taskNum];
  text.addEventListener("change", () => {
    tasks[taskNum] = text.value;
    saveTasks();
  });

  const deleteBtn = document.createElement("input");
  deleteBtn.type = "button";
  deleteBtn.value = "X";
  deleteBtn.addEventListener("click", () => {
    deleteTask(taskNum);
  });

  taskRow.appendChild(text);
  taskRow.appendChild(deleteBtn);

  const taskContainer = document.getElementById("task-container");
  taskContainer.appendChild(taskRow);
}

function addTask() {
  const taskNum = tasks.length;
  tasks.push("");
  renderTask(taskNum);
  saveTasks();
}

function deleteTask(taskNum) {
  tasks.splice(taskNum, 1);
  renderTasks();
  saveTasks();
}

function renderTasks() {
  const taskContainer = document.getElementById("task-container");
  taskContainer.textContent = "";
  tasks.forEach((taskText, TaskNum) => {
    renderTask(TaskNum);
  });
}






// YouTube Integration
const youtubeUrlInput = document.getElementById('youtubeUrlInput');
const playYoutubeButton = document.getElementById('playYoutubeButton');
const youtubeIframe = document.getElementById('youtubeIframe');

playYoutubeButton.addEventListener('click', () => {
  const youtubeUrl = youtubeUrlInput.value;

  // Check if the URL is from YouTube
  if (isYouTubeUrl(youtubeUrl)) {
    const videoId = extractVideoId(youtubeUrl);

    if (videoId) {
      const videoUrl = `https://www.youtube.com/embed/${videoId}`;
      youtubeIframe.src = videoUrl;
    } 
    
    else {
      alert('Invalid YouTube URL. Please enter a valid YouTube video URL.');
    }

  } else {
    alert('Invalid YouTube URL. Please enter a valid YouTube video URL.');
  }
});


function isYouTubeUrl(url) {
  const youtubePattern = /^(https?:\/\/)?(www\.)?youtube\.com/i;
  return youtubePattern.test(url);
}

function extractVideoId(url) {
  const match = url.match(/(?:\?v=|\/embed\/|\/\d\/|\/vi\/|\/e\/|v\/|\/t\/|\/[^/]+\/[^/]+\/|[^/?]+?\/)?([^/?&]{11})/);
  return match && match[1];
}




// Website Blocking
function save() {
  const name1 = document.getElementById("textbox").value.toLowerCase();
  const name2 = document.getElementById("textbox2").value.toLowerCase();
  const name3 = document.getElementById("textbox3").value.toLowerCase();
  const name4 = document.getElementById("textbox4").value.toLowerCase();
  const name5 = document.getElementById("textbox5").value.toLowerCase();

  const blockedWebsites = [name1, name2, name3, name4, name5].filter(Boolean);

  chrome.storage.local.set({ websites: blockedWebsites }, function() {
    updateErrorMessage('Websites saved.');
  });
}

function clear() {
  chrome.storage.local.remove('websites', function() {
    updateErrorMessage('Blocked websites cleared.');
  });

  document.getElementById('textbox').value = '';
  document.getElementById('textbox2').value = '';
  document.getElementById('textbox3').value = '';
  document.getElementById('textbox4').value = '';
  document.getElementById('textbox5').value = '';
  document.getElementById('textbox').placeholder = placeholder_link;
  document.getElementById('textbox2').placeholder = placeholder_link;
  document.getElementById('textbox3').placeholder = placeholder_link;
  document.getElementById('textbox4').placeholder = placeholder_link;
  document.getElementById('textbox5').placeholder = placeholder_link;
}

function updateErrorMessage(message) {
  document.getElementById('errorMessage').innerHTML = message;
}

function parseLink(url) {
  const url_pattern1 = /^[www]+\./;
  return url_pattern1.test(url);
}

function parseCurrent(url) {
  const hostname = new URL(url).hostname;
  return hostname.replace('www.', ''); 
}

function checkAndRedirect() {
  chrome.storage.local.get(['websites'], function (items) {
     const blockedWebsites = items.websites || [];
     const currentURL = new URL(window.location.href);
     const currentHostname = currentURL.hostname.replace('www.', '');
 
     if (blockedWebsites.includes(currentHostname)) {
       window.location.replace('https://thiswebappisblocked.deepthiinduri.repl.co/');
     }
  });
 }
 

 setInterval(checkAndRedirect, 1000);

window.onload = function() {
  document.getElementById('submitButton').onclick = save;
  document.getElementById('clearButton').onclick = clear;
  displaySavedURLs();
};

function displaySavedURLs() {
  chrome.storage.local.get(['websites'], function(items) {
    const blockedWebsites = items.websites || [];

    document.getElementById('textbox').value = blockedWebsites[0] || '';
    document.getElementById('textbox2').value = blockedWebsites[1] || '';
    document.getElementById('textbox3').value = blockedWebsites[2] || '';
    document.getElementById('textbox4').value = blockedWebsites[3] || '';
    document.getElementById('textbox5').value = blockedWebsites[4] || '';
  });
}











// Motivational Quotes
const motivationalQuote = document.getElementById('motivationalQuote');
const reloadMotivationalQuoteButton = document.getElementById('reloadMotivationalQuoteButton');

function fetchAndDisplayMotivationalQuote() {
  fetch('https://type.fit/api/quotes')
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      // Randomly select a quote from the list
      const randomIndex = Math.floor(Math.random() * data.length);
      const quote = data[randomIndex].text;
      motivationalQuote.textContent = `${quote}`;
    })
    .catch(function(error) {
      console.error('Error fetching quote:', error);
      motivationalQuote.textContent = 'Failed to fetch a quote. Please try again later.';
    });
}

fetchAndDisplayMotivationalQuote();

reloadMotivationalQuoteButton.addEventListener('click', () => {
  fetchAndDisplayMotivationalQuote();
});
