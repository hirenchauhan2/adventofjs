// get all the keys on the keyboard
const keys = [...document.querySelectorAll('button.key')];

// find the initial key which has .jiggle class "R"
let activeJigglingKey = keys.find((item) => {
  return item.classList.contains('jiggle');
});


// we can listen for keyboard events on main document element
document.addEventListener('keydown', event => {
  event.preventDefault();

  // get the current jiggling key
  const activeJigglingKeyCode = activeJigglingKey.dataset.key;

  // get the pressed key code
  const pressedKey = event.key.toUpperCase();
  const keyCode = event.code.toUpperCase();
  // check for left, right Shift keys
  if (pressedKey === 'SHIFT' && keyCode === activeJigglingKeyCode) {

      resetJiggle();
      return;
  }

  // other keys
  if (activeJigglingKeyCode === pressedKey) {
    resetJiggle();
  }
});


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
