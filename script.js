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

    // Stage 1: reveal envelope moment
    setTimeout(() => {
        loader.classList.add("stage-open");
    }, 1200);

    // Stage 2: hold cinematic moment
    setTimeout(() => {
        loader.classList.add("stage-hold");
    }, 2600);

    // Stage 3: fade out like film cut
    setTimeout(() => {
        loader.style.transition = "opacity 1.2s ease";
        loader.style.opacity = "0";
    }, 3800);

    // Stage 4: remove
    setTimeout(() => {
        loader.style.display = "none";
    }, 5200);
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
    SECTIONS & SCROLL TO TOP
========================================================== */

const sections = [
    ...document.querySelectorAll(
        '.hero, .section, .venue-section, .thankyou-section'
    )
];

let currentSection = 0;
const scrollBtn = document.getElementById("scrollTopBtn");

window.addEventListener("scroll", () => {
    // Show/hide scroll to top button
    if (window.scrollY > 500) {
        scrollBtn?.classList.add("show");
    } else {
        scrollBtn?.classList.remove("show");
    }

    // Track current section for potential future use
    let closest = 0;
    let smallestDistance = Infinity;

    sections.forEach((section, index) => {
        const distance = Math.abs(section.getBoundingClientRect().top);
        if (distance < smallestDistance) {
            smallestDistance = distance;
            closest = index;
        }
    });

    currentSection = closest;
}, { passive: true });

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

for (let i = 0; i < 120; i++) {
    const piece = document.createElement("span");

    const isPetal = Math.random() < 0.5; // 50% chance

    piece.style.left = Math.random() * 100 + "vw";
    piece.style.top = "-20px";
    piece.style.position = "fixed";
    piece.style.zIndex = "9999";
    piece.style.transition = "transform 4s linear";

    if (isPetal) {
        // Petal
        piece.innerHTML = "🌸";
        piece.style.fontSize = "18px";
        piece.style.background = "transparent";
    } else {
        // Confetti
        piece.style.width = "10px";
        piece.style.height = "10px";
        piece.style.borderRadius = "50%";
        piece.style.background =
            ["#D4AF37", "#A3B899", "#FFFFFF"][Math.floor(Math.random() * 3)];
    }

    container.appendChild(piece);

    requestAnimationFrame(() => {
        piece.style.transform =
            `translateY(${window.innerHeight + 200}px) rotate(${Math.random() * 720}deg)`;
    });

    setTimeout(() => piece.remove(), 4500);
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

let touchStartY = 0;
let touchEndY = 0;

if (lightbox) {
    lightbox.addEventListener("touchstart", e => {
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    lightbox.addEventListener("touchend", e => {
        touchEndY = e.changedTouches[0].screenY;
        // Close lightbox on downward swipe
        if (touchEndY - touchStartY > 50) {
            lightbox.classList.remove("active");
        }
    }, { passive: true });
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