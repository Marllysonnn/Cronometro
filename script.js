let countdown;
let isRunning = false;
let isEditing = false;

document.getElementById("hours").value = "00";
document.getElementById("minutes").value = "00";
document.getElementById("seconds").value = "00";

const inputs = document.querySelectorAll("#hours, #minutes, #seconds");
const editButton = document.querySelector("button img[alt='edit']").parentElement;
const alarmSound = document.getElementById("alarm-sound");
const startButton = document.querySelector(".btn button:nth-child(4)");
const stopButton = document.querySelector(".btn button:nth-child(3)");

function startTimer() {
    if (isRunning || isEditing) return;

    let totalSeconds = getTotalSeconds();
    if (totalSeconds <= 0) return;

    isRunning = true;
    startButton.classList.add("active");
    stopButton.classList.remove("active");

    inputs.forEach(input => {
        input.classList.remove("editing");
        input.classList.add("running");
    });

    countdown = setInterval(() => {
        if (totalSeconds <= 0) {
            clearInterval(countdown);
            isRunning = false;
            alarmSound.play();
            resetButtonState();
            return;
        }

        totalSeconds--;
        updateInputs(totalSeconds);
    }, 1000);
}

function stopTimer() {
    clearInterval(countdown);
    isRunning = false;
    startButton.classList.remove("active");
    stopButton.classList.add("active");
}

function animateReset() {
    let totalSeconds = getTotalSeconds();

    if (totalSeconds === 0) return;

    let interval = setInterval(() => {
        if (totalSeconds <= 0) {
            clearInterval(interval);
            return;
        }
        
        totalSeconds -= Math.ceil(totalSeconds / 10);
        updateInputs(totalSeconds);
    }, 20);
}

function resetTimer() {
    stopTimer();
    animateReset();
}

function getTotalSeconds() {
    let hours = parseInt(document.getElementById("hours").value) || 0;
    let minutes = parseInt(document.getElementById("minutes").value) || 0;
    let seconds = parseInt(document.getElementById("seconds").value) || 0;
    return hours * 3600 + minutes * 60 + seconds;
}

function updateInputs(totalSeconds) {
    let h = Math.floor(totalSeconds / 3600);
    let m = Math.floor((totalSeconds % 3600) / 60);
    let s = totalSeconds % 60;

    document.getElementById("hours").value = h.toString().padStart(2, "0");
    document.getElementById("minutes").value = m.toString().padStart(2, "0");
    document.getElementById("seconds").value = s.toString().padStart(2, "0");
}

function modifyTime(amount) {
    let totalSeconds = getTotalSeconds() + amount;
    if (totalSeconds < 0) totalSeconds = 0;
    updateInputs(totalSeconds);
}

function resetButtonState() {
    startButton.classList.remove("active");
    stopButton.classList.remove("active");
}

let modifyInterval;
let modifyAmount = 600;

document.getElementById("less").addEventListener("mousedown", () => {
    modifyInterval = setInterval(() => {
        modifyTime(-modifyAmount);
    }, 600);
});

document.getElementById("more").addEventListener("mousedown", () => {
    modifyInterval = setInterval(() => {
        modifyTime(modifyAmount);
    }, 600);
});

document.getElementById("less").addEventListener("mouseup", () => {
    clearInterval(modifyInterval);
});

document.getElementById("more").addEventListener("mouseup", () => {
    clearInterval(modifyInterval);
});

document.getElementById("less").addEventListener("mouseleave", () => {
    clearInterval(modifyInterval);
});

document.getElementById("more").addEventListener("mouseleave", () => {
    clearInterval(modifyInterval);
});

editButton.addEventListener("click", () => {
    isEditing = !isEditing;

    if (isEditing) {
        stopTimer();
        editButton.classList.add("active");
    } else {
        editButton.classList.remove("active");
    }

    inputs.forEach(input => {
        input.classList.toggle("editing", isEditing);
        input.classList.remove("running");
        input.disabled = !isEditing;
    });
});

const volumeSlider = document.getElementById('volume-range');
const volumeLevel = document.getElementById('volume-level');

volumeSlider.addEventListener('input', () => {
  const volume = volumeSlider.value;
  volumeLevel.textContent = volume + "%";
  alarmSound.volume = volume / 100;
});

window.addEventListener("DOMContentLoaded", () => {
    inputs.forEach(input => input.disabled = true);
});

document.getElementById("less").addEventListener("click", () => modifyTime(-30));
document.getElementById("more").addEventListener("click", () => modifyTime(30));
document.querySelector(".btn button:nth-child(1)").addEventListener("click", resetTimer);
document.querySelector(".btn button:nth-child(3)").addEventListener("click", stopTimer);
document.querySelector(".btn button:nth-child(4)").addEventListener("click", startTimer);
