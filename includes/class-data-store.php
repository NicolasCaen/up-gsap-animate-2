<?php
/**
 * Gestionnaire de stockage des données
 */
class UPGSAP_Data_Store {
    /**
     * Clé meta pour les configurations d'animation
     */
    const META_KEY = '_upgsap_animations';

    /**
     * Clé de l'option pour le cache global
     */
    const CACHE_KEY = 'upgsap_cache';

    /**
     * Sauvegarde les configurations d'animation pour une page
     */
    public function save_page_animations($post_id, $data) {
        if (!$this->validate_data($data)) {
            return false;
        }

        // Sanitize avant sauvegarde
        $sanitized_data = $this->sanitize_data($data);
        
        // Sauvegarde dans les meta données
        update_post_meta($post_id, self::META_KEY, $sanitized_data);
        
        // Met à jour le cache
        $this->update_cache($post_id, $sanitized_data);
        
        return true;
    }

    /**
     * Récupère les configurations d'animation pour une page
     */
    public function get_page_animations($post_id) {
        // Essaie d'abord de récupérer depuis le cache
        $cached_data = $this->get_from_cache($post_id);
        if ($cached_data !== false) {
            return $cached_data;
        }

        // Sinon, récupère depuis les meta données
        $data = get_post_meta($post_id, self::META_KEY, true);
        if (empty($data)) {
            return [];
        }

        return $data;
    }

    /**
     * Valide la structure des données
     */
    private function validate_data($data) {
        if (!is_array($data)) {
            return false;
        }

        // Vérifie la structure de base
        $required_keys = ['animations', 'timelines'];
        foreach ($required_keys as $key) {
            if (!isset($data[$key]) || !is_array($data[$key])) {
                return false;
            }
        }

        return true;
    }

    /**
     * Sanitize les données avant sauvegarde
     */
    private function sanitize_data($data) {
        $sanitized = [];

        // Sanitize les animations
        $sanitized['animations'] = array_map(function($animation) {
            return array_map('sanitize_text_field', $animation);
        }, $data['animations']);

        // Sanitize les timelines
        $sanitized['timelines'] = array_map(function($timeline) {
            return [
                'config' => array_map('sanitize_text_field', $timeline['config']),
                'animations' => array_map('sanitize_text_field', $timeline['animations'])
            ];
        }, $data['timelines']);

        return $sanitized;
    }

    /**
     * Met à jour le cache
     */
    private function update_cache($post_id, $data) {
        $cache = get_option(self::CACHE_KEY, []);
        $cache[$post_id] = [
            'data' => $data,
            'timestamp' => time()
        ];
        update_option(self::CACHE_KEY, $cache);
    }

    /**
     * Récupère les données depuis le cache
     */
    private function get_from_cache($post_id) {
        $cache = get_option(self::CACHE_KEY, []);
        
        if (!isset($cache[$post_id])) {
            return false;
        }

        // Vérifie si le cache est encore valide (24h)
        if (time() - $cache[$post_id]['timestamp'] > 86400) {
            return false;
        }

        return $cache[$post_id]['data'];
    }

    /**
     * Vide le cache
     */
    public function flush_cache() {
        delete_option(self::CACHE_KEY);
    }

    /**
     * Exporte toutes les configurations
     */
    public function export_all() {
        global $wpdb;
        
        $query = $wpdb->prepare(
            "SELECT post_id, meta_value FROM {$wpdb->postmeta} WHERE meta_key = %s",
            self::META_KEY
        );
        
        $results = $wpdb->get_results($query);
        
        $export = [];
        foreach ($results as $row) {
            $export[$row->post_id] = maybe_unserialize($row->meta_value);
        }
        
        return $export;
    }

    /**
     * Importe des configurations
     */
    public function import_data($data) {
        if (!is_array($data)) {
            return false;
        }

        foreach ($data as $post_id => $config) {
            if ($this->validate_data($config)) {
                $this->save_page_animations($post_id, $config);
            }
        }

        return true;
    }
} 