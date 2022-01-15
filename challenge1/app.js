(function () {
  let timerStarted = false;
  let timerId = null;
  let settingsMode = false;
  let minutes = 0;
  let seconds = 0;

  // get the inputs (minutes, seconds) elements
  const minutesInput = document.querySelector('input#minutes');
  const secondsInput = document.querySelector('input#seconds');
  // get the start and handle click event to start the timer
  const startButton = document.querySelector('button.start');
  // get the settings button & img
  const settingsButton = document.querySelector('button.settings');
  const settingsButtonImg = settingsButton.querySelector('img');
  // ring element
  const ring = document.querySelector('.ring');

  window.onload = function () {
    minutes = parseInt(minutesInput.getAttribute('value'), 10);
    seconds = parseInt(secondsInput.getAttribute('value'), 10);

    startButton.addEventListener('click', () => {
      if (timerStarted) {
        startButton.textContent = 'Start';
        timerStarted = false;
        // clear the prev timer interval
        stopTimer(timerId);
      } else {
        startButton.textContent = 'Pause';
        timerStarted = true;
        if (minutes === 0 && seconds === 0) {
          minutes = 15;
        }
        timerId = startTimer();
      }
    });

    // add event listener on gear button to toggle edit or disable input
    settingsButton.addEventListener('click', () => {
      settingsMode = !settingsMode;

      if (settingsMode) {
        minutesInput.removeAttribute('disabled');
        secondsInput.removeAttribute('disabled');

        settingsButtonImg.src = 'images/check.svg';
        return;
      }

      minutesInput.setAttribute('disabled', true);
      secondsInput.setAttribute('disabled', true);
      settingsButtonImg.src = 'images/gear.svg';
    });

    // add change listener on minutes and seconds
    [minutesInput, secondsInput].forEach(input => {
      input.addEventListener('input', function (event) {
        // allow only digits, tab, enter, backspace keys
        if (!/^[0-9]+$/.test(event.target.value)) {
          this.value = '00';
          return;
        }

        const value = parseInt(event.target.value, 10);
        const name = event.target.name;
        this.value = `${value}`.padStart(2, '0');

        if (name === 'minutes') {
          minutes = value;
        }

        if (name === 'seconds') {
          if (value <= 0 || value > 59) {
            this.value = '00';
            return;
          }
          seconds = value;
        }
      });
    })
  };

  function startTimer() {
    ring.classList.remove('ending');
    const timerId = setInterval(() => {
      // keep decreasing the seconds
      if (seconds !== 0) {
        seconds -= 1;
        secondsInput.value = `${seconds}`.padStart(2, 0);
        return;
      }

      // reset seconds to 59 and decrease 1 minute
      if (seconds === 0 && minutes > 0) {
        minutes -= 1;
        minutesInput.value = `${minutes}`.padStart(2, 0);
        secondsInput.value = 59;
        return;
      }

      // stop the timer when both are 0
      if (minutes === 0 && seconds === 0) {
        stopTimer(timerId);

        // make ring red and show alert
        ring.classList.add('ending');
        setTimeout(() => {
          window.alert(`Time's up!`);
        }, 0);
      }
    }, 1000);

    return timerId;
  }

  function stopTimer(timerId) {
    clearInterval(timerId);
    startButton.textContent = 'Start'
    timerStarted = false;
  }
})();
