// ===================================
// LUXURY BIRTHDAY WEBSITE - JavaScript
// Premium Interactive Features with Full-Page Navigation
// ===================================

// ===================================
// Global Variables
// ===================================
let musicPlaying = false;
let audioContext = null;
let loopTimeoutId = null;
let currentPage = 0;
const totalPages = 4;
let isTransitioning = false;

// ===================================
// Loading Screen
// ===================================
window.addEventListener('load', () => {
    setTimeout(() => {
        const loadingScreen = document.querySelector('.luxury-loading');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
        }
        
        // Initialize luxury particles
        initLuxuryParticles();
        
        // Initialize fullpage navigation
        initFullPageNavigation();
        
        // Start music after user interaction
        setTimeout(initMusicPlayer, 1000);
    }, 2500);
});

// ===================================
// Full-Page Navigation System
// ===================================
function initFullPageNavigation() {
    // Navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            const pageIndex = parseInt(link.dataset.page);
            navigateToPage(pageIndex);
        });
    });
    
    // Page indicators
    document.querySelectorAll('.page-dot').forEach(dot => {
        dot.addEventListener('click', () => {
            const pageIndex = parseInt(dot.dataset.page);
            navigateToPage(pageIndex);
        });
    });
    
    // Next page buttons
    document.querySelectorAll('.next-page-btn-romantic').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const nextPage = parseInt(btn.dataset.next);
            navigateToPage(nextPage);
        });
    });
    
}

function navigateToPage(pageIndex) {
    if (pageIndex === currentPage || isTransitioning) return;
    if (pageIndex < 0 || pageIndex >= totalPages) return;
    
    isTransitioning = true;
    
    const currentSection = document.querySelector(`.fullpage-section[data-page="${currentPage}"]`);
    const nextSection = document.querySelector(`.fullpage-section[data-page="${pageIndex}"]`);
    
    if (currentSection) {
        currentSection.classList.add('transitioning-out');
        currentSection.classList.remove('active');
    }
    
    if (nextSection) {
        nextSection.classList.add('active');
    }
    
    // Update page indicators
    document.querySelectorAll('.page-dot').forEach(dot => {
        dot.classList.remove('active');
    });
    const activeDot = document.querySelector(`.page-dot[data-page="${pageIndex}"]`);
    if (activeDot) {
        activeDot.classList.add('active');
    }
    
    currentPage = pageIndex;
    
    setTimeout(() => {
        if (currentSection) {
            currentSection.classList.remove('transitioning-out');
        }
        isTransitioning = false;
    }, 800);
}

// ===================================
// Luxury Particle System
// ===================================
function initLuxuryParticles() {
    const canvas = document.getElementById('luxury-particles');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const particleCount = window.innerWidth < 768 ? 30 : 60;
    
    class LuxuryParticle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
            this.opacity = Math.random() * 0.5 + 0.3;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;
        }
        
        draw() {
            ctx.fillStyle = `rgba(212, 175, 55, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw connection lines
            particles.forEach(particle => {
                const dx = this.x - particle.x;
                const dy = this.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    ctx.strokeStyle = `rgba(212, 175, 55, ${0.2 * (1 - distance / 100)})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(this.x, this.y);
                    ctx.lineTo(particle.x, particle.y);
                    ctx.stroke();
                }
            });
        }
    }
    
    for (let i = 0; i < particleCount; i++) {
        particles.push(new LuxuryParticle());
    }
    
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        requestAnimationFrame(animateParticles);
    }
    
    animateParticles();
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// ===================================
// Music Player - Happy Birthday Melody
// ===================================
function initMusicPlayer() {
    const musicToggle = document.querySelector('.music-toggle');
    if (!musicToggle) return;
    
    musicToggle.addEventListener('click', toggleMusic);
    
    // Auto-start music after first interaction
    document.addEventListener('click', () => {
        if (!musicPlaying && !audioContext) {
            startMusic();
        }
    }, { once: true });
}

function toggleMusic() {
    if (musicPlaying) {
        stopMusic();
    } else {
        startMusic();
    }
}

function startMusic() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    musicPlaying = true;
    playHappyBirthday();
    
    const musicIcon = document.querySelector('.music-icon');
    if (musicIcon) {
        musicIcon.textContent = '♫';
    }
}

function stopMusic() {
    musicPlaying = false;
    if (loopTimeoutId) {
        clearTimeout(loopTimeoutId);
        loopTimeoutId = null;
    }
    
    const musicIcon = document.querySelector('.music-icon');
    if (musicIcon) {
        musicIcon.textContent = '♪';
    }
}

