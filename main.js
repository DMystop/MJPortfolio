/* =============================================
   JULIO.DEV — MAIN JAVASCRIPT
   ============================================= */


/* ─── CUSTOM CURSOR RÉTICULE ─────────────────── */

const reticle = document.querySelector('.cursor-reticle');
const dot = document.querySelector('.cursor-dot');

let mouseX = -200, mouseY = -200;
let reticleX = -200, reticleY = -200;

document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top = mouseY + 'px';
});

// Léger lag sur le réticule pour effet smooth
function animateReticle() {
    reticleX += (mouseX - reticleX) * 0.18;
    reticleY += (mouseY - reticleY) * 0.18;
    reticle.style.left = reticleX + 'px';
    reticle.style.top = reticleY + 'px';
    requestAnimationFrame(animateReticle);
}
animateReticle();

document.addEventListener('mouseleave', () => {
    reticle.style.opacity = '0';
    dot.style.opacity = '0';
});
document.addEventListener('mouseenter', () => {
    reticle.style.opacity = '1';
    dot.style.opacity = '1';
});


/* ─── TYPING EFFECT HERO ─────────────────────── */

const typingEl = document.getElementById('hero-typing');

const phrases = [
    'Game Developer',
    'Unreal Engine Developer',
    'C++ Programmer',
    'Unity Developer',
    'C# Programmer',
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;

function type() {
    if (!typingEl) return;

    const currentPhrase = phrases[phraseIndex];

    if (!isDeleting) {
        typingEl.textContent = currentPhrase.slice(0, charIndex + 1);
        charIndex++;

        if (charIndex === currentPhrase.length) {
            // Pause avant d'effacer
            setTimeout(() => {
                isDeleting = true;
                setTimeout(type, 80);
            }, 2000);
            return;
        }
    } else {
        typingEl.textContent = currentPhrase.slice(0, charIndex - 1);
        charIndex--;

        if (charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            setTimeout(type, 400);
            return;
        }
    }

    const speed = isDeleting ? 50 : 90;
    setTimeout(type, speed);
}

// Démarrer après l'animation d'entrée
setTimeout(type, 1000);


/* ─── SCROLL REVEAL + TYPING SECTION LABELS ─── */

const revObs = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
        if (e.isIntersecting) {
            setTimeout(() => {
                e.target.classList.add('in');
                if (e.target.matches('.section-label[data-type-text]')) {
                    typeSectionLabel(e.target);
                }
            }, i * 80);
            revObs.unobserve(e.target);
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revObs.observe(el));

function typeSectionLabel(el) {
    const text = el.dataset.typeText || '';

    function runCycle() {
        // Phase 1 : écriture
        el.classList.remove('typed');
        el.textContent = '';
        let i = 0;
        const writeInterval = setInterval(() => {
            el.textContent = text.slice(0, i + 1);
            i++;
            if (i >= text.length) {
                clearInterval(writeInterval);
                el.classList.add('typed'); // retire curseur

                // Phase 2 : pause longue (8–14s aléatoire)
                const pauseMs = 8000 + Math.random() * 6000;
                setTimeout(() => {
                    // Phase 3 : effacement rapide
                    el.classList.remove('typed');
                    let j = text.length;
                    const eraseInterval = setInterval(() => {
                        el.textContent = text.slice(0, j - 1);
                        j--;
                        if (j <= 0) {
                            clearInterval(eraseInterval);
                            // Phase 4 : courte pause avant de retaper
                            setTimeout(runCycle, 500);
                        }
                    }, 22);
                }, pauseMs);
            }
        }, 38);
    }

    runCycle();
}


/* ─── SKILL BARS ─────────────────────────────── */

const barObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('.bar-fill').forEach(b => {
                b.style.width = b.dataset.width + '%';
            });
            barObs.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-group').forEach(g => barObs.observe(g));


/* ─── NAV ACTIVE SECTION ─────────────────────── */

const navLinks = document.querySelectorAll('nav a[data-section]');

const secObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.id;
            navLinks.forEach(a => a.classList.toggle('active', a.dataset.section === id));
        }
    });
}, { rootMargin: '-40% 0px -55% 0px' });

document.querySelectorAll('section[id]').forEach(s => secObs.observe(s));


/* ─── BACK TO TOP ────────────────────────────── */

const btt = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
    btt.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });

btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));


/* ─── LAZY YOUTUBE ───────────────────────────── */

document.querySelectorAll('.project-thumb[data-video-id]').forEach(thumb => {
    thumb.addEventListener('click', () => {
        if (thumb.classList.contains('playing')) return;
        const iframe = thumb.querySelector('iframe');
        iframe.src = 'https://www.youtube-nocookie.com/embed/' + thumb.dataset.videoId + '?autoplay=1&rel=0';
        thumb.classList.add('playing');
    });
});