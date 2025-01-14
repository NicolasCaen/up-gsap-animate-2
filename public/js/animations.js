(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {
        // Vérifier que GSAP est chargé
        if (typeof gsap === 'undefined') {
            console.error('GSAP n\'est pas chargé');
            return;
        }

        // Vérifier que ScrollTrigger est chargé
        if (typeof ScrollTrigger === 'undefined') {
            console.error('ScrollTrigger n\'est pas chargé');
            return;
        }

        // Enregistrer le plugin ScrollTrigger
        gsap.registerPlugin(ScrollTrigger);

        // Sélectionner tous les éléments avec animation
        const animatedElements = document.querySelectorAll('.upgsap-animated');

        animatedElements.forEach(element => {
            try {
                // Récupérer les paramètres d'animation
                const animationData = JSON.parse(element.dataset.animation);
                
                if (!animationData || !animationData.enabled) return;

                // Définir l'état initial
                let fromState = { opacity: 0 };
                let toState = { opacity: 1 };

                // Ajouter les propriétés spécifiques selon le type d'animation
                switch (animationData.type) {
                    case 'fade':
                        // Déjà géré par les états par défaut
                        break;
                    case 'slide':
                        fromState.x = -100;
                        toState.x = 0;
                        break;
                    case 'scale':
                        fromState.scale = 0;
                        toState.scale = 1;
                        break;
                    case 'rotate':
                        fromState.rotation = -180;
                        toState.rotation = 0;
                        break;
                }

                // Ajouter la durée et l'ease aux états finaux
                toState.duration = animationData.duration;
                toState.ease = animationData.ease;

                // Créer l'animation
                const tl = gsap.timeline({ paused: true });

                // Définir l'état initial
                gsap.set(element, fromState);

                // Ajouter l'animation à la timeline
                tl.to(element, toState);

                // Configurer le déclencheur selon le type
                switch (animationData.trigger.type) {
                    case 'scroll':
                        ScrollTrigger.create({
                            trigger: element,
                            start: animationData.trigger.start || 'top center',
                            onEnter: () => tl.play(),
                            markers: animationData.trigger.markers,
                            once: true,
                            scrub: animationData.trigger.scrubType !== 'none' ? 
                                   (animationData.trigger.scrubType === 'smooth' ? 1 : true) : 
                                   false
                        });
                        break;

                    case 'load':
                        tl.play();
                        break;

                    case 'click':
                        element.addEventListener('click', () => {
                            tl.restart();
                        });
                        break;

                    case 'hover':
                        element.addEventListener('mouseenter', () => {
                            tl.play();
                        });
                        element.addEventListener('mouseleave', () => {
                            tl.reverse();
                        });
                        break;
                }

            } catch (error) {
                console.error('Erreur lors de l\'initialisation de l\'animation:', error);
            }
        });
    });
})();