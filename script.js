/* --- DUST PARTICLE CANVAS ANIMATION --- */
const canvas = document.getElementById('dust-canvas');
const ctx = canvas.getContext('2d');
let w, h;
const particles = [];

// New: Lightning Canvas Ref
const lCanvas = document.getElementById('lightning-canvas');
const lCtx = lCanvas.getContext('2d');

function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    
    // Resize Lightning Canvas too
    if(lCanvas) {
        lCanvas.width = w;
        lCanvas.height = h;
    }
}
window.addEventListener('resize', resize);
resize();


function random(min, max) {
    return Math.random() * (max - min) + min;
}
const container = document.querySelector(".sakura-container");

function createPetal() {
  const petal = document.createElement("div");
  petal.classList.add("sakura");

  petal.style.left = Math.random() * window.innerWidth + "px";
  petal.style.animationDuration = 5 + Math.random() * 5 + "s";
  petal.style.opacity = Math.random();

  container.appendChild(petal);

  setTimeout(() => {
    petal.remove();
  }, 10000);
}

setInterval(createPetal, 300);
// Particle Class (The floating dust)
class Particle {
    constructor() { this.reset(); }
    reset() {
        this.x = random(0, w); 
        this.y = random(0, h); 
        this.size = random(0.5, 2);
        this.speedY = random(0.2, 0.8); 
        this.speedX = random(-0.2, 0.2);
        this.opacity = random(0.1, 0.6);
    }
    update() {
        this.y -= this.speedY; 
        this.x += this.speedX;
        if (this.y < 0) { this.y = h; this.x = random(0, w); }
    }
    draw() {
        // CHANGED TO RED RGBA
        ctx.fillStyle = `rgba(255, 38, 38, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Create Particles
for (let i = 0; i < 80; i++) particles.push(new Particle());

function animateParticles() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animateParticles);
}

// Start Dust
animateParticles();


/* --- NEW: RANDOM LIGHTNING GENERATOR --- */
function drawLightning(x) {
    // CHANGED TO RED
    lCtx.strokeStyle = 'rgba(255, 38, 38, 0.8)'; // Red Bolt
    lCtx.lineWidth = 2;
    lCtx.shadowBlur = 20;
    lCtx.shadowColor = '#ff2626'; // Red Shadow
    
    lCtx.beginPath();
    lCtx.moveTo(x, 0);
    
    let currentX = x;
    let currentY = 0;
    
    // Create jagged path down
    while(currentY < h) {
        let nextY = currentY + random(10, 30);
        let nextX = currentX + random(-20, 20);
        lCtx.lineTo(nextX, nextY);
        currentX = nextX;
        currentY = nextY;
    }
    lCtx.stroke();
    
    // Flash fade out (clear it quickly)
    setTimeout(() => {
        lCtx.clearRect(0, 0, w, h);
    }, 150); // Visible for 150ms
}

function randomLightningLoop() {
    // Random interval between 2s and 8s for next strike
    const timeToNextStrike = random(2000, 8000);
    
    setTimeout(() => {
        // Pick random X position on screen
        const strikeX = random(0, w);
        drawLightning(strikeX);
        // Loop
        randomLightningLoop();
    }, timeToNextStrike);
}

// Start Lightning Loop
randomLightningLoop();


/* --- MOBILE MENU & SCROLL --- */
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
if(hamburger) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        if(navLinks.classList.contains('active')) {
            navLinks.style.display = 'flex'; navLinks.style.flexDirection = 'column';
            navLinks.style.position = 'absolute'; navLinks.style.top = '70px';
            navLinks.style.right = '0'; navLinks.style.background = 'rgba(5, 5, 5, 0.95)';
            navLinks.style.width = '100%'; navLinks.style.padding = '20px';
            navLinks.style.borderBottom = '1px solid #ff2626'; // Changed to red
        } else { navLinks.style.display = 'none'; }
    });
}

const revealElements = document.querySelectorAll('.reveal');
const revealOnScroll = () => {
    const windowHeight = window.innerHeight;
    const elementVisible = 150;
    revealElements.forEach((reveal) => {
        const elementTop = reveal.getBoundingClientRect().top;
        if (elementTop < windowHeight - elementVisible) { reveal.classList.add('active'); }
    });
};
window.addEventListener('scroll', revealOnScroll);
revealOnScroll();
const names = [
    { text: "Manish Jadaun", color: "#ffffff" },
    { text: "Red~ Hunter", color: "#ff2626" },
    { text: "Shin Coder", color: "#39ff14" } // neon green
];

let currentIndex = 0;

const nameEl = document.getElementById("name-rotate");

function rotateName() {
    nameEl.classList.add("slide-out");

    setTimeout(() => {
        currentIndex = (currentIndex + 1) % names.length;

        nameEl.innerText = names[currentIndex].text;
        nameEl.style.color = names[currentIndex].color;
        nameEl.style.textShadow = `0 0 20px ${names[currentIndex].color}`;

        nameEl.classList.remove("slide-out");
        nameEl.classList.add("slide-in");
    }, 600);

    setTimeout(() => {
        nameEl.classList.remove("slide-in");
    }, 1200);
}

setInterval(rotateName, 3000); // 2 sec