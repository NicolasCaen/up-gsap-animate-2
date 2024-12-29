# DEVBOOK : Plugin WordPress d'Animations GSAP

## Structure du Plugin

### Architecture des Dossiers
```
up-gsap-animate-2/
├── admin/
│   ├── js/
│   │   └── admin.js
│   ├── css/
│   │   └── admin.css
│   └── class-admin.php
├── includes/
│   ├── class-core.php
│   ├── class-animation-manager.php
│   ├── class-timeline-manager.php
│   └── class-data-store.php
├── public/
│   ├── js/
│   │   ├── gsap-core.js
│   │   └── animations.js
│   └── css/
│       └── animations.css
├── blocks/
│   └── animation-controls/
└── up-gsap-animate-2.php
```

## Classes Principales

### Core (class-core.php)
```php
class UPGSAP_Core {
    private $version = '1.0.0';
    private $animation_manager;
    private $timeline_manager;
    private $data_store;
    
    public function init()
    public function register_hooks()
    public function load_dependencies()
}
```

### Animation Manager (class-animation-manager.php)
```php
class UPGSAP_Animation_Manager {
    private $animations = [];
    
    public function register_animation($name, $params)
    public function get_animation($name)
    public function validate_params($params)
}
```

### Timeline Manager (class-timeline-manager.php)
```php
class UPGSAP_Timeline_Manager {
    private $timelines = [];
    
    public function create_timeline($id, $params)
    public function add_to_timeline($timeline_id, $animation)
    public function get_timeline($id)
}
```

## Structure des Données

### Format de Configuration Animation
```json
{
  "animation": {
    "id": "fade-in",
    "type": "fade",
    "params": {
      "duration": 1,
      "ease": "power2.out",
      "opacity": 0,
      "y": 50
    },
    "trigger": {
      "type": "scroll",
      "offset": "0 0"
    }
  }
}
```

### Format de Configuration Timeline
```json
{
  "timeline": {
    "id": "section-1",
    "animations": [
      {
        "target": ".header",
        "animation": "fade-in",
        "position": 0
      },
      {
        "target": ".content",
        "animation": "slide-in",
        "position": "+=0.5"
      }
    ],
    "trigger": {
      "type": "scroll",
      "start": "top center"
    }
  }
}
```

## Hooks et Filtres

### Filtres
```php
// Modifier les paramètres d'animation par défaut
apply_filters('upgsap_default_animation_params', $params);

// Filtrer la configuration de la timeline
apply_filters('upgsap_timeline_config', $config, $timeline_id);

// Modifier les options de déclenchement
apply_filters('upgsap_trigger_options', $options, $trigger_type);
```

### Actions
```php
// Avant l'initialisation des animations
do_action('upgsap_before_init_animations');

// Après la création d'une timeline
do_action('upgsap_after_timeline_created', $timeline_id);

// Avant le rendu des animations
do_action('upgsap_before_render_animations');
```

## Intégration Gutenberg

### Structure du Bloc Animation
```js
registerBlockType('upgsap/animation-controls', {
    title: 'GSAP Animation',
    attributes: {
        animationConfig: {
            type: 'object',
            default: {}
        },
        timelineConfig: {
            type: 'object',
            default: {}
        }
    },
    edit: EditComponent,
    save: SaveComponent
});
```

## Système de Cache et Performance

### Stratégie de Mise en Cache
```php
class UPGSAP_Cache {
    public function cache_animations($page_id)
    public function get_cached_animations($page_id)
    public function invalidate_cache($page_id)
}
```

## Tests et Débogage

### Structure des Tests Unitaires
```php
class UPGSAP_Test_Animations extends WP_UnitTestCase {
    public function test_animation_registration()
    public function test_timeline_creation()
    public function test_trigger_validation()
}
```

## Standards de Code

### Conventions de Nommage
- Préfixe des classes : `UPGSAP_`
- Préfixe des fonctions : `upgsap_`
- Préfixe des hooks : `upgsap_`
- Classes CSS : `gsap-`

### Documentation
- PHPDoc pour toutes les classes et méthodes
- JSDoc pour les fonctions JavaScript
- Commentaires inline pour la logique complexe

## Sécurité

### Validation des Données
```php
class UPGSAP_Validator {
    public static function sanitize_animation_params($params)
    public static function validate_timeline_config($config)
    public static function check_user_capabilities()
}
```

## API Publique

### Fonctions Principales
```php
// Enregistrer une nouvelle animation
function upgsap_register_animation($name, $params)

// Créer une timeline
function upgsap_create_timeline($id, $config)

// Récupérer une configuration
function upgsap_get_animation_config($animation_id)
```

## Notes de Développement

1. Toujours utiliser le système de capabilities WordPress pour la sécurité
2. Implémenter un système de fallback pour les navigateurs non supportés
3. Optimiser le chargement des ressources GSAP
4. Maintenir la compatibilité avec les caches de page
5. Documenter tous les hooks et filtres 