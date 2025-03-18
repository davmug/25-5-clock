$(document).ready(function () {
  let breakLength = parseInt($("#break-length").text());
  let sessionLength = parseInt($("#session-length").text());
  let timeLeft = sessionLength * 60;
  let timerInterval;
  let timerRunning = false;
  let timerType = "Session";

  function displayTimeLeft(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const displayMinutes = String(minutes).padStart(2, "0");
    const displaySeconds = String(remainingSeconds).padStart(2, "0");
    $("#time-left").text(`${displayMinutes}:${displaySeconds}`);
    updateCircle(seconds);
  }

  function updateCircle(seconds) {
    const totalSeconds = sessionLength * 60;
    const progress = 1 - seconds / totalSeconds;
    $(".timer-progress-dashed").attr("d", describeArc(100, 100, 90, 0, progress * 360));
  }

  function describeArc(x, y, radius, startAngle, endAngle) {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
  }

  function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  }

  function updateTimerDisplay() {
    displayTimeLeft(timeLeft);
    $("#timer-label").text(timerType);
  }

  function startTimer() {
    timerInterval = setInterval(() => {
      timeLeft--;
      if (timeLeft < 0) {
        clearInterval(timerInterval);
        $("#beep")[0].play();
        if (timerType === "Session") {
          timerType = "Break";
          timeLeft = breakLength * 60;
        } else {
          timerType = "Session";
          timeLeft = sessionLength * 60;
        }
        updateTimerDisplay();
        startTimer();
      } else {
        updateTimerDisplay();
      }
    }, 1000);
    timerRunning = true;
    $("#start_stop").text("Pause");
  }

  function pauseTimer() {
    clearInterval(timerInterval);
    timerRunning = false;
    $("#start_stop").text("Start");
  }

  function resetTimer() {
    clearInterval(timerInterval);
    timerRunning = false;
    breakLength = 5;
    sessionLength = 25;
    timerType = "Session";
    timeLeft = sessionLength * 60;
    $("#break-length").text(breakLength);
    $("#session-length").text(sessionLength);
    updateTimerDisplay();
    $("#start_stop").text("Start");
    $("#beep")[0].pause();
    $("#beep")[0].currentTime = 0;
  }

  $("#break-decrement").click(function () {
    if (!timerRunning) {
      breakLength = Math.max(1, breakLength - 1);
      $("#break-length").text(breakLength);
    }
  });

  $("#break-increment").click(function () {
    if (!timerRunning) {
      breakLength = Math.min(60, breakLength + 1);
      $("#break-length").text(breakLength);
    }
  });

  $("#session-decrement").click(function () {
    if (!timerRunning) {
      sessionLength = Math.max(1, sessionLength - 1);
      $("#session-length").text(sessionLength);
      timeLeft = sessionLength * 60;
      updateTimerDisplay();
    }
  });

  $("#session-increment").click(function () {
    if (!timerRunning) {
      sessionLength = Math.min(60, sessionLength + 1);
      $("#session-length").text(sessionLength);
      timeLeft = sessionLength * 60;
      updateTimerDisplay();
    }
  });

  $("#start_stop").click(function () {
    if (timerRunning) {
      pauseTimer();
    } else {
      startTimer();
    }
  });

  $("#reset").click(resetTimer);

  updateTimerDisplay();
});
