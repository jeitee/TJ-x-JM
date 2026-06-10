/* ==========================================================
   TEEJEI ♥ JUDITH WEDDING MICROSITE
========================================================== */

const GOOGLE_FORM_URL = "";

/* ==========================================================
   AOS
========================================================== */

AOS.init({
    duration: 1200,
    once: true,
    offset: 100
});

/* ==========================================================
   LOADER
========================================================== */

window.addEventListener("load", () => {
    const loader = document.getElementById("loader");

    setTimeout(() => {
        loader.style.opacity = "0";
        setTimeout(() => {
            loader.style.display = "none";
        }, 1000);
    }, 2500);
});

/* ==========================================================
   COUNTDOWN
========================================================== */

const weddingDate = new Date("December 20, 2026 14:00:00").getTime();

function updateCountdown() {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const d = document.getElementById("days");
    const h = document.getElementById("hours");
    const m = document.getElementById("minutes");
    const s = document.getElementById("seconds");

    if (d) d.textContent = days;
    if (h) h.textContent = hours;
    if (m) m.textContent = minutes;
    if (s) s.textContent = seconds;
}

updateCountdown();
setInterval(updateCountdown, 1000);

/* ==========================================================
   SMOOTH NAVIGATION
========================================================== */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", e => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute("href"));

        if (target) {
            target.scrollIntoView({
                behavior: "smooth"
            });
        }
    });
});

/* ==========================================================
   SCROLL TO TOP
========================================================== */

const scrollBtn = document.getElementById("scrollTopBtn");

window.addEventListener("scroll", () => {

    let closest = 0;
    let smallestDistance = Infinity;

    sections.forEach((section, index) => {

        const distance = Math.abs(
            section.getBoundingClientRect().top
        );

        if (distance < smallestDistance) {
            smallestDistance = distance;
            closest = index;
        }
    });

    currentSection = closest;
});

if (scrollBtn) {
    scrollBtn.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}

/* ==========================================================
   MUSIC PLAYER
========================================================== */

const musicBtn = document.getElementById("musicToggle");
const music = document.getElementById("bgMusic");
let isPlaying = false;

if (musicBtn && music) {
    musicBtn.addEventListener("click", () => {
        if (!isPlaying) {
            // Explicitly tell Chrome to load the file on click interaction
            music.load();

            // Handle Chrome's autoplay promise
            music.play()
                .then(() => {
                    musicBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
                    isPlaying = true;
                })
                .catch((error) => {
                    console.log("Chrome blocked playback or file not found:", error);
                    alert("Please interact with the page first or check if audio/enchanted.mp3 exists!");
                });
        } else {
            music.pause();
            musicBtn.innerHTML = '<i class="fa-solid fa-music"></i>';
            isPlaying = false;
        }
    });
}

/* ==========================================================
   MOBILE MENU
========================================================== */

const mobileBtn = document.querySelector(".mobile-menu-btn");
const navLinks = document.querySelector(".nav-links");

if (mobileBtn && navLinks) {
    mobileBtn.addEventListener("click", () => {
        navLinks.classList.toggle("mobile-open");
    });
}

/* ==========================================================
   LIGHTBOX
========================================================== */

const galleryImages = document.querySelectorAll(".gallery-item");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const closeLightbox = document.querySelector(".lightbox-close");

galleryImages.forEach(img => {
    img.addEventListener("click", () => {
        if (!lightbox || !lightboxImage) return;
        lightbox.classList.add("active");
        lightboxImage.src = img.src;
    });
});

if (closeLightbox) {
    closeLightbox.addEventListener("click", () => {
        lightbox.classList.remove("active");
    });
}

if (lightbox) {
    lightbox.addEventListener("click", e => {
        if (e.target === lightbox) {
            lightbox.classList.remove("active");
        }
    });
}

/* ==========================================================
   RSVP MODAL
========================================================== */

const openRSVP = document.getElementById("openRSVPBtn");
const modal = document.getElementById("rsvpModal");
const closeModal = document.querySelector(".close-modal");

