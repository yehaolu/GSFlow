const video = document.querySelector('#showcase-video');
const modeButtons = [...document.querySelectorAll('[data-mode]')];
const sceneButtons = [...document.querySelectorAll('[data-scene]')];
const videoLabel = document.querySelector('#video-label');
const videoDescription = document.querySelector('#video-description');
const videoStatus = document.querySelector('#video-status');
const videoOpen = document.querySelector('#video-open');

const sceneNames = {
  garden: 'Garden',
  drjohnson: 'Dr Johnson',
  kitchen: 'Kitchen',
  princess: 'Princess',
  red_leaves: 'Red Leaves',
  sand_clock: 'Sand Clock',
  doll: 'Doll'
};

const modeContent = {
  synchronized: {
    label: 'Synchronized comparison',
    folder: 'synchronized',
    description: 'Frame-aligned playback makes temporal consistency and rendering fidelity easy to inspect.'
  },
  acceleration: {
    label: 'Acceleration performance',
    folder: 'acceleration',
    description: 'Runtime playback exposes the practical throughput gain along a continuous camera trajectory.'
  }
};

let activeMode = 'synchronized';
let activeScene = 'garden';

function setPressedState(buttons, activeButton) {
  buttons.forEach((button) => {
    const isActive = button === activeButton;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });
}

function updateVideo() {
  const mode = modeContent[activeMode];
  const path = `assets/videos/${mode.folder}/${activeScene}.mp4`;

  videoStatus.textContent = `Loading ${sceneNames[activeScene]}...`;
  video.setAttribute('aria-busy', 'true');
  video.src = path;
  video.load();

  const playAttempt = video.play();
  if (playAttempt) {
    playAttempt.catch(() => {
      videoStatus.textContent = 'Press play to start the comparison.';
    });
  }

  videoLabel.textContent = `${sceneNames[activeScene]} / ${mode.label}`;
  videoDescription.textContent = mode.description;
  videoOpen.href = path;
}

modeButtons.forEach((button) => {
  button.addEventListener('click', () => {
    activeMode = button.dataset.mode;
    setPressedState(modeButtons, button);
    updateVideo();
  });
});

sceneButtons.forEach((button) => {
  button.addEventListener('click', () => {
    activeScene = button.dataset.scene;
    setPressedState(sceneButtons, button);
    updateVideo();
  });
});

video.addEventListener('loadeddata', () => {
  video.setAttribute('aria-busy', 'false');
  videoStatus.textContent = '';
});

video.addEventListener('error', () => {
  video.setAttribute('aria-busy', 'false');
  videoStatus.textContent = 'This video could not be loaded. Use Open video to inspect the source file.';
});
