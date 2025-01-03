<?php
/**
 * Gestionnaire des animations GSAP
 */
class UPGSAP_Animation_Manager {
    /**
     * Liste des animations enregistrées
     */
    private $animations = [];
    private $data_store;

    /**
     * Constructeur
     */
    public function __construct($data_store) {
        $this->data_store = $data_store;
        $this->load_saved_animations();
    }

    /**
     * Charge les animations sauvegardées
     */
    private function load_saved_animations() {
        $saved_animations = $this->data_store->get_animations();
        if ($saved_animations) {
            $this->animations = array_merge($this->animations, $saved_animations);
        }
    }

    /**
     * Enregistre une nouvelle animation
     */
    public function register_animation($name, $params) {
        if (!$this->validate_params($params)) {
            return false;
        }

        $this->animations[$name] = array_merge($this->get_default_params(), $params);
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
        // Validation basique des paramètres
        if (isset($params['duration']) && !is_numeric($params['duration'])) {
            return false;
        }

        if (isset($params['opacity']) && (!is_numeric($params['opacity']) || $params['opacity'] < 0 || $params['opacity'] > 1)) {
            return false;
        }

        return true;
    }

    private function get_default_params() {
        return [
            'duration' => 1,
            'ease' => 'power2.out',
            'opacity' => 1,
            'x' => 0,
            'y' => 0,
            'scale' => 1,
            'rotation' => 0
        ];
    }

    /**
     * Sauvegarde une animation dans la base de données
     */
    public function save_animation($name, $params) {
        if (!$this->register_animation($name, $params)) {
            return false;
        }

        return $this->data_store->save_animation($name, $this->animations[$name]);
    }

    /**
     * Supprime une animation
     */
    public function delete_animation($name) {
        if (!isset($this->animations[$name])) {
            return false;
        }

        unset($this->animations[$name]);
        return $this->data_store->delete_animation($name);
    }

    /**
     * Convertit les paramètres en configuration GSAP
     */
    public function to_gsap_config($animation_name) {
        $animation = $this->get_animation($animation_name);
        if (!$animation) {
            return false;
        }

        return apply_filters('upgsap_animation_config', $animation, $animation_name);
    }
} 