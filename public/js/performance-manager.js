import { gsap } from 'gsap';

class PerformanceManager {
    constructor() {
        this.config = {
            lazyLoadThreshold: 200,
            mobileBreakpoint: 768,
            tabletBreakpoint: 1024,
            disableOnMobile: false,
            useReducedMotion: true
        };

        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.setupMediaQueries();
        this.setupReducedMotion();
        this.optimizeRAF();
    }

    setupIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: `${this.config.lazyLoadThreshold}px`,
            threshold: 0
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadAnimation(entry.target);
                    this.observer.unobserve(entry.target);
                }
            });
        }, options);

        // Observer tous les éléments d'animation
        document.querySelectorAll('.upgsap-animation').forEach(element => {
            this.observer.observe(element);
        });
    }

    loadAnimation(element) {
        // Charge les ressources GSAP nécessaires
        const requiredPlugins = element.getAttribute('data-gsap-plugins');
        if (requiredPlugins) {
            this.loadGSAPPlugins(requiredPlugins.split(','));
        }

        // Initialise l'animation
        element.classList.add('is-ready');
        element.dispatchEvent(new CustomEvent('animationReady'));
    }

    async loadGSAPPlugins(plugins) {
        const loadPromises = plugins.map(plugin => {
            switch (plugin.trim()) {
                case 'scrollTrigger':
                    return import('gsap/ScrollTrigger').then(module => {
                        gsap.registerPlugin(module.ScrollTrigger);
                    });
                case 'motionPath':
                    return import('gsap/MotionPathPlugin').then(module => {
                        gsap.registerPlugin(module.MotionPathPlugin);
                    });
                // Ajoutez d'autres plugins selon les besoins
            }
        });

        await Promise.all(loadPromises);
    }

    setupMediaQueries() {
        const mobileQuery = window.matchMedia(`(max-width: ${this.config.mobileBreakpoint}px)`);
        const tabletQuery = window.matchMedia(`(max-width: ${this.config.tabletBreakpoint}px)`);

        this.handleMediaQuery(mobileQuery, 'mobile');
        this.handleMediaQuery(tabletQuery, 'tablet');

        mobileQuery.addListener(e => this.handleMediaQuery(e, 'mobile'));
        tabletQuery.addListener(e => this.handleMediaQuery(e, 'tablet'));
    }

    handleMediaQuery(query, device) {
        if (query.matches) {
            document.documentElement.setAttribute('data-device', device);
            if (device === 'mobile' && this.config.disableOnMobile) {
                this.disableAnimations();
            }
        }
    }

    setupReducedMotion() {
        if (!this.config.useReducedMotion) return;

        const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        this.handleReducedMotion(motionQuery);
        motionQuery.addListener(e => this.handleReducedMotion(e));
    }

    handleReducedMotion(query) {
        if (query.matches) {
            this.disableAnimations();
        } else {
            this.enableAnimations();
        }
    }

    optimizeRAF() {
        let waiting = false;
        const originalRAF = window.requestAnimationFrame;

        window.requestAnimationFrame = callback => {
            if (waiting) return;
            waiting = true;

            originalRAF(() => {
                callback();
                waiting = false;
            });
        };
    }

    disableAnimations() {
        document.documentElement.setAttribute('data-animations-disabled', '');
        gsap.globalTimeline.pause();
    }

    enableAnimations() {
        document.documentElement.removeAttribute('data-animations-disabled');
        gsap.globalTimeline.resume();
    }

    destroy() {
        this.observer?.disconnect();
        // Nettoyage des autres ressources
    }
}

// Exporte l'instance
export const performanceManager = new PerformanceManager(); 