if (openRSVP && modal) {
    openRSVP.addEventListener("click", () => {
        modal.classList.add("active");
    });
}

if (closeModal) {
    closeModal.addEventListener("click", () => {
        modal.classList.remove("active");
    });
}

window.addEventListener("click", e => {
    if (e.target === modal) {
        modal.classList.remove("active");
    }
});

/* ==========================================================
   RSVP STORAGE
========================================================== */

const rsvpForm = document.getElementById("rsvpForm");

if (rsvpForm) {
    rsvpForm.addEventListener("submit", e => {
        e.preventDefault();

        const fields = rsvpForm.querySelectorAll("input, textarea, select");

        const data = {
            fullName: fields[0].value,
            contact: fields[1].value,
            guests: fields[2].value,
            attendance: fields[3].value,
            meal: fields[4].value,
            song: fields[5].value,
            message: fields[6].value,
            submitted: new Date().toISOString()
        };

        const existing = JSON.parse(localStorage.getItem("wedding_rsvp") || "[]");
        existing.push(data);
        localStorage.setItem("wedding_rsvp", JSON.stringify(existing));

        /* Optional Google Form */
        if (GOOGLE_FORM_URL !== "") {
            fetch(GOOGLE_FORM_URL, {
                method: "POST",
                body: JSON.stringify(data)
            }).catch(() => { });
        }

        launchConfetti();
        alert("Thank you! Your RSVP has been received.");
        modal.classList.remove("active");
        rsvpForm.reset();
    });
}

/* ==========================================================
   CONFETTI
========================================================== */

function launchConfetti() {
    const container = document.getElementById("confetti-container");
    if (!container) return;

    for (let i = 0; i < 120; i++) {
        const confetti = document.createElement("span");
        confetti.className = "confetti-piece";
        confetti.style.left = Math.random() * 100 + "vw";
        confetti.style.top = "-20px";
        confetti.style.position = "fixed";
        confetti.style.width = "10px";
        confetti.style.height = "10px";

        // Colors updated from [Gold, Blush, White] to match CSS: [Gold, Sage Green, White]
        confetti.style.background = ["#D4AF37", "#A3B899", "#FFFFFF"][Math.floor(Math.random() * 3)];
        confetti.style.borderRadius = "50%";
        confetti.style.zIndex = "9999";
        confetti.style.transition = "transform 4s linear";

        container.appendChild(confetti);

        requestAnimationFrame(() => {
            confetti.style.transform = `translateY(${window.innerHeight + 200}px) rotate(${Math.random() * 720}deg)`;
        });

        setTimeout(() => {
            confetti.remove();
        }, 4500);
    }
}

/* ==========================================================
   FLOATING SAGE LEAVES + ROSE PETALS
========================================================== */

const canvas = document.getElementById("petalCanvas");

