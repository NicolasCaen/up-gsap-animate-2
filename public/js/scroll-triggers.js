import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

class ScrollTriggerManager {
    constructor() {
        this.triggers = new Map();
        this.init();
    }

    init() {
        // Configuration globale de ScrollTrigger
        ScrollTrigger.config({
            autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load,resize'
        });

        // Activation des marqueurs en mode debug
        if (window.UPGSAP_DEBUG) {
            ScrollTrigger.defaults({
                markers: true
            });
        }

        this.initScrollTriggers();
    }

    initScrollTriggers() {
        document.querySelectorAll('[data-trigger-type="scroll"]').forEach(element => {
            this.createScrollTrigger(element);
        });
    }

    createScrollTrigger(element) {
        const config = this.getConfig(element);
        if (!config) return;

        const trigger = ScrollTrigger.create({
            ...config,
            onUpdate: (self) => {
                this.updateProgress(element, self.progress);
            },
            onToggle: (self) => {
                element.classList.toggle('is-active', self.isActive);
            }
        });

        this.triggers.set(element, trigger);
    }

    getConfig(element) {
        try {
            const data = JSON.parse(element.getAttribute('data-scroll-config') || '{}');
            
            return {
                trigger: element,
                start: data.start || 'top center',
                end: data.end || 'bottom center',
                scrub: data.scrub || false,
                pin: data.pin || false,
                pinSpacing: data.pinSpacing || true,
                toggleActions: data.toggleActions || 'play none none reverse',
                anticipatePin: 1
            };
        } catch (e) {
            console.error('Invalid scroll trigger configuration:', e);
            return null;
        }
    }

    updateProgress(element, progress) {
        // Met à jour les attributs de progression
        element.style.setProperty('--scroll-progress', progress);
        element.setAttribute('data-scroll-progress', progress.toFixed(2));

        // Émet un événement personnalisé
        element.dispatchEvent(new CustomEvent('scrollProgress', {
            detail: { progress }
        }));
    }

    // Méthodes utilitaires pour la gestion des offsets
    calculateOffset(value, viewportSize) {
        if (typeof value === 'string') {
            if (value.endsWith('%')) {
                return (parseFloat(value) / 100) * viewportSize;
            }
            if (value.endsWith('px')) {
                return parseFloat(value);
            }
        }
        return parseFloat(value) || 0;
    }

    // Rafraîchit tous les triggers (utile après des modifications DOM)
    refresh() {
        ScrollTrigger.refresh();
    }

    // Nettoie un trigger spécifique
    destroy(element) {
        const trigger = this.triggers.get(element);
        if (trigger) {
            trigger.kill();
            this.triggers.delete(element);
        }
    }

    // Nettoie tous les triggers
    destroyAll() {
        this.triggers.forEach(trigger => trigger.kill());
        this.triggers.clear();
    }
}

// Exporte l'instance
export const scrollTriggerManager = new ScrollTriggerManager(); 