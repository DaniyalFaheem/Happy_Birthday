// ===================================
// Global Variables
// ===================================
let currentVideoIndex = 0;
const totalVideos = 4;
let musicPlaying = false;
let particlesArray = [];
let confettiArray = [];
let mouseX = 0;
let mouseY = 0;

// ===================================
// Loading Screen
// ===================================
window.addEventListener('load', () => {
    setTimeout(() => {
        const loadingScreen = document.querySelector('.loading-screen');
        loadingScreen.classList.add('hidden');
        
        // Trigger hero animations
        triggerConfetti();
        
        // Start particle animation
        initParticles();
        animate();
    }, 2000);
});

// ===================================
// Custom Cursor (Desktop Only)
// ===================================
if (window.innerWidth >= 1025) {
    const cursor = document.querySelector('.custom-cursor');
    const cursorDot = document.querySelector('.custom-cursor-dot');
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        cursorDot.style.left = e.clientX + 'px';
        cursorDot.style.top = e.clientY + 'px';
    });
    
    // Cursor hover effects
    const interactiveElements = document.querySelectorAll('a, button, .flip-card, .candle, .envelope');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursorDot.style.transform = 'translate(-50%, -50%) scale(1.5)';
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    });
}

// ===================================
// Happy Birthday Music Generator
// ===================================
// Using Web Audio API to generate "Happy Birthday to You" melody
let audioContext;
let loopTimeoutId = null;

function createHappyBirthdayMelody() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    // Happy Birthday melody notes (in Hz)
    // C4=261.63, D4=293.66, E4=329.63, F4=349.23, G4=392.00, A4=440.00, B4=493.88, C5=523.25
    const melody = [
        // "Happy birth-day to you" (first line)
        { note: 261.63, duration: 0.3 }, // C (Happy)
        { note: 261.63, duration: 0.3 }, // C (birth-)
        { note: 293.66, duration: 0.6 }, // D (day)
        { note: 261.63, duration: 0.6 }, // C (to)
        { note: 349.23, duration: 0.6 }, // F (you)
        { note: 329.63, duration: 1.2 }, // E (pause)
        
        // "Happy birth-day to you" (second line)
        { note: 261.63, duration: 0.3 }, // C
        { note: 261.63, duration: 0.3 }, // C
        { note: 293.66, duration: 0.6 }, // D
        { note: 261.63, duration: 0.6 }, // C
        { note: 392.00, duration: 0.6 }, // G
        { note: 349.23, duration: 1.2 }, // F
        
        // "Happy birth-day dear Wifey" (third line)
        { note: 261.63, duration: 0.3 }, // C
        { note: 261.63, duration: 0.3 }, // C
        { note: 523.25, duration: 0.6 }, // C5
        { note: 440.00, duration: 0.6 }, // A
        { note: 349.23, duration: 0.6 }, // F
        { note: 329.63, duration: 0.6 }, // E
        { note: 293.66, duration: 0.6 }, // D
        { note: 0, duration: 0.3 }, // pause
        
        // "Happy birth-day to you" (final line)
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
            
            // Envelope for smooth sound
            gainNode.gain.setValueAtTime(0, currentTime);
            gainNode.gain.linearRampToValueAtTime(0.15, currentTime + 0.05);
            gainNode.gain.linearRampToValueAtTime(0.1, currentTime + duration - 0.05);
            gainNode.gain.linearRampToValueAtTime(0, currentTime + duration);
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.start(currentTime);
            oscillator.stop(currentTime + duration);
        }
        currentTime += duration;
    });
    
    // Clear any existing loop timeout to prevent accumulation
    if (loopTimeoutId) {
        clearTimeout(loopTimeoutId);
    }
    
    // Loop the melody
    loopTimeoutId = setTimeout(() => {
        if (musicPlaying) {
            createHappyBirthdayMelody();
        }
    }, currentTime * 1000 + 2000); // Add 2 second pause before repeating
}

// Auto-play music after user interaction (required by browsers)
function startMusic() {
    if (!musicPlaying) {
        musicPlaying = true;
        createHappyBirthdayMelody();
    }
}

// Start music when page loads (after loading screen)
window.addEventListener('load', () => {
    setTimeout(() => {
        // Try to play automatically
        startMusic();
        
        // If auto-play is blocked, start on first user interaction
        const startOnInteraction = () => {
            startMusic();
            document.removeEventListener('click', startOnInteraction);
            document.removeEventListener('touchstart', startOnInteraction);
        };
        
        document.addEventListener('click', startOnInteraction, { once: true });
        document.addEventListener('touchstart', startOnInteraction, { once: true });
    }, 2500); // Start after loading screen
});

// ===================================
// Particle System (Floating Hearts)
// ===================================
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 20 + 10;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * -1 - 0.5;
        this.opacity = Math.random() * 0.5 + 0.2;
        this.hearts = ['💝', '💖', '💗', '💕', '💘'];
        this.heart = this.hearts[Math.floor(Math.random() * this.hearts.length)];
    }
    
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        if (this.y < -50) {
            this.y = canvas.height + 50;
            this.x = Math.random() * canvas.width;
        }
        
        if (this.x < -50) this.x = canvas.width + 50;
        if (this.x > canvas.width + 50) this.x = -50;
    }
    
    draw() {
        ctx.globalAlpha = this.opacity;
        ctx.font = this.size + 'px Arial';
        ctx.fillText(this.heart, this.x, this.y);
        ctx.globalAlpha = 1;
    }
}