if (canvas) {

    const ctx = canvas.getContext("2d");
    let petals = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    class FloatingElement {

        constructor() {

            this.type =
                Math.random() < 0.7
                    ? "leaf"
                    : "rose";

            this.reset();
        }

        reset() {

            this.x = Math.random() * canvas.width;
            this.y = Math.random() * -canvas.height;

            if (this.type === "leaf") {

                this.width =
                    8 + Math.random() * 8;

                this.length =
                    this.width * 2.8;

            } else {

                this.width =
                    6 + Math.random() * 6;

                this.length =
                    this.width * 2.1;
            }

            this.speed =
                0.8 + Math.random() * 1.4;

            this.swing =
                0.5 + Math.random() * 1.5;

            this.angle =
                Math.random() * Math.PI;

            this.rotationSpeed =
                (Math.random() - 0.5) * 0.015;
        }

        update() {

            this.y += this.speed;

            this.x +=
                Math.sin(this.y * 0.015)
                * this.swing;

            this.angle +=
                this.rotationSpeed;

            if (
                this.y >
                canvas.height + 50
            ) {
                this.reset();
            }
        }

        drawLeaf() {

            const gradient =
                ctx.createLinearGradient(
                    0,
                    0,
                    0,
                    this.length
                );

            gradient.addColorStop(
                0,
                "rgba(110,127,101,0.9)"
            );

            gradient.addColorStop(
                0.5,
                "rgba(163,184,153,0.85)"
            );

            gradient.addColorStop(
                1,
                "rgba(220,235,220,0.7)"
            );

            ctx.fillStyle = gradient;

            ctx.beginPath();

            ctx.moveTo(0, 0);

            ctx.quadraticCurveTo(
                this.width,
                this.length * 0.4,
                0,
                this.length
            );

            ctx.quadraticCurveTo(
                -this.width,
                this.length * 0.4,
                0,
                0
            );

            ctx.fill();
        }

        drawRose() {

            const gradient =
                ctx.createLinearGradient(
                    0,
                    0,
                    0,
                    this.length
                );

            gradient.addColorStop(
                0,
                "rgba(214,82,120,0.95)"
            );

            gradient.addColorStop(
                0.5,
                "rgba(240,120,150,0.85)"
            );

            gradient.addColorStop(
                1,
                "rgba(255,190,210,0.7)"
            );

            ctx.fillStyle = gradient;

            ctx.beginPath();

            ctx.moveTo(0, 0);

            ctx.bezierCurveTo(
                this.width,
                -this.width,
                this.width * 1.5,
                this.length * 0.5,
                0,
                this.length
            );

            ctx.bezierCurveTo(
                -this.width * 1.5,
                this.length * 0.5,
                -this.width,
                -this.width,
                0,
                0
            );

            ctx.fill();
        }

        draw() {

            ctx.save();

            ctx.translate(
                this.x,
                this.y
            );

            ctx.rotate(
                this.angle
            );

            if (
                this.type === "leaf"
            ) {

                this.drawLeaf();

            } else {

                this.drawRose();
            }

            ctx.restore();
        }
    }

    const particleCount =
        window.innerWidth < 768
            ? 20
            : 40;

    for (
        let i = 0;
        i < particleCount;
        i++
    ) {

        petals.push(
            new FloatingElement()
        );
    }

    function animate() {

        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        petals.forEach(
            petal => {

                petal.update();
                petal.draw();

            }
        );

        requestAnimationFrame(
            animate
        );
    }

    animate();
}

/* ==========================================================
   GALLERY SWIPE SUPPORT
========================================================== */

let touchStartX = 0;
let touchEndX = 0;

if (lightboxImage) {
    lightboxImage.addEventListener("touchstart", e => {
        touchStartX = e.changedTouches[0].screenX;
    });

    lightboxImage.addEventListener("touchend", e => {
        touchEndX = e.changedTouches[0].screenX;
    });
}

/* ==========================================================
   HERO REVEAL
========================================================== */

document.querySelectorAll(".hero-content *").forEach((el, index) => {
    el.style.opacity = 0;

    setTimeout(() => {
        el.style.transition = "all 1s ease";
        el.style.opacity = 1;
        el.style.transform = "translateY(0)";
    }, 400 * index);
});

/* ==========================================================
   END
========================================================== */
const sections = [
    ...document.querySelectorAll(
        '.hero, .section, .venue-section, .thankyou-section'
    )
];

let currentSection = 0;
let isScrolling = false;

// window.addEventListener(
//     "wheel",
//     (e) => {

//         if (isScrolling) {
//             e.preventDefault();
//             return;
//         }

//         if (e.deltaY > 0) {
//             currentSection = Math.min(
//                 currentSection + 1,
//                 sections.length - 1
//             );
//         } else {
//             currentSection = Math.max(
//                 currentSection - 1,
//                 0
//             );
//         }

//         isScrolling = true;

//         sections[currentSection].scrollIntoView({
//             behavior: "smooth",
//             block: "start"
//         });

//         setTimeout(() => {
//             isScrolling = false;
//         }, 900);

//         e.preventDefault();
//     },
//     { passive: false }
// );