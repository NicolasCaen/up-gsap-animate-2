<?php
/**
 * Gestionnaire des timelines GSAP
 */
class UPGSAP_Timeline_Manager {
    /**
     * Liste des timelines
     */
    private $timelines = [];

    /**
     * Configuration par défaut d'une timeline
     */
    private $default_config = [
        'trigger' => [
            'type' => 'scroll',
            'start' => 'top center',
            'end' => 'bottom center',
            'scrub' => false
        ],
        'sequence' => 'sequential',
        'stagger' => 0.2
    ];

    /**
     * Crée une nouvelle timeline
     */
    public function create_timeline($id, $config = []) {
        $config = wp_parse_args($config, $this->default_config);
        
        if (!$this->validate_config($config)) {
            return false;
        }

        $this->timelines[$id] = [
            'config' => $config,
            'animations' => []
        ];

        return true;
    }

    /**
     * Ajoute une animation à une timeline
     */
    public function add_to_timeline($timeline_id, $animation_data) {
        if (!isset($this->timelines[$timeline_id])) {
            return false;
        }

        $this->timelines[$timeline_id]['animations'][] = $animation_data;
        return true;
    }

    /**
     * Récupère une timeline
     */
    public function get_timeline($id) {
        return isset($this->timelines[$id]) ? $this->timelines[$id] : false;
    }

    /**
     * Valide la configuration d'une timeline
     */
    private function validate_config($config) {
        if (!isset($config['trigger']) || !is_array($config['trigger'])) {
            return false;
        }

        $valid_trigger_types = ['scroll', 'load', 'click'];
        if (!in_array($config['trigger']['type'], $valid_trigger_types)) {
            return false;
        }

        return true;
    }

    /**
     * Convertit une timeline en configuration GSAP
     */
    public function to_gsap_config($timeline_id) {
        $timeline = $this->get_timeline($timeline_id);
        if (!$timeline) {
            return false;
        }

        return [
            'trigger' => $timeline['config']['trigger'],
            'animations' => $timeline['animations'],
            'sequence' => $timeline['config']['sequence'],
            'stagger' => $timeline['config']['stagger']
        ];
    }
} 