# Documentation Technique - GSAP Animate

## Architecture

### Structure du Plugin
```
up-gsap-animate-2/
├── admin/               # Interface d'administration
├── includes/           # Classes principales
├── public/            # Assets publics
├── blocks/            # Composants Gutenberg
└── tests/            # Tests unitaires et d'intégration
```

### Classes Principales

#### UPGSAP_Core
Classe principale du plugin gérant l'initialisation et les hooks WordPress.

```php
class UPGSAP_Core {
    public function init()
    public function register_hooks()
    public function load_dependencies()
}
```

#### UPGSAP_Animation_Manager
Gère l'enregistrement et la configuration des animations.

```php
class UPGSAP_Animation_Manager {
    public function register_animation($name, $params)
    public function save_animation($name, $params)
    public function delete_animation($name)
    public function to_gsap_config($animation_name)
}
```

#### UPGSAP_Timeline_Manager
Gère les timelines GSAP et leur séquençage.

```php
class UPGSAP_Timeline_Manager {
    public function create_timeline($id, $params)
    public function add_to_timeline($timeline_id, $animation)
    public function get_timeline($id)
}
```

## Hooks et Filtres

### Filtres
```php
// Modifier la configuration d'une animation
apply_filters('upgsap_animation_config', $config, $animation_name);

// Modifier les paramètres par défaut
apply_filters('upgsap_default_params', $default_params);

// Modifier les options de ScrollTrigger
apply_filters('upgsap_scrolltrigger_options', $options, $trigger);
```

### Actions
```php
// Avant l'initialisation des animations
do_action('upgsap_before_init_animations');

// Après l'initialisation des animations
do_action('upgsap_after_init_animations');

// Lors de l'enregistrement d'une animation
do_action('upgsap_animation_registered', $name, $params);
```

## Formats de Données

### Configuration d'Animation
```json
{
  "animation": {
    "id": "string",
    "type": "string",
    "duration": "number",
    "params": {
      "opacity": "number",
      "x": "number",
      "y": "number",
      "scale": "number",
      "rotation": "number"
    }
  }
}
```

### Configuration de Trigger
```json
{
  "trigger": {
    "type": "string",
    "start": "string",
    "end": "string",
    "scrubType": "string",
    "smoothness": "number",
    "pin": "boolean",
    "markers": "boolean"
  }
}
```

## API JavaScript

### Initialisation
```javascript
const gsapAnimate = new UPGSAPAnimate({
    animations: {},
    timelines: {}
});
```

### Méthodes
```javascript
// Ajouter une animation
gsapAnimate.addAnimation(name, config);

// Créer une timeline
gsapAnimate.createTimeline(id, params);

// Déclencher une animation
gsapAnimate.trigger(name);
```

## Tests

### Tests Unitaires
```bash
# Exécuter tous les tests
phpunit

# Exécuter les tests de compatibilité
phpunit --filter Test_Compatibility
```

### Tests d'Intégration
Les tests d'intégration vérifient :
- Compatibilité avec les thèmes
- Compatibilité avec les page builders
- Compatibilité des navigateurs
- Versions PHP

## Performance

### Optimisations
1. Chargement conditionnel de GSAP
2. Minification des assets
3. Cache des configurations
4. Lazy loading des animations

### Bonnes Pratiques
1. Utiliser des sélecteurs CSS optimisés
2. Éviter les animations complexes sur mobile
3. Implémenter la gestion des préférences de mouvement
4. Utiliser le debounce pour les événements scroll

## Sécurité

### Validation des Données
- Sanitization des entrées utilisateur
- Validation des paramètres d'animation
- Vérification des capacités WordPress
- Protection CSRF

### Bonnes Pratiques
1. Utiliser nonces pour les requêtes AJAX
2. Vérifier les permissions utilisateur
3. Échapper les sorties HTML
4. Valider les données JSON

## Déploiement

### Prérequis
- WordPress 6.0+
- PHP 7.4+
- GSAP 3.x

### Installation
1. Composer pour les dépendances PHP
2. NPM pour les assets JavaScript
3. Build des composants Gutenberg
4. Tests automatisés
