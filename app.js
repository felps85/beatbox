function playSoundByKey(keyCode) {
  const audio = document.querySelector(`audio[data-key="${keyCode}"]`);
  const key = document.querySelector(`.key[data-key="${keyCode}"]`);
  if (!audio || !key) return;
  audio.currentTime = 0;
  audio.play();
  key.classList.add('playing');
}

function playSound(e) {
  playSoundByKey(e.keyCode);
}

function playSoundOnClick() {
  const keyCode = this.getAttribute('data-key');
  playSoundByKey(keyCode);
}

function removeTransition(e) {
  if(e.propertyName !== 'transform') return;
  this.classList.remove('playing');
}

const keys = document.querySelectorAll('.key');
const keyCodeByLabel = {};
const patternInput = document.querySelector('#pattern-input');
const playPatternButton = document.querySelector('#play-pattern');
const stepDuration = 250;

keys.forEach(key => {
  const keyLabel = key.querySelector('kbd');
  if (!keyLabel) return;
  keyCodeByLabel[keyLabel.textContent.trim().toUpperCase()] = key.getAttribute('data-key');
});

function playPattern(pattern) {
  let currentDelay = 0;
  const normalizedPattern = pattern.toUpperCase();

  for (const char of normalizedPattern) {
    if (char === ' ') {
      currentDelay += stepDuration;
      continue;
    }

    const keyCode = keyCodeByLabel[char];
    if (!keyCode) continue;

    setTimeout(() => {
      playSoundByKey(keyCode);
    }, currentDelay);

    currentDelay += stepDuration;
  }
}

function handlePatternPlay() {
  if (!patternInput) return;
  playPattern(patternInput.value);
}

window.addEventListener('keydown', playSound);
keys.forEach(key => key.addEventListener('transitionend', removeTransition));
keys.forEach(key => key.addEventListener('click', playSoundOnClick));

if (playPatternButton) {
  playPatternButton.addEventListener('click', handlePatternPlay);
}

if (patternInput) {
  patternInput.addEventListener('keydown', function(e) {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    handlePatternPlay();
  });
}
