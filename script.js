const body = document.body;
const themeToggle = document.getElementById("themeToggle");
const musicToggle = document.getElementById("musicToggle");
const typingText = document.getElementById("typingText");
const surpriseButton = document.getElementById("surpriseButton");
const surpriseMessage = document.getElementById("surpriseMessage");
const openModalButton = document.getElementById("openModalButton");
const finalRevealButton = document.getElementById("finalRevealButton");
const closeModalButton = document.getElementById("closeModalButton");
const modal = document.getElementById("messageModal");
const revealTargets = document.querySelectorAll(".reveal-up");

const quotes = [
  "A best friend is a safe place where your true self never has to hide. ?",
  "Some souls recognize each other quietly and stay connected loudly.",
  "Friendship is when a memory can still feel warm years later.",
  "The right person makes life softer, lighter, and more beautiful."
];

const surpriseNotes = [
  "You are one of the kindest memories my heart keeps replaying.",
  "If life gave me a thousand people, I would still be grateful it gave me you.",
  "This friendship is a reminder that beautiful people still exist in the world.",
  "You made laughter easier, silence safer, and memories brighter. ?"
];

let quoteIndex = 0;
let charIndex = 0;
let deleting = false;
let surpriseIndex = 0;
let audioContext;
let musicInterval;
let isMusicPlaying = false;

function applySavedTheme() {
  const savedTheme = localStorage.getItem("friendship-theme") || "light";
  body.dataset.theme = savedTheme;
  themeToggle.querySelector(".icon-button-text").textContent = savedTheme === "dark" ? "Light Mode" : "Dark Mode";
}

function toggleTheme() {
  const nextTheme = body.dataset.theme === "dark" ? "light" : "dark";
  body.dataset.theme = nextTheme;
  localStorage.setItem("friendship-theme", nextTheme);
  themeToggle.querySelector(".icon-button-text").textContent = nextTheme === "dark" ? "Light Mode" : "Dark Mode";
}

// Typing effect for rotating friendship quotes.
function runTypingEffect() {
  const activeQuote = quotes[quoteIndex];

  if (!deleting) {
    typingText.textContent = activeQuote.slice(0, charIndex + 1);
    charIndex += 1;

    if (charIndex === activeQuote.length) {
      deleting = true;
      setTimeout(runTypingEffect, 1700);
      return;
    }

    setTimeout(runTypingEffect, 55);
    return;
  }

  typingText.textContent = activeQuote.slice(0, charIndex - 1);
  charIndex -= 1;

  if (charIndex === 0) {
    deleting = false;
    quoteIndex = (quoteIndex + 1) % quotes.length;
    setTimeout(runTypingEffect, 280);
    return;
  }

  setTimeout(runTypingEffect, 25);
}

function animateTextSwap(element, nextText) {
  element.animate(
    [
      { opacity: 0.35, transform: "translateY(8px)" },
      { opacity: 1, transform: "translateY(0)" }
    ],
    { duration: 420, easing: "ease-out" }
  );
  element.textContent = nextText;
}

function revealSurprise() {
  surpriseIndex = (surpriseIndex + 1) % surpriseNotes.length;
  animateTextSwap(surpriseMessage, surpriseNotes[surpriseIndex]);
}

function openModal() {
  modal.classList.remove("hidden");
  modal.setAttribute("aria-hidden", "false");
  body.classList.add("modal-open");
}

function closeModal() {
  modal.classList.add("hidden");
  modal.setAttribute("aria-hidden", "true");
  body.classList.remove("modal-open");
}

// Lightweight ambient music generated with Web Audio so GitHub Pages works without extra media files.
function playTone(frequency, startTime, duration) {
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(frequency, startTime);

  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.exponentialRampToValueAtTime(0.03, startTime + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start(startTime);
  oscillator.stop(startTime + duration);
}

function startMusic() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }

  const pattern = [261.63, 329.63, 392.0, 329.63, 293.66, 349.23];
  let step = 0;

  const playPattern = () => {
    const now = audioContext.currentTime;
    playTone(pattern[step % pattern.length], now, 1.6);
    playTone(pattern[(step + 2) % pattern.length] / 2, now + 0.2, 1.8);
    step += 1;
  };

  playPattern();
  musicInterval = window.setInterval(playPattern, 1400);
  isMusicPlaying = true;
  musicToggle.querySelector(".icon-button-text").textContent = "Pause Music";
}

function stopMusic() {
  window.clearInterval(musicInterval);
  musicInterval = null;
  isMusicPlaying = false;
  musicToggle.querySelector(".icon-button-text").textContent = "Play Music";

  if (audioContext && audioContext.state !== "closed") {
    audioContext.suspend();
  }
}

async function toggleMusic() {
  if (!isMusicPlaying) {
    if (!audioContext) {
      startMusic();
      return;
    }

    if (audioContext.state === "suspended") {
      await audioContext.resume();
    }

    startMusic();
    return;
  }

  stopMusic();
}

function revealOnScroll() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  revealTargets.forEach((element) => observer.observe(element));
}

themeToggle.addEventListener("click", toggleTheme);
musicToggle.addEventListener("click", toggleMusic);
surpriseButton.addEventListener("click", revealSurprise);
openModalButton.addEventListener("click", openModal);
finalRevealButton.addEventListener("click", openModal);
closeModalButton.addEventListener("click", closeModal);
modal.addEventListener("click", (event) => {
  if (event.target instanceof HTMLElement && event.target.dataset.closeModal === "true") {
    closeModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

applySavedTheme();
runTypingEffect();
revealOnScroll();
