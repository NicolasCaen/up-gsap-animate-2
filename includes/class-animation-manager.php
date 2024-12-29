<?php
/**
 * Gestionnaire des animations GSAP
 */
class UPGSAP_Animation_Manager {
    /**
     * Liste des animations enregistrées
     */
    private $animations = [];

    /**
     * Paramètres par défaut d'une animation
     */
    private $default_params = [
        'duration' => 1,
        'ease' => 'power2.out',
        'opacity' => 1,
        'y' => 0,
        'x' => 0,
        'scale' => 1,
        'rotation' => 0,
        'delay' => 0
    ];

    /**
     * Enregistre une nouvelle animation
     */
    public function register_animation($name, $params = []) {
        if (!$this->validate_params($params)) {
            return false;
        }

        $this->animations[$name] = wp_parse_args($params, $this->default_params);
        return true;
    }

    /**
     * Récupère une animation enregistrée
     */
    public function get_animation($name) {
        return isset($this->animations[$name]) ? $this->animations[$name] : false;
    }

    /**
     * Valide les paramètres d'une animation
     */
    public function validate_params($params) {
        // Validation basique des types de données
        $valid_params = [
            'duration' => 'is_numeric',
            'ease' => 'is_string',
            'opacity' => 'is_numeric',
            'y' => 'is_numeric',
            'x' => 'is_numeric',
            'scale' => 'is_numeric',
            'rotation' => 'is_numeric',
            'delay' => 'is_numeric'
        ];

        foreach ($params as $key => $value) {
            if (isset($valid_params[$key]) && !$valid_params[$key]($value)) {
                return false;
            }
        }

        return true;
    }

    /**
     * Convertit les paramètres en configuration GSAP
     */
    public function to_gsap_config($name) {
        $animation = $this->get_animation($name);
        if (!$animation) {
            return false;
        }

        return [
            'duration' => $animation['duration'],
            'ease' => $animation['ease'],
            'opacity' => $animation['opacity'],
            'y' => $animation['y'],
            'x' => $animation['x'],
            'scale' => $animation['scale'],
            'rotation' => $animation['rotation'],
            'delay' => $animation['delay']
        ];
    }
} 