function playHappyBirthday() {
    if (!audioContext || !musicPlaying) return;
    
    // Happy Birthday melody notes
    const melody = [
        { note: 261.63, duration: 0.3 }, // C
        { note: 261.63, duration: 0.3 }, // C
        { note: 293.66, duration: 0.6 }, // D
        { note: 261.63, duration: 0.6 }, // C
        { note: 349.23, duration: 0.6 }, // F
        { note: 329.63, duration: 1.2 }, // E
        
        { note: 261.63, duration: 0.3 }, // C
        { note: 261.63, duration: 0.3 }, // C
        { note: 293.66, duration: 0.6 }, // D
        { note: 261.63, duration: 0.6 }, // C
        { note: 392.00, duration: 0.6 }, // G
        { note: 349.23, duration: 1.2 }, // F
        
        { note: 261.63, duration: 0.3 }, // C
        { note: 261.63, duration: 0.3 }, // C
        { note: 523.25, duration: 0.6 }, // C5
        { note: 440.00, duration: 0.6 }, // A
        { note: 349.23, duration: 0.6 }, // F
        { note: 329.63, duration: 0.6 }, // E
        { note: 293.66, duration: 0.6 }, // D
        { note: 0, duration: 0.3 },
        
        { note: 466.16, duration: 0.3 }, // Bb
        { note: 466.16, duration: 0.3 }, // Bb
        { note: 440.00, duration: 0.6 }, // A
        { note: 349.23, duration: 0.6 }, // F
        { note: 392.00, duration: 0.6 }, // G
        { note: 349.23, duration: 1.2 }  // F
    ];
    
    let currentTime = audioContext.currentTime;
    
    melody.forEach(({ note, duration }) => {
        if (note > 0) {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(note, currentTime);
            
            gainNode.gain.setValueAtTime(0, currentTime);
            gainNode.gain.linearRampToValueAtTime(0.1, currentTime + 0.05);
            gainNode.gain.linearRampToValueAtTime(0.08, currentTime + duration - 0.05);
            gainNode.gain.linearRampToValueAtTime(0, currentTime + duration);
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.start(currentTime);
            oscillator.stop(currentTime + duration);
        }
        currentTime += duration;
    });
    
    if (loopTimeoutId) {
        clearTimeout(loopTimeoutId);
    }
    
    loopTimeoutId = setTimeout(() => {
        if (musicPlaying) {
            playHappyBirthday();
        }
    }, currentTime * 1000 + 2000);
}

// ===================================
// Navigation Scroll Effect
// ===================================
// Not needed for full-page navigation
// Navigation stays consistent across all pages

// ===================================
// Smooth Scroll for Navigation
// ===================================
// Replaced by full-page navigation system

// ===================================
// Scroll Down Button
// ===================================
// Handled by next-page-btn in full-page navigation

// ===================================
// Removed: Birthday Countdown
// Countdown section removed per user request
// ===================================

// ===================================
// Luxury Candles
// ===================================
const candles = document.querySelectorAll('.luxury-candle');
let blownCandles = 0;
let candlesBlown = false;

candles.forEach(candle => {
    const blowOut = () => {
        if (candlesBlown) return;
        
        candles.forEach(c => c.classList.add('blown'));
        blownCandles = candles.length;
        candlesBlown = true;
        
        setTimeout(() => {
            triggerConfetti();
            updateCakeMessage();
        }, 300);
    };
    
    candle.addEventListener('click', blowOut);
    candle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            blowOut();
        }
    });
});

function updateCakeMessage() {
    const instruction = document.querySelector('.cake-instruction-luxury');
    if (instruction) {
        instruction.textContent = '✨ Your wish has been made! ✨';
        instruction.style.color = 'var(--luxury-gold)';
        instruction.style.fontWeight = '600';
    }
}

// ===================================
// Confetti Effect
// ===================================
function triggerConfetti() {
    const colors = ['#D4AF37', '#B76E79', '#667eea', '#764ba2', '#f093fb'];
    const confettiCount = 100;
    
    for (let i = 0; i < confettiCount; i++) {
        createConfetti(colors[Math.floor(Math.random() * colors.length)]);
    }
}

function createConfetti(color) {
    const confetti = document.createElement('div');
    confetti.style.position = 'fixed';
    confetti.style.width = '10px';
    confetti.style.height = '10px';
    confetti.style.backgroundColor = color;
    confetti.style.left = Math.random() * window.innerWidth + 'px';
    confetti.style.top = '-20px';
    confetti.style.opacity = '1';
    confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
    confetti.style.pointerEvents = 'none';
    confetti.style.zIndex = '9999';
    confetti.style.borderRadius = '2px';
    
    document.body.appendChild(confetti);
    
    const animation = confetti.animate([
        {
            transform: `translate(0, 0) rotate(0deg)`,
            opacity: 1
        },
        {
            transform: `translate(${(Math.random() - 0.5) * 200}px, ${window.innerHeight}px) rotate(${Math.random() * 720}deg)`,
            opacity: 0
        }
    ], {
        duration: 3000 + Math.random() * 2000,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    });
    
    animation.onfinish = () => confetti.remove();
}

// ===================================
// Luxury Envelope
// ===================================
const envelope = document.getElementById('luxuryEnvelope');
const envelopeHint = document.querySelector('.envelope-hint');

if (envelope) {
    envelope.addEventListener('click', () => {
        envelope.classList.toggle('open');
        
        if (envelope.classList.contains('open')) {
            if (envelopeHint) {
                envelopeHint.textContent = 'Click to close';
            }
            setTimeout(() => triggerConfetti(), 500);
        } else {
            if (envelopeHint) {
                envelopeHint.textContent = 'Click to open';
            }
        }
    });
}

// ===================================
// Intersection Observer for Animations
// ===================================
// Simplified for full-page navigation
// Timeline items are always visible on their page

// ===================================
// Parallax Effect
// ===================================
// Disabled for full-page navigation

// ===================================
// Hover Effects for Message Cards
// ===================================
document.querySelectorAll('.luxury-message-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-15px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
    
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'article');
});

// ===================================
// Console Easter Egg
// ===================================
console.log(
    '%c💎 Happy Birthday Wifey! 💎',
    'font-size: 24px; color: #D4AF37; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.3); font-family: Cinzel, serif;'
);
console.log(
    '%cMade with ❤️ and luxury for the most extraordinary woman',
    'font-size: 14px; color: #B76E79; font-style: italic; font-family: Cormorant Garamond, serif;'
);

// ===================================
// Prevent Right Click (Optional)
// ===================================
// Uncomment to prevent right-click
// document.addEventListener('contextmenu', (e) => e.preventDefault());

// ===================================
// Performance Optimization
// ===================================
// Debounce resize events
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Re-initialize particles on resize
        const canvas = document.getElementById('luxury-particles');
        if (canvas) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
    }, 250);
});
