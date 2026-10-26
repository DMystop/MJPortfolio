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
    // Le texte est relu à chaque tick pour suivre un changement de langue en cours d'animation
    const getText = () => el.dataset.typeText || '';

    function runCycle() {
        // Phase 1 : écriture
        el.classList.remove('typed');
        el.textContent = '';
        let i = 0;
        const writeInterval = setInterval(() => {
            const text = getText();
            el.textContent = text.slice(0, i + 1);
            i++;
            if (i >= text.length) {
                clearInterval(writeInterval);
                el.textContent = text;
                el.classList.add('typed'); // retire curseur

                // Phase 2 : pause longue (8–14s aléatoire)
                const pauseMs = 8000 + Math.random() * 6000;
                setTimeout(() => {
                    // Phase 3 : effacement rapide
                    el.classList.remove('typed');
                    let j = el.textContent.length;
                    const eraseInterval = setInterval(() => {
                        el.textContent = el.textContent.slice(0, j - 1);
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


/* ─── SKILLS (apparition des listes) ─────────── */

const skillObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            skillObs.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-group').forEach(g => skillObs.observe(g));


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


/* =============================================
   TRADUCTION FR / EN
   ---------------------------------------------
   - Le français est lu directement dans le HTML (texte d'origine),
     il n'est donc pas dupliqué ici.
   - L'anglais est défini dans le dictionnaire EN ci-dessous.
   - Éléments concernés :
       data-i18n="clé"                → remplace le contenu (HTML)
       data-i18n-type="clé"           → texte des labels animés (// 01 — ...)
       data-i18n-attr="attribut:clé"  → remplace un attribut (aria-label, content...)
   ============================================= */

const CV_FILES = {
    fr: { href: 'CV Mouls Julio FR.pdf', download: 'CV-Julio-Mouls-FR.pdf' },
    en: { href: 'CV Mouls Julio EN.pdf', download: 'Resume-Julio-Mouls-EN.pdf' },
};

const EN = {
    'meta.desc': 'Portfolio of Julio Mouls, passionate video game developer. Unreal Engine, Unity, C++, C# projects.',
    'meta.ogdesc': 'Passionate video game developer — Unreal Engine, Unity, C++, C#.',

    'nav.projects': 'Projects',
    'nav.skills': 'Skills',
    'nav.about': 'About',
    'nav.contact': 'Contact',

    'hero.title': 'I create<br>playable<br><em>worlds</em>.',
    'hero.desc': 'Passionate video game developer, I design memorable interactive experiences — from the initial idea to the final prototype.',
    'hero.cta1': 'See my projects',
    'hero.cta2': 'Contact me',

    'label.projects': '// 01 — Work',
    'label.skills': '// 02 — Tech stack',
    'label.about': '// 03 — About',
    'label.contact': '// 04 — Contact',

    'title.projects': 'Recent <span>projects</span>',
    'title.skills': 'Skills',
    'title.about': 'Who <span>am I?</span>',
    'title.contact': 'Let\u2019s work <span>together</span>',

    'project.view': 'View project →',
    'tag.personal': 'Personal Project',
    'sunward.desc': 'Platformer/Adventure game in which the character must climb back to the surface by exploring diverse biomes.',
    'sunward.link': 'Coming soon on Steam',
    'imagiro.desc': 'Platformer/Adventure/Puzzle game set in an origami world.',
    'galaxy.desc': 'Space Platformer/Adventure video game, featuring a stunning gravity system.',
    'galaxy.link': 'Project in development, contact me for a test version',
    'curse.desc': 'Recreation of the CurseForge application in C# / WPF.',
    'crypt.desc': 'Recreation of Crypt Of The Necrodancer, a rhythm roguelike game.',
    'granny.desc': 'Control a grandmother and her shopping cart in a supermarket. She has to face other grandmothers and collect the items on her shopping list as quickly as possible to reach the checkout first! Developed in 2 weeks.',

    'skills.engines': 'Game engines',
    'skills.languages': 'Languages',
    'skills.libraries': 'Libraries',
    'skills.software': 'Software',

    'about.p1': 'A video game enthusiast since childhood, I turned that passion into a career. I started by making small games on Scratch, before diving into more ambitious projects with Unreal Engine and Unity. I have been developing games for 3 years, solo and in teams, with particular attention to <em>game feel</em> and to mechanics that make you want to play again.',
    'about.p2': 'I especially love indie games that take creative risks — it is what guides my own design approach.',
    'about.p3': 'Available for collaborations, game jams, and full-time or freelance job opportunities.',
    'about.cv': 'Download my resume →',
    'stat.projects': 'Projects completed',
    'stat.xp': 'Years of studies',
    'stat.engines': 'Engines mastered',

    'contact.text': 'Got a project idea? A collaboration? Feel free to get in touch.',
    'footer.text': '\u00A9 2026 Julio Mouls — Long live code',
    'a11y.top': 'Back to top',
};

const I18N = { en: EN };
const frAttrCache = new WeakMap(); // originaux français des attributs traduits

function applyLanguage(lang) {
    document.documentElement.lang = lang;
    const isFr = lang === 'fr';

    // Contenu HTML
    document.querySelectorAll('[data-i18n]').forEach(el => {
        if (!('i18nFr' in el.dataset)) el.dataset.i18nFr = el.innerHTML;
        el.innerHTML = isFr ? el.dataset.i18nFr : (I18N.en[el.dataset.i18n] ?? el.dataset.i18nFr);
    });

    // Labels animés (// 01 — ...)
    document.querySelectorAll('[data-i18n-type]').forEach(el => {
        if (!('typeTextFr' in el.dataset)) el.dataset.typeTextFr = el.dataset.typeText;
        el.dataset.typeText = isFr ? el.dataset.typeTextFr : (I18N.en[el.dataset.i18nType] ?? el.dataset.typeTextFr);
        // Si le label est affiché en entier (phase de pause), on le met à jour tout de suite
        if (el.classList.contains('typed')) el.textContent = el.dataset.typeText;
    });

    // Attributs (aria-label, meta content...)
    document.querySelectorAll('[data-i18n-attr]').forEach(el => {
        const [attr, key] = el.dataset.i18nAttr.split(':');
        const cache = frAttrCache.get(el) || {};
        if (!(attr in cache)) {
            cache[attr] = el.getAttribute(attr);
            frAttrCache.set(el, cache);
        }
        el.setAttribute(attr, isFr ? cache[attr] : (I18N.en[key] ?? cache[attr]));
    });

    // CV selon la langue
    const cv = document.getElementById('cv-link');
    if (cv) {
        cv.setAttribute('href', CV_FILES[lang].href);
        cv.setAttribute('download', CV_FILES[lang].download);
    }

    // État des boutons FR / EN
    document.querySelectorAll('.lang-btn').forEach(btn => {
        const active = btn.dataset.lang === lang;
        btn.classList.toggle('active', active);
        btn.setAttribute('aria-pressed', active);
    });
}

function setLanguage(lang) {
    try { localStorage.setItem('lang', lang); } catch (e) { /* stockage indisponible */ }
    applyLanguage(lang);
}

function getInitialLanguage() {
    try {
        const saved = localStorage.getItem('lang');
        if (saved === 'fr' || saved === 'en') return saved;
    } catch (e) { /* ignore */ }
    // Par défaut : français si le navigateur est en français, anglais sinon
    return (navigator.language || 'fr').toLowerCase().startsWith('fr') ? 'fr' : 'en';
}

document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
});

applyLanguage(getInitialLanguage());
