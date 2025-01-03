"use strict";

// Fonction d'initialisation des animations
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
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
    var animatedElements = document.querySelectorAll('.upgsap-animated');
    animatedElements.forEach(function (element) {
      try {
        // Récupérer les paramètres d'animation
        var animationData = JSON.parse(element.dataset.animation);
        if (!animationData || !animationData.enabled) return;

        // Configurer les paramètres de l'animation
        var animationConfig = {
          duration: animationData.duration,
          ease: animationData.ease
        };

        // Ajouter les propriétés spécifiques selon le type d'animation
        switch (animationData.type) {
          case 'fade':
            animationConfig.opacity = 0;
            element.style.opacity = 0;
            break;
          case 'slide':
            animationConfig.x = -100;
            element.style.transform = 'translateX(-100px)';
            break;
          case 'scale':
            animationConfig.scale = 0;
            element.style.transform = 'scale(0)';
            break;
          case 'rotate':
            animationConfig.rotation = -180;
            element.style.transform = 'rotate(-180deg)';
            break;
        }

        // Créer l'animation
        var tl = gsap.timeline({
          paused: true,
          defaults: {
            duration: animationData.duration,
            ease: animationData.ease
          }
        });

        // Ajouter l'animation à la timeline
        tl.to(element, animationConfig);

        // Configurer le déclencheur selon le type
        switch (animationData.trigger.type) {
          case 'scroll':
            ScrollTrigger.create({
              trigger: element,
              start: animationData.trigger.start,
              onEnter: function onEnter() {
                return tl.play();
              },
              markers: animationData.trigger.markers,
              scrub: animationData.trigger.scrubType !== 'none' ? animationData.trigger.scrubType === 'smooth' ? 1 : true : false
            });
            break;
          case 'load':
            tl.play();
            break;
          case 'click':
            element.addEventListener('click', function () {
              tl.restart();
            });
            break;
          case 'hover':
            element.addEventListener('mouseenter', function () {
              tl.play();
            });
            element.addEventListener('mouseleave', function () {
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