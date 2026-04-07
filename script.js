/* ============================================================
   27NetTeam Landing Page — script.js
   Animations, Interactions & Visual Effects
   ============================================================ */

(function () {
    'use strict';

    // ===================== PARTICLES SYSTEM =====================
    const ParticleSystem = {
        canvas: null,
        ctx: null,
        particles: [],
        mouse: { x: -1000, y: -1000 },
        config: {
            count: 80,
            maxSize: 2.5,
            minSize: 0.5,
            speed: 0.3,
            connectionDistance: 150,
            mouseRadius: 200,
            colors: ['rgba(0, 240, 255, ', 'rgba(168, 85, 247, ', 'rgba(59, 130, 246, ']
        },

        init() {
            this.canvas = document.getElementById('particles-canvas');
            if (!this.canvas) return;
            this.ctx = this.canvas.getContext('2d');
            this.resize();
            this.createParticles();
            this.animate();

            window.addEventListener('resize', () => this.resize());
            window.addEventListener('mousemove', (e) => {
                this.mouse.x = e.clientX;
                this.mouse.y = e.clientY;
            });
        },

        resize() {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        },

        createParticles() {
            this.particles = [];
            // Reduce particle count on mobile for performance
            const count = window.innerWidth < 768 ? 40 : this.config.count;
            for (let i = 0; i < count; i++) {
                this.particles.push({
                    x: Math.random() * this.canvas.width,
                    y: Math.random() * this.canvas.height,
                    vx: (Math.random() - 0.5) * this.config.speed,
                    vy: (Math.random() - 0.5) * this.config.speed,
                    size: Math.random() * (this.config.maxSize - this.config.minSize) + this.config.minSize,
                    color: this.config.colors[Math.floor(Math.random() * this.config.colors.length)],
                    opacity: Math.random() * 0.5 + 0.2
                });
            }
        },

        animate() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            this.particles.forEach((p, i) => {
                // Update position
                p.x += p.vx;
                p.y += p.vy;

                // Boundary wrapping
                if (p.x < 0) p.x = this.canvas.width;
                if (p.x > this.canvas.width) p.x = 0;
                if (p.y < 0) p.y = this.canvas.height;
                if (p.y > this.canvas.height) p.y = 0;

                // Mouse repulsion
                const dx = this.mouse.x - p.x;
                const dy = this.mouse.y - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < this.config.mouseRadius) {
                    const force = (this.config.mouseRadius - dist) / this.config.mouseRadius;
                    p.vx -= (dx / dist) * force * 0.02;
                    p.vy -= (dy / dist) * force * 0.02;
                }

                // Damping
                p.vx *= 0.999;
                p.vy *= 0.999;

                // Draw particle
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                this.ctx.fillStyle = p.color + p.opacity + ')';
                this.ctx.fill();

                // Draw connections
                for (let j = i + 1; j < this.particles.length; j++) {
                    const p2 = this.particles[j];
                    const ddx = p.x - p2.x;
                    const ddy = p.y - p2.y;
                    const distance = Math.sqrt(ddx * ddx + ddy * ddy);

                    if (distance < this.config.connectionDistance) {
                        const lineOpacity = (1 - distance / this.config.connectionDistance) * 0.15;
                        this.ctx.beginPath();
                        this.ctx.moveTo(p.x, p.y);
                        this.ctx.lineTo(p2.x, p2.y);
                        this.ctx.strokeStyle = `rgba(0, 240, 255, ${lineOpacity})`;
                        this.ctx.lineWidth = 0.5;
                        this.ctx.stroke();
                    }
                }
            });

            requestAnimationFrame(() => this.animate());
        }
    };

    // ===================== CURSOR GLOW =====================
    const CursorGlow = {
        el: null,

        init() {
            this.el = document.getElementById('cursor-glow');
            if (!this.el || window.innerWidth < 768) return;

            document.addEventListener('mousemove', (e) => {
                this.el.style.left = e.clientX + 'px';
                this.el.style.top = e.clientY + 'px';
            });
        }
    };

    // ===================== SCROLL REVEAL =====================
    const ScrollReveal = {
        elements: [],

        init() {
            this.elements = document.querySelectorAll('.reveal');

            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('revealed');
                            observer.unobserve(entry.target);
                        }
                    });
                },
                { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
            );

            this.elements.forEach((el) => observer.observe(el));
        }
    };

    // ===================== NAVBAR =====================
    const Navbar = {
        el: null,
        toggle: null,
        links: null,
        sections: [],

        init() {
            this.el = document.getElementById('navbar');
            this.toggle = document.getElementById('nav-toggle');
            this.links = document.getElementById('nav-links');
            this.sections = document.querySelectorAll('section[id]');

            // Scroll effect
            window.addEventListener('scroll', () => this.onScroll());

            // Mobile toggle
            if (this.toggle) {
                this.toggle.addEventListener('click', () => this.toggleMenu());
            }

            // Close menu on link click
            document.querySelectorAll('.nav-link').forEach((link) => {
                link.addEventListener('click', () => {
                    this.closeMenu();
                });
            });

            // Close menu on outside click
            document.addEventListener('click', (e) => {
                if (this.links && this.links.classList.contains('open') &&
                    !this.links.contains(e.target) && !this.toggle.contains(e.target)) {
                    this.closeMenu();
                }
            });
        },

        onScroll() {
            const scrollY = window.scrollY;

            // Add scrolled class
            if (scrollY > 50) {
                this.el.classList.add('scrolled');
            } else {
                this.el.classList.remove('scrolled');
            }

            // Active section highlighting
            this.sections.forEach((section) => {
                const top = section.offsetTop - 120;
                const bottom = top + section.offsetHeight;
                const id = section.getAttribute('id');

                if (scrollY >= top && scrollY < bottom) {
                    document.querySelectorAll('.nav-link').forEach((link) => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === '#' + id) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        },

        toggleMenu() {
            this.toggle.classList.toggle('active');
            this.links.classList.toggle('open');
            this.toggle.setAttribute(
                'aria-expanded',
                this.links.classList.contains('open')
            );
        },

        closeMenu() {
            this.toggle.classList.remove('active');
            this.links.classList.remove('open');
            this.toggle.setAttribute('aria-expanded', 'false');
        }
    };

    // ===================== BUTTON RIPPLE EFFECT =====================
    const RippleEffect = {
        init() {
            document.querySelectorAll('.btn').forEach((btn) => {
                btn.addEventListener('click', (e) => {
                    const rect = btn.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;

                    const ripple = document.createElement('span');
                    ripple.className = 'btn-ripple';
                    ripple.style.left = x + 'px';
                    ripple.style.top = y + 'px';
                    ripple.style.width = ripple.style.height =
                        Math.max(rect.width, rect.height) + 'px';
                    ripple.style.animation = 'ripple-effect 0.6s ease-out forwards';

                    btn.appendChild(ripple);
                    setTimeout(() => ripple.remove(), 600);
                });
            });
        }
    };

    // ===================== SKILL BARS ANIMATION =====================
    const SkillBars = {
        init() {
            const bars = document.querySelectorAll('.skill-bar');

            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            const bar = entry.target;
                            const level = bar.getAttribute('data-level');
                            const fill = bar.querySelector('.skill-bar-fill');
                            if (fill) {
                                // Small delay for cascading effect
                                setTimeout(() => {
                                    fill.style.width = level + '%';
                                }, 200);
                            }
                            observer.unobserve(bar);
                        }
                    });
                },
                { threshold: 0.5 }
            );

            bars.forEach((bar) => observer.observe(bar));
        }
    };

    // ===================== COUNTER ANIMATION =====================
    const CounterAnimation = {
        init() {
            const counters = document.querySelectorAll('.stat-number[data-count]');

            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            this.animateCounter(entry.target);
                            observer.unobserve(entry.target);
                        }
                    });
                },
                { threshold: 0.8 }
            );

            counters.forEach((counter) => observer.observe(counter));
        },

        animateCounter(el) {
            const target = parseInt(el.getAttribute('data-count'), 10);
            const duration = 2000;
            const startTime = performance.now();

            const update = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Ease-out cubic
                const eased = 1 - Math.pow(1 - progress, 3);
                const current = Math.round(eased * target);

                el.textContent = current;

                if (progress < 1) {
                    requestAnimationFrame(update);
                } else {
                    el.textContent = target;
                }
            };

            requestAnimationFrame(update);
        }
    };

    // ===================== PARALLAX EFFECT =====================
    const Parallax = {
        init() {
            if (window.innerWidth < 768) return; // Disable on mobile

            window.addEventListener('scroll', () => {
                const scrollY = window.scrollY;

                // Parallax on hero grid
                const heroGrid = document.querySelector('.hero-bg-grid');
                if (heroGrid) {
                    heroGrid.style.transform = `translateY(${scrollY * 0.3}px)`;
                }

                // Parallax on decorative elements
                const decorLeft = document.querySelector('.hero-decor--left');
                const decorRight = document.querySelector('.hero-decor--right');
                if (decorLeft) {
                    decorLeft.style.transform = `translateY(calc(-50% + ${scrollY * 0.15}px))`;
                }
                if (decorRight) {
                    decorRight.style.transform = `translateY(calc(-50% - ${scrollY * 0.1}px))`;
                }
            });
        }
    };

    // ===================== TILT EFFECT ON CARDS =====================
    const TiltEffect = {
        init() {
            if (window.innerWidth < 768) return; // Disable on mobile/touch

            const cards = document.querySelectorAll('.project-card-inner, .skill-card');

            cards.forEach((card) => {
                card.addEventListener('mousemove', (e) => {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;

                    const rotateX = ((y - centerY) / centerY) * -4;
                    const rotateY = ((x - centerX) / centerX) * 4;

                    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

                    // Move glow element
                    const glow = card.querySelector('.project-glow');
                    if (glow) {
                        glow.style.left = x - rect.width + 'px';
                        glow.style.top = y - rect.height + 'px';
                    }
                });

                card.addEventListener('mouseleave', () => {
                    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
                    card.style.transition = 'transform 0.5s ease';

                    setTimeout(() => {
                        card.style.transition = '';
                    }, 500);
                });
            });
        }
    };

    // ===================== TYPING EFFECT FOR TAGLINE =====================
    const TypeWriter = {
        init() {
            const taglineKanji = document.querySelector('.tagline-kanji');
            if (!taglineKanji) return;

            const phrases = ['未来技術', '革新技術', '人工知能', '創造力'];
            let phraseIndex = 0;
            let charIndex = 0;
            let isDeleting = false;

            const type = () => {
                const current = phrases[phraseIndex];

                if (!isDeleting) {
                    taglineKanji.textContent = current.substring(0, charIndex + 1);
                    charIndex++;
                    if (charIndex === current.length) {
                        isDeleting = true;
                        setTimeout(type, 2000);
                        return;
                    }
                } else {
                    taglineKanji.textContent = current.substring(0, charIndex - 1);
                    charIndex--;
                    if (charIndex === 0) {
                        isDeleting = false;
                        phraseIndex = (phraseIndex + 1) % phrases.length;
                    }
                }

                setTimeout(type, isDeleting ? 100 : 200);
            };

            setTimeout(type, 2000);
        }
    };

    // ===================== SMOOTH SCROLL FOR ANCHOR LINKS =====================
    const SmoothScroll = {
        init() {
            document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
                anchor.addEventListener('click', (e) => {
                    e.preventDefault();
                    const targetId = anchor.getAttribute('href');
                    const target = document.querySelector(targetId);
                    if (target) {
                        const offset = 80; // navbar height
                        const top = target.getBoundingClientRect().top + window.scrollY - offset;
                        window.scrollTo({ top, behavior: 'smooth' });
                    }
                });
            });
        }
    };

    // ===================== PROJECT CARD HOVER SOUND (OPTIONAL VISUAL FEEDBACK) =====================
    const CardHoverFeedback = {
        init() {
            const cards = document.querySelectorAll('.project-card, .contact-link, .pillar');

            cards.forEach((card) => {
                card.addEventListener('mouseenter', () => {
                    card.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), border-color 0.3s, box-shadow 0.4s';
                });
            });
        }
    };

    // ===================== LOADING ANIMATION =====================
    const LoadingAnimation = {
        init() {
            // Reveal hero elements with stagger on page load
            window.addEventListener('load', () => {
                document.body.classList.add('loaded');

                const heroReveals = document.querySelectorAll('.hero-content .reveal');
                heroReveals.forEach((el, i) => {
                    setTimeout(() => {
                        el.classList.add('revealed');
                    }, 300 + i * 150);
                });
            });
        }
    };

    // ===================== LANGUAGE SWITCHER =====================
    const LanguageSwitcher = {
        currentLang: 'vi',
        btn: null,

        init() {
            this.btn = document.getElementById('lang-switcher');
            if (!this.btn) return;

            // Load saved language preference
            const saved = localStorage.getItem('27nt-lang');
            if (saved && (saved === 'vi' || saved === 'en')) {
                this.currentLang = saved;
                if (saved === 'en') {
                    this.applyLanguage('en');
                }
            }

            this.btn.addEventListener('click', () => this.toggle());
        },

        toggle() {
            this.currentLang = this.currentLang === 'vi' ? 'en' : 'vi';
            this.applyLanguage(this.currentLang);
            localStorage.setItem('27nt-lang', this.currentLang);
        },

        applyLanguage(lang) {
            // Update button active state
            const options = this.btn.querySelectorAll('.lang-option');
            options.forEach((opt) => {
                if (opt.getAttribute('data-lang') === lang) {
                    opt.classList.add('lang-option--active');
                } else {
                    opt.classList.remove('lang-option--active');
                }
            });

            // Update HTML lang attribute
            document.documentElement.lang = lang;

            // Update all elements with data-vi / data-en attributes
            document.querySelectorAll('[data-vi][data-en]').forEach((el) => {
                const text = el.getAttribute('data-' + lang);
                if (text !== null) {
                    el.innerHTML = text;
                }
            });

            // Update tagline main text
            const tagline = document.querySelector('.hero-tagline');
            if (tagline) {
                const taglineMain = tagline.querySelector('.tagline-main');
                if (taglineMain) {
                    const viText = tagline.getAttribute('data-vi-text');
                    const enText = tagline.getAttribute('data-en-text');
                    taglineMain.textContent = lang === 'vi' ? viText : enText;
                }
            }
        }
    };

    // ===================== INITIALIZE EVERYTHING =====================
    document.addEventListener('DOMContentLoaded', () => {
        ParticleSystem.init();
        CursorGlow.init();
        ScrollReveal.init();
        Navbar.init();
        RippleEffect.init();
        SkillBars.init();
        CounterAnimation.init();
        Parallax.init();
        TiltEffect.init();
        TypeWriter.init();
        SmoothScroll.init();
        CardHoverFeedback.init();
        LoadingAnimation.init();
        LanguageSwitcher.init();
    });

})();
