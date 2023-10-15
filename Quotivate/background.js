const pomodorosoptions = ["timer", "isRunning", "timeOption"];
const remindersOptions = ["reminders"];

// Create the "Quotivate" alarm
chrome.alarms.create("Quotivate", { periodInMinutes: 1 / 60 });

// Alarm listener for all alarms
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "Quotivate") {
    // Handle Quotivate alarm logic here
    chrome.storage.local.get(pomodorosoptions, (res) => {
      if (res.isRunning) {
        let timer = res.timer + 1;
        let isRunning = res.isRunning;
        if (timer === res.timeOption * 60) {
          chrome.notifications.create("Quotivate", {
            type: "basic",
            title: "Quotivate Message",
            message: `${res.timeOption} minutes has passed!!`,
            iconUrl: "../images/Quotivate1.png",
          });
          timer = 0;
          isRunning = false;
        }
        chrome.storage.local.set({
          timer,
          isRunning,
        });
      }
    });
  } else if (alarm.name === "ReminderAlarm") {
    // Handle ReminderAlarm logic here
    const currentDate = new Date();
    const currentTimeString = currentDate.toLocaleTimeString();

    chrome.storage.local.get(remindersOptions, (result) => {
      const reminders = result.reminders || [];

      reminders.forEach((reminder) => {
        if (reminder.dueTime === currentTimeString) {
          // Send a notification for the reminder
          chrome.notifications.create("ReminderNotification", {
            type: "basic",
            title: "Reminder",
            message: `Reminder: ${reminder.task}`,
            iconUrl: "../images/Quotivate1.png",
          });
        }
      });
    });
  }
});


chrome.alarms.create("ReminderAlarm", { periodInMinutes: 1 });
