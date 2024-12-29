import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

class GSAPAnimations {
    constructor() {
        this.timelines = new Map();
        this.init();
    }

    init() {
        // Initialise toutes les animations standalone
        document.querySelectorAll('.upgsap-animation:not([data-timeline])').forEach(element => {
            this.initStandaloneAnimation(element);
        });

        // Initialise les timelines
        this.initTimelines();
    }

    initStandaloneAnimation(element) {
        const animationData = element.getAttribute('data-animation');
        const triggerData = element.getAttribute('data-trigger');

        if (!animationData) return;

        const animation = JSON.parse(animationData);
        const trigger = JSON.parse(triggerData);

        const tween = this.createAnimation(element, animation);
        this.addTrigger(tween, element, trigger);
    }

    initTimelines() {
        // Groupe les éléments par timeline
        const timelineGroups = new Map();
        
        document.querySelectorAll('.upgsap-animation[data-timeline]').forEach(element => {
            const timelineId = element.getAttribute('data-timeline');
            if (!timelineGroups.has(timelineId)) {
                timelineGroups.set(timelineId, []);
            }
            timelineGroups.get(timelineId).push(element);
        });

        // Crée les timelines
        timelineGroups.forEach((elements, timelineId) => {
            this.createTimeline(timelineId, elements);
        });
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

        const initialState = this.getInitialState(config.type);
        
        return gsap.fromTo(element,
            { ...defaults, ...initialState },
            { ...defaults, ...config }
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

    addTrigger(tween, element, trigger) {
        switch (trigger.type) {
            case 'scroll':
                ScrollTrigger.create({
                    trigger: element,
                    animation: tween,
                    start: trigger.start,
                    end: trigger.end,
                    scrub: trigger.scrub,
                    toggleActions: 'play none none reverse'
                });
                break;

            case 'load':
                tween.play();
                break;

            case 'click':
                element.addEventListener('click', () => tween.restart());
                break;
        }
    }

    createTimeline(timelineId, elements) {
        const timeline = gsap.timeline({
            paused: true,
            defaults: { duration: 1 }
        });

        elements.forEach(element => {
            const animation = JSON.parse(element.getAttribute('data-animation'));
            const trigger = JSON.parse(element.getAttribute('data-trigger'));

            timeline.add(this.createAnimation(element, animation));
        });

        // Utilise le trigger du premier élément pour la timeline
        const firstTrigger = JSON.parse(elements[0].getAttribute('data-trigger'));
        this.addTrigger(timeline, elements[0], firstTrigger);

        this.timelines.set(timelineId, timeline);
    }
}

// Initialise les animations quand le DOM est prêt
document.addEventListener('DOMContentLoaded', () => {
    new GSAPAnimations();
}); 