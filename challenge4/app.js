// get all the keys on the keyboard
const keys = [...document.querySelectorAll('button.key')];

// find the initial key which has .jiggle class "R"
let activeJigglingKey = keys.find((item) => {
  return item.classList.contains('jiggle');
});

let correctKeyTyped = undefined;
let correctTypedKeysCount = 0;
let incorrectTypedKeysCount = 0;

// results elements
const correctTypedKeysCountEl = document.querySelector('.correct-keys-count');
const incorrectTypedKeysCountEl = document.querySelector('.incorrect-keys-count');
correctTypedKeysCountEl.textContent = correctTypedKeysCount;
incorrectTypedKeysCountEl.textContent = incorrectTypedKeysCount;


// we can listen for keyboard events on main document element
document.addEventListener('keydown', event => {
  event.preventDefault();

  const firstKey = correctKeyTyped === undefined

  // get the current jiggling key
  const activeJigglingKeyCode = activeJigglingKey.dataset.key;

  // get the pressed key code
  const pressedKey = event.key.toUpperCase();
  const keyCode = event.code.toUpperCase();
  // check for left, right Shift keys
  if (pressedKey === 'SHIFT' && keyCode === activeJigglingKeyCode) {
      if (firstKey || correctKeyTyped) {
        incrementCorrectKeyPressCount();
      }
      correctKeyTyped = true;
      resetJiggle();
      return;
  }

  // other keys
  if (activeJigglingKeyCode === pressedKey) {
    if (firstKey || correctKeyTyped) {
      incrementCorrectKeyPressCount();
    }
    correctKeyTyped = true;
    resetJiggle();
    return;
  }
  correctKeyTyped = false;
  incrementIncorrectKeyPressCount();
});

function incrementCorrectKeyPressCount() {
  correctTypedKeysCount += 1;

  correctTypedKeysCountEl.textContent = correctTypedKeysCount;
}

function incrementIncorrectKeyPressCount() {
  incorrectTypedKeysCount += 1;

  incorrectTypedKeysCountEl.textContent = incorrectTypedKeysCount;
}

function resetJiggle() {
  // remove the class .jiggle from active key
  activeJigglingKey.classList.remove('jiggle');

  // get a new key and add class .jiggle
  activeJigglingKey = getRandomKey();
  activeJigglingKey.classList.add('jiggle');
}

function getRandomKey() {
  const key = keys[Math.floor(Math.random() * keys.length)];
  return key;
}