function initParticles() {
    particlesArray = [];
    const particleCount = window.innerWidth < 768 ? 20 : 40;
    
    for (let i = 0; i < particleCount; i++) {
        particlesArray.push(new Particle());
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particlesArray.forEach(particle => {
        particle.update();
        particle.draw();
    });
    
    requestAnimationFrame(animate);
}

// ===================================
// Confetti Animation
// ===================================
class Confetti {
    constructor() {
        this.x = Math.random() * window.innerWidth;
        this.y = -10;
        this.size = Math.random() * 10 + 5;
        this.speedY = Math.random() * 3 + 2;
        this.speedX = Math.random() * 2 - 1;
        this.color = this.getRandomColor();
        this.rotation = Math.random() * 360;
        this.rotationSpeed = Math.random() * 10 - 5;
    }
    
    getRandomColor() {
        const colors = ['#ff69b4', '#ff1493', '#ffd700', '#9d4edd', '#ffb6c1', '#ffc0cb'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.rotation += this.rotationSpeed;
        
        if (this.y > window.innerHeight) {
            return false;
        }
        return true;
    }
}

function triggerConfetti() {
    const confettiContainer = document.getElementById('confetti-container');
    
    for (let i = 0; i < 150; i++) {
        setTimeout(() => {
            const confettiPiece = document.createElement('div');
            const confetti = new Confetti();
            
            confettiPiece.style.position = 'absolute';
            confettiPiece.style.left = confetti.x + 'px';
            confettiPiece.style.top = confetti.y + 'px';
            confettiPiece.style.width = confetti.size + 'px';
            confettiPiece.style.height = confetti.size + 'px';
            confettiPiece.style.backgroundColor = confetti.color;
            confettiPiece.style.transform = `rotate(${confetti.rotation}deg)`;
            confettiPiece.style.pointerEvents = 'none';
            
            confettiContainer.appendChild(confettiPiece);
            
            function animateConfetti() {
                if (confetti.update()) {
                    confettiPiece.style.top = confetti.y + 'px';
                    confettiPiece.style.left = confetti.x + 'px';
                    confettiPiece.style.transform = `rotate(${confetti.rotation}deg)`;
                    requestAnimationFrame(animateConfetti);
                } else {
                    confettiPiece.remove();
                }
            }
            
            animateConfetti();
        }, i * 20);
    }
}

// ===================================
// Scroll Animations (Intersection Observer)
// ===================================
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe reveal elements
document.querySelectorAll('.reveal-text').forEach(el => observer.observe(el));
document.querySelectorAll('.timeline-item').forEach(el => observer.observe(el));
document.querySelectorAll('.message-card').forEach((el, index) => {
    el.style.transitionDelay = `${index * 0.1}s`;
    observer.observe(el);
});

// ===================================
// Smooth Scroll
// ===================================
document.querySelector('.scroll-indicator')?.addEventListener('click', () => {
    document.querySelector('#cake').scrollIntoView({ behavior: 'smooth' });
});

// ===================================
// Birthday Cake - Candle Blowing
// ===================================
const candles = document.querySelectorAll('.candle');
let blownCandles = 0;

candles.forEach(candle => {
    candle.addEventListener('click', () => {
        if (!candle.classList.contains('blown-out')) {
            candle.classList.add('blown-out');
            blownCandles++;
            
            // Trigger confetti when all candles are blown
            if (blownCandles === candles.length) {
                setTimeout(() => {
                    triggerConfetti();
                    showCelebrationMessage();
                }, 300);
            }
        }
    });
});

function showCelebrationMessage() {
    const instruction = document.querySelector('.cake-instruction');
    instruction.textContent = '🎉 Yay! Your wish is on its way! 🎉';
    instruction.style.color = '#ff69b4';
    instruction.style.fontWeight = '600';
    instruction.style.fontSize = '1.1rem';
}

// ===================================
// Flip Cards
// ===================================
const flipCards = document.querySelectorAll('.flip-card');

flipCards.forEach(card => {
    card.addEventListener('click', () => {
        card.classList.toggle('flipped');
    });
    
    // Touch support for mobile
    card.addEventListener('touchstart', (e) => {
        e.preventDefault();
        card.classList.toggle('flipped');
    }, { passive: false });
});

// ===================================
// Video Gallery Carousel
// ===================================
const videoWrappers = document.querySelectorAll('.video-wrapper');
const prevBtn = document.querySelector('.carousel-btn.prev');
const nextBtn = document.querySelector('.carousel-btn.next');
const dots = document.querySelectorAll('.dot');
const videos = document.querySelectorAll('.memory-video');

function showVideo(index) {
    // Pause all videos
    videos.forEach(video => video.pause());
    
    // Hide all wrappers
    videoWrappers.forEach(wrapper => wrapper.classList.remove('active'));
    
    // Remove active from all dots
    dots.forEach(dot => dot.classList.remove('active'));
    
    // Show current video
    videoWrappers[index].classList.add('active');
    dots[index].classList.add('active');
    
    currentVideoIndex = index;
}

prevBtn.addEventListener('click', () => {
    const newIndex = currentVideoIndex === 0 ? totalVideos - 1 : currentVideoIndex - 1;
    showVideo(newIndex);
});

nextBtn.addEventListener('click', () => {
    const newIndex = currentVideoIndex === totalVideos - 1 ? 0 : currentVideoIndex + 1;
    showVideo(newIndex);
});

dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        showVideo(index);
    });
});

