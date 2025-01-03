<?php
/**
 * Gestionnaire des timelines GSAP
 */
class UPGSAP_Timeline_Manager {
    /**
     * Liste des timelines enregistrées
     */
    private $timelines = [];

    /**
     * Crée une nouvelle timeline
     */
    public function create_timeline($id, $params) {
        if (!$this->validate_timeline_params($params)) {
            return false;
        }

        $this->timelines[$id] = array_merge($this->get_default_timeline_params(), $params);
        
        do_action('upgsap_after_timeline_created', $id);
        return true;
    }

    /**
     * Ajoute une animation à une timeline
     */
    public function add_to_timeline($timeline_id, $animation) {
        if (!isset($this->timelines[$timeline_id])) {
            return false;
        }

        if (!isset($this->timelines[$timeline_id]['animations'])) {
            $this->timelines[$timeline_id]['animations'] = [];
        }

        $this->timelines[$timeline_id]['animations'][] = $animation;
        return true;
    }

    /**
     * Récupère une timeline
     */
    public function get_timeline($id) {
        return isset($this->timelines[$id]) ? $this->timelines[$id] : false;
    }

    /**
     * Valide les paramètres d'une timeline
     */
    private function validate_timeline_params($params) {
        // Validation basique
        if (isset($params['trigger']) && !is_array($params['trigger'])) {
            return false;
        }

        if (isset($params['animations']) && !is_array($params['animations'])) {
            return false;
        }

        return true;
    }

    /**
     * Paramètres par défaut d'une timeline
     */
    private function get_default_timeline_params() {
        return [
            'trigger' => [
                'type' => 'scroll',
                'start' => 'top center'
            ],
            'animations' => [],
            'stagger' => 0,
            'position' => '+=0'
        ];
    }

    /**
     * Convertit la timeline en configuration GSAP
     */
    public function to_gsap_config($timeline_id) {
        $timeline = $this->get_timeline($timeline_id);
        if (!$timeline) {
            return false;
        }

        return apply_filters('upgsap_timeline_config', $timeline, $timeline_id);
    }
} 