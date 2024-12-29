import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

class AnimationPreview {
    constructor() {
        this.animations = new Map();
        this.init();
    }

    init() {
        // Initialise les previews pour tous les blocs d'animation
        document.querySelectorAll('.upgsap-animation-preview').forEach(element => {
            this.initPreview(element);
        });
    }

    initPreview(element) {
        const block = element.closest('.upgsap-animation-block');
        if (!block) return;

        const animationData = block.getAttribute('data-animation');
        const triggerData = block.getAttribute('data-trigger');

        if (!animationData) return;

        const animation = JSON.parse(animationData);
        const trigger = JSON.parse(triggerData);

        // Crée l'animation GSAP
        const tween = this.createAnimation(element, animation);

        // Ajoute les contrôles de preview
        this.addPreviewControls(block, tween, trigger);
    }

    createAnimation(element, config) {
        const defaults = {
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
            rotation: 0,
            duration: 1,
            ease: 'power2.out'
        };

        // Détermine les valeurs initiales selon le type d'animation
        const initialState = this.getInitialState(config.type);
        
        // Crée le tween avec les paramètres combinés
        return gsap.fromTo(element,
            { ...defaults, ...initialState },
            { 
                ...defaults,
                ...config,
                paused: true // L'animation est en pause par défaut
            }
        );
    }

    getInitialState(type) {
        switch (type) {
            case 'fade':
                return { opacity: 0 };
            case 'slide':
                return { x: -100, opacity: 0 };
            case 'scale':
                return { scale: 0, opacity: 0 };
            case 'rotate':
                return { rotation: -180, opacity: 0 };
            default:
                return { opacity: 0 };
        }
    }

    addPreviewControls(block, tween, trigger) {
        const controls = document.createElement('div');
        controls.className = 'upgsap-preview-controls';
        
        // Bouton de preview
        const playButton = document.createElement('button');
        playButton.className = 'components-button is-primary';
        playButton.textContent = 'Preview Animation';
        
        playButton.addEventListener('click', () => {
            tween.restart();
        });

        controls.appendChild(playButton);
        block.appendChild(controls);
    }
}

// Initialise la preview quand l'éditeur est prêt
window.addEventListener('load', () => {
    new AnimationPreview();
}); 