const downSound = new Audio('./assets/key-down.mp3');
const upSound = new Audio('./assets/key-up.mp3');

downSound.preload = 'auto';
upSound.preload = 'auto';

const el = document.getElementById('button');

// Track button press state
let isPressed = false;

function playSound(audio) {
    audio.currentTime = 0;
    const playPromise = audio.play();

    if (playPromise !== undefined) {
        playPromise.catch(error => {
            console.warn('Audio playback failed:', error);
        });
    }
}

function playDownSound() {
    if (!isPressed) {
        isPressed = true;
        /* __active to support Android browsers */
        el.classList.add('__active');
        playSound(downSound);
    }
}

function playUpSound() {
    if (isPressed) {
        isPressed = false;
        /* __active to support Android browsers */
        el.classList.remove('__active');
        playSound(upSound);
    }
}

el.addEventListener('mousedown', playDownSound);
document.addEventListener('mouseup', playUpSound);

let touchTarget = null;
el.addEventListener('touchstart', (e) => {
    // Disabled text selection on iOS Safari
    e.preventDefault();

    // Remember the target element to handle touchend
    touchTarget = e.target.parentElement;

    playDownSound()
}, { passive: false });
el.addEventListener('touchend', playUpSound);
el.addEventListener('touchcancel', playUpSound);

// Reset button state when browser/tab loses focus
window.addEventListener('blur', playUpSound);

// Handle visibility change (when tab becomes hidden)
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        playUpSound()
    }
});

// Handle click event
function handleClick() {
    const href = el.dataset.href
    if (href) {
        setTimeout(() => {
            window.location.href = href
        }, 300)
    }
}
function touchClick(e) {
    const touch = e.changedTouches?.[0];
    if (touch) {
        const target = document.elementFromPoint(touch.clientX, touch.clientY).parentElement;
        if (target !== touchTarget) {
            touchTarget = null;
            return
        }
    }

    handleClick();
}
if ('ontouchend' in document.documentElement) {
    el.addEventListener('touchend', touchClick);
} else {
    el.addEventListener('click', handleClick);
}
