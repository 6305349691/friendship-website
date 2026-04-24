const surpriseButton = document.getElementById("surpriseButton");
const surpriseMessage = document.getElementById("surpriseMessage");
const heroNoteMessage = document.getElementById("heroNoteMessage");
const revealTargets = document.querySelectorAll(".hero, .section, .promise-box, .moment-card, .reason-list article, .quote-panel");
const slides = document.querySelectorAll(".slide");
const slideDots = document.querySelectorAll(".slide-dot");
const prevSlideButton = document.getElementById("prevSlide");
const nextSlideButton = document.getElementById("nextSlide");

const notes = [
  "Your friendship is one of the most precious gifts in my life, and I will always be thankful for your place in my story.",
  "Some people stay in memory, but some stay in the heart. You have become both for me.",
  "In the middle of busy days and hard moments, your friendship feels like comfort, safety, and genuine happiness.",
  "This bond is not just about photos or memories. It is about care, trust, loyalty, and a connection I deeply value.",
  "No matter where life takes us, a part of my heart will always smile when I think of this friendship."
];

let noteIndex = 0;
let currentSlideIndex = 0;
let slideshowTimer;

if (surpriseButton && surpriseMessage) {
  surpriseButton.addEventListener("click", () => {
    noteIndex = (noteIndex + 1) % notes.length;
    surpriseMessage.textContent = notes[noteIndex];
    if (heroNoteMessage) {
      heroNoteMessage.textContent = notes[noteIndex];
      heroNoteMessage.animate(
        [
          { opacity: 0.35, transform: "translateY(6px)" },
          { opacity: 1, transform: "translateY(0)" }
        ],
        { duration: 420, easing: "ease-out" }
      );
    }
    surpriseMessage.animate(
      [
        { opacity: 0.35, transform: "translateY(6px)" },
        { opacity: 1, transform: "translateY(0)" }
      ],
      { duration: 420, easing: "ease-out" }
    );
  });
}

function showSlide(index) {
  if (!slides.length) {
    return;
  }

  currentSlideIndex = (index + slides.length) % slides.length;

  slides.forEach((slide, slideIndex) => {
    slide.classList.toggle("is-active", slideIndex === currentSlideIndex);
  });

  slideDots.forEach((dot, dotIndex) => {
    dot.classList.toggle("is-active", dotIndex === currentSlideIndex);
  });
}

function restartSlideshow() {
  if (!slides.length) {
    return;
  }

  window.clearInterval(slideshowTimer);
  slideshowTimer = window.setInterval(() => {
    showSlide(currentSlideIndex + 1);
  }, 4000);
}

if (slides.length) {
  prevSlideButton?.addEventListener("click", () => {
    showSlide(currentSlideIndex - 1);
    restartSlideshow();
  });

  nextSlideButton?.addEventListener("click", () => {
    showSlide(currentSlideIndex + 1);
    restartSlideshow();
  });

  slideDots.forEach((dot) => {
    dot.addEventListener("click", () => {
      showSlide(Number(dot.dataset.slide));
      restartSlideshow();
    });
  });

  showSlide(0);
  restartSlideshow();
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.16 });

revealTargets.forEach((element) => {
  element.classList.add("reveal");
  observer.observe(element);
});
