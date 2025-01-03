/* global gsap, ScrollTrigger */
(function() {
    'use strict';

    // Attendre que le DOM soit chargé
    document.addEventListener('DOMContentLoaded', function() {
        initGSAPAnimations();
    });

    function initGSAPAnimations() {
        // Enregistrer le plugin ScrollTrigger
        gsap.registerPlugin(ScrollTrigger);

        // Trouver tous les éléments animés
        const animatedElements = document.querySelectorAll('.upgsap-animated');

        animatedElements.forEach(element => {
            const animationData = JSON.parse(element.dataset.animation);
            createAnimation(element, animationData);
        });
    }

    function createAnimation(element, animationData) {
        // Créer les paramètres d'animation en fonction du type
        const animationParams = createAnimationParams(animationData);

        // Créer les paramètres du trigger
        const triggerParams = createTriggerParams(animationData.trigger, element);

        // Créer l'animation GSAP
        gsap.from(element, {
            ...animationParams,
            ...triggerParams
        });
    }

    function createAnimationParams(animationData) {
        const params = {
            duration: animationData.duration || 1,
            ease: animationData.ease || 'power2.out'
        };

        // Ajouter les paramètres spécifiques au type d'animation
        switch (animationData.type) {
            case 'fade':
                params.opacity = 0;
                break;
            case 'slide':
                params.y = 50;
                params.opacity = 0;
                break;
            case 'scale':
                params.scale = 0.5;
                params.opacity = 0;
                break;
            case 'rotate':
                params.rotation = -45;
                params.opacity = 0;
                break;
            default:
                params.opacity = 0;
        }

        return params;
    }

    function createTriggerParams(triggerData, element) {
        const params = {};

        switch (triggerData.type) {
            case 'scroll':
                params.scrollTrigger = {
                    trigger: element,
                    start: triggerData.start || 'top center',
                    markers: triggerData.markers || false
                };

                // Gérer le scrub
                if (triggerData.scrubType !== 'none') {
                    params.scrollTrigger.scrub = triggerData.scrubType === 'smooth' ? 1 : true;
                }
                break;

            case 'load':
                // L'animation se déclenche automatiquement
                break;

            case 'hover':
                params.paused = true;
                element.addEventListener('mouseenter', () => gsap.to(element, params));
                element.addEventListener('mouseleave', () => gsap.to(element, { opacity: 1, scale: 1, rotation: 0, x: 0, y: 0 }));
                break;

            case 'click':
                params.paused = true;
                element.addEventListener('click', () => gsap.to(element, params));
                break;
        }

        return params;
    }
})();
