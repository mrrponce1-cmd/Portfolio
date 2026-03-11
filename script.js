// Wait for everything to load before running GSAP code
window.addEventListener('load', function() {
    // Check if GSAP loaded properly
    if (typeof gsap === 'undefined') {
        console.error('GSAP not loaded! Check your internet connection.');
        return;
    }
    
    // Register ScrollTrigger safely
    if (typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        console.log('GSAP and ScrollTrigger loaded successfully');
    } else {
        console.warn('ScrollTrigger not loaded, animations disabled');
    }
    
    // Initialize all functionality
    initCursor();
    initMagneticButtons();
    initTextScramble();
    initAnimations();
    initSmoothScroll();
});

// Custom Cursor
function initCursor() {
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    
    if (!cursorDot || !cursorOutline) return;
    
    // Skip on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;
    
    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    });

    // Cursor hover effect
    document.querySelectorAll('[data-cursor="hover"]').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorOutline.classList.add('hover');
        });
        el.addEventListener('mouseleave', () => {
            cursorOutline.classList.remove('hover');
        });
    });
}

// Magnetic Buttons
function initMagneticButtons() {
    document.querySelectorAll('.magnetic-btn').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });
}

// Mobile Menu Toggle - Make it global so HTML can access it
window.toggleMenu = function() {
    const menu = document.getElementById('mobile-menu');
    if (menu) {
        menu.classList.toggle('translate-x-full');
    }
};

// Text Scramble Effect
function initTextScramble() {
    const subtitle = document.getElementById('subtitle');
    if (!subtitle) return;
    
    const fx = new TextScramble(subtitle);
    let counter = 0;
    const phrases = [
        'Creative Developer & Designer',
        'Frontend Engineer & Artist',
        'UI/UX Specialist',
        'WebGL Enthusiast'
    ];

    const next = () => {
        fx.setText(phrases[counter]).then(() => {
            setTimeout(next, 3000);
        });
        counter = (counter + 1) % phrases.length;
    };

    setTimeout(next, 2000);
}

class TextScramble {
    constructor(el) {
        this.el = el;
        this.chars = '!<>-_\\/[]{}—=+*^?#________';
        this.update = this.update.bind(this);
    }
    
    setText(newText) {
        const oldText = this.el.innerText;
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise((resolve) => this.resolve = resolve);
        this.queue = [];
        for (let i = 0; i < length; i++) {
            const from = oldText[i] || '';
            const to = newText[i] || '';
            const start = Math.floor(Math.random() * 40);
            const end = start + Math.floor(Math.random() * 40);
            this.queue.push({ from, to, start, end });
        }
        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
        return promise;
    }
    
    update() {
        let output = '';
        let complete = 0;
        for (let i = 0, n = this.queue.length; i < n; i++) {
            let { from, to, start, end, char } = this.queue[i];
            if (this.frame >= end) {
                complete++;
                output += to;
            } else if (this.frame >= start) {
                if (!char || Math.random() < 0.28) {
                    char = this.randomChar();
                    this.queue[i].char = char;
                }
                output += `<span class="text-primary">${char}</span>`;
            } else {
                output += from;
            }
        }
        this.el.innerHTML = output;
        if (complete === this.queue.length) {
            this.resolve();
        } else {
            this.frameRequest = requestAnimationFrame(this.update);
            this.frame++;
        }
    }
    
    randomChar() {
        return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
}

// All GSAP Animations
function initAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    
    // Scroll Reveal Animations
    gsap.utils.toArray('.reveal-up').forEach((elem, i) => {
        gsap.fromTo(elem, 
            { opacity: 0, y: 30 },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: elem,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                },
                delay: elem.style.animationDelay ? parseFloat(elem.style.animationDelay) : 0
            }
        );
    });

    // Coming Soon Cards Animation
    gsap.utils.toArray('.coming-soon-card').forEach((card, i) => {
        gsap.fromTo(card,
            { opacity: 0, y: 50 },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: card,
                    start: "top 85%",
                },
                delay: i * 0.1
            }
        );
    });

    // Skill Tags Stagger Animation
    gsap.fromTo('.skill-tag',
        { opacity: 0, scale: 0.8 },
        {
            opacity: 1,
            scale: 1,
            duration: 0.4,
            stagger: 0.05,
            ease: "back.out(1.7)",
            scrollTrigger: {
                trigger: '#skills',
                start: "top 70%"
            }
        }
    );
}

// Smooth Scroll
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Parallax Effect for Hero Shapes (runs immediately, doesn't need GSAP)
document.addEventListener('mousemove', (e) => {
    const shapes = document.querySelectorAll('.hero-shape');
    if (shapes.length === 0) return;
    
    shapes.forEach((shape, index) => {
        const speed = (index + 1) * 20;
        const xOffset = (window.innerWidth / 2 - e.clientX) / speed;
        const yOffset = (window.innerHeight / 2 - e.clientY) / speed;
        
        shape.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
    });
});

// Velocity-based skew effect on scroll
let currentSkew = 0;
let targetSkew = 0;

window.addEventListener('scroll', () => {
    targetSkew = Math.min(Math.max(window.scrollY - (window.lastScrollY || 0), -5), 5);
    window.lastScrollY = window.scrollY;
});

function updateSkew() {
    currentSkew += (targetSkew - currentSkew) * 0.1;
    targetSkew *= 0.9;
    
    document.querySelectorAll('.coming-soon-card, .glass').forEach(el => {
        if (!el.matches(':hover')) {
            el.style.transform = `skewY(${currentSkew * 0.5}deg)`;
        }
    });
    
    requestAnimationFrame(updateSkew);
}
updateSkew();