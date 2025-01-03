<?php
/**
 * Gestionnaire de stockage des données d'animation
 */
class UPGSAP_Data_Store {
    /**
     * Clé meta pour les données d'animation
     */
    const META_KEY = '_upgsap_animations';
    const ANIMATION_OPTION_KEY = 'upgsap_saved_animations';

    /**
     * Récupère toutes les animations sauvegardées
     */
    public function get_animations() {
        return get_option(self::ANIMATION_OPTION_KEY, []);
    }

    /**
     * Sauvegarde une animation globale
     */
    public function save_animation($name, $config) {
        $animations = $this->get_animations();
        $animations[$name] = $config;
        return update_option(self::ANIMATION_OPTION_KEY, $animations);
    }

    /**
     * Supprime une animation globale
     */
    public function delete_animation($name) {
        $animations = $this->get_animations();
        if (!isset($animations[$name])) {
            return false;
        }
        unset($animations[$name]);
        return update_option(self::ANIMATION_OPTION_KEY, $animations);
    }

    /**
     * Sauvegarde les configurations d'animation pour une page
     */
    public function save_page_animations($post_id, $animations) {
        if (!$this->validate_animations_data($animations)) {
            return false;
        }

        $data = [
            'version' => '1.0',
            'animations' => $animations,
            'updated' => current_time('mysql')
        ];

        return update_post_meta($post_id, self::META_KEY, $data);
    }

    /**
     * Récupère les configurations d'animation d'une page
     */
    public function get_page_animations($post_id) {
        $data = get_post_meta($post_id, self::META_KEY, true);
        
        if (empty($data)) {
            return [];
        }

        return apply_filters('upgsap_page_animations', $data['animations'], $post_id);
    }

    /**
     * Valide le format des données d'animation
     */
    private function validate_animations_data($animations) {
        if (!is_array($animations)) {
            return false;
        }

        foreach ($animations as $animation) {
            if (!isset($animation['type']) || !isset($animation['params'])) {
                return false;
            }
        }

        return true;
    }

    /**
     * Nettoie les données d'animation d'une page
     */
    public function clear_page_animations($post_id) {
        return delete_post_meta($post_id, self::META_KEY);
    }

    /**
     * Exporte les configurations d'animation
     */
    public function export_animations($post_id) {
        $data = $this->get_page_animations($post_id);
        if (empty($data)) {
            return false;
        }

        return wp_json_encode($data);
    }

    /**
     * Importe des configurations d'animation
     */
    public function import_animations($post_id, $json_data) {
        $data = json_decode($json_data, true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            return false;
        }

        return $this->save_page_animations($post_id, $data);
    }
} 