// Keyboard navigation for video carousel
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        prevBtn.click();
    } else if (e.key === 'ArrowRight') {
        nextBtn.click();
    }
});

// Touch swipe support for mobile
let touchStartX = 0;
let touchEndX = 0;

const videoContainer = document.querySelector('.video-container');

videoContainer.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

videoContainer.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}, { passive: true });

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe left - next
            nextBtn.click();
        } else {
            // Swipe right - prev
            prevBtn.click();
        }
    }
}

// ===================================
// Envelope Animation
// ===================================
const envelope = document.getElementById('envelope');
const envelopeInstruction = document.querySelector('.envelope-instruction');

envelope.addEventListener('click', () => {
    envelope.classList.toggle('open');
    
    if (envelope.classList.contains('open')) {
        envelopeInstruction.textContent = 'Click again to close';
        setTimeout(() => {
            triggerConfetti();
        }, 500);
    } else {
        envelopeInstruction.textContent = 'Click the envelope to open your surprise!';
    }
});

// ===================================
// Birthday Countdown
// ===================================
function updateCountdown() {
    let birthday = new Date('2026-01-24T00:00:00');
    const now = new Date();
    
    // If birthday has passed this year, set to next year
    if (now > birthday) {
        birthday.setFullYear(birthday.getFullYear() + 1);
    }
    
    const diff = birthday - now;
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    const countdownElement = document.getElementById('countdown');
    if (countdownElement) {
        if (days === 0 && hours === 0 && minutes === 0 && seconds === 0) {
            countdownElement.innerHTML = '<div class="countdown-complete">🎉 Happy Birthday Wifey! ❤️ 🎉</div>';
            triggerConfetti();
        } else if (days === 0 && hours === 0 && minutes === 0) {
            countdownElement.innerHTML = `
                <div class="countdown-item">
                    <span class="countdown-value">${seconds}</span>
                    <span class="countdown-label">Seconds</span>
                </div>
            `;
        } else if (days === 0 && hours === 0) {
            countdownElement.innerHTML = `
                <div class="countdown-item">
                    <span class="countdown-value">${minutes}</span>
                    <span class="countdown-label">Minutes</span>
                </div>
                <div class="countdown-item">
                    <span class="countdown-value">${seconds}</span>
                    <span class="countdown-label">Seconds</span>
                </div>
            `;
        } else if (days === 0) {
            countdownElement.innerHTML = `
                <div class="countdown-item">
                    <span class="countdown-value">${hours}</span>
                    <span class="countdown-label">Hours</span>
                </div>
                <div class="countdown-item">
                    <span class="countdown-value">${minutes}</span>
                    <span class="countdown-label">Minutes</span>
                </div>
                <div class="countdown-item">
                    <span class="countdown-value">${seconds}</span>
                    <span class="countdown-label">Seconds</span>
                </div>
            `;
        } else {
            countdownElement.innerHTML = `
                <div class="countdown-item">
                    <span class="countdown-value">${days}</span>
                    <span class="countdown-label">Days</span>
                </div>
                <div class="countdown-item">
                    <span class="countdown-value">${hours}</span>
                    <span class="countdown-label">Hours</span>
                </div>
                <div class="countdown-item">
                    <span class="countdown-value">${minutes}</span>
                    <span class="countdown-label">Minutes</span>
                </div>
                <div class="countdown-item">
                    <span class="countdown-value">${seconds}</span>
                    <span class="countdown-label">Seconds</span>
                </div>
            `;
        }
    }
}

// Update countdown every second
setInterval(updateCountdown, 1000);
updateCountdown();

// ===================================
// Performance Optimization
// ===================================

// Lazy load videos
const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const video = entry.target;
            video.load();
            videoObserver.unobserve(video);
        }
    });
}, { rootMargin: '100px' });

videos.forEach(video => videoObserver.observe(video));

// ===================================
// Prevent right-click on videos (optional)
// ===================================
videos.forEach(video => {
    video.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        return false;
    });
});

// ===================================
// Console Easter Egg
// ===================================
console.log('%c💝 Happy Birthday Wifey! ❤️ 💝', 'font-size: 30px; color: #ff69b4; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.2);');
console.log('%cMade with ❤️ for the most wonderful wife in the world', 'font-size: 14px; color: #9d4edd; font-style: italic;');
