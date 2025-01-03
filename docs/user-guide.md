# Guide Utilisateur - GSAP Animate

## Introduction
GSAP Animate est un plugin WordPress qui vous permet d'ajouter facilement des animations professionnelles à votre site. Basé sur la bibliothèque GSAP (GreenSock Animation Platform), il offre une interface intuitive directement dans l'éditeur WordPress.

## Installation
1. Téléchargez le plugin depuis WordPress.org
2. Installez et activez le plugin via le menu "Extensions" de WordPress
3. Commencez à animer vos blocs dans l'éditeur !

## Utilisation de Base

### 1. Ajouter une Animation
1. Sélectionnez un bloc dans l'éditeur
2. Dans le panneau latéral, trouvez la section "Animation GSAP"
3. Choisissez un type d'animation (fade, slide, scale, rotate)
4. Ajustez les paramètres de base (durée, délai, easing)

### 2. Types de Déclencheurs
- **Scroll** : L'animation se déclenche lors du défilement
  - Position de début : Quand l'élément entre dans la vue
  - Position de fin : Optionnel, pour les animations liées au scroll
  - Scrub : L'animation suit la progression du scroll
  
- **Load** : L'animation se déclenche au chargement de la page

- **Click** : L'animation se déclenche au clic sur l'élément

- **Hover** : L'animation se déclenche au survol
  - Option de retour : Inverse l'animation quand la souris quitte l'élément

- **Custom** : Déclenchez l'animation via un sélecteur CSS personnalisé

### 3. Options Avancées
- **Pin Scroll** : Fixe l'élément pendant l'animation
- **Marqueurs** : Mode debug pour visualiser les points de déclenchement
- **Smoothness** : Contrôle la fluidité des animations scrub

## Exemples d'Utilisation

### Fade à l'entrée
```json
{
  "type": "fade",
  "duration": 1,
  "trigger": {
    "type": "scroll",
    "start": "top center"
  }
}
```

### Animation au Survol
```json
{
  "type": "scale",
  "duration": 0.3,
  "trigger": {
    "type": "hover",
    "reverse": true
  }
}
```

### Animation Séquencée
```json
{
  "type": "slide",
  "duration": 1,
  "trigger": {
    "type": "scroll",
    "scrubType": "smooth",
    "smoothness": 1
  }
}
```

## Compatibilité
- WordPress 6.0+
- Principaux thèmes WordPress
- Page builders : Elementor, Divi, Beaver Builder
- Navigateurs modernes (2 dernières versions)

## Dépannage

### L'animation ne se déclenche pas
1. Vérifiez que GSAP est correctement chargé (Console développeur)
2. Confirmez que le déclencheur est correctement configuré
3. Vérifiez les conflits potentiels avec d'autres plugins d'animation

### Performance
- Utilisez des animations courtes pour une meilleure performance
- Évitez trop d'animations simultanées
- Désactivez les animations sur mobile si nécessaire

## Support
- Documentation : [lien]
- Support : [lien]
- Signaler un bug : [lien]
