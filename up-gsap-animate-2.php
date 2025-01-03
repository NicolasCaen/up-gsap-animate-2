<?php
/**
 * Plugin Name: UP GSAP Animate 2
 * Description: Animation manager using GSAP
 * Version: 1.0.0
 */

if (!defined('ABSPATH')) exit;

define('UPGSAP_VERSION', '1.0.0');
define('UPGSAP_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('UPGSAP_PLUGIN_URL', plugin_dir_url(__FILE__));

class UP_GSAP_Animate {
    private $core;

    public function __construct() {
        add_action('plugins_loaded', array($this, 'init'));
        add_action('enqueue_block_editor_assets', array($this, 'enqueue_editor_assets'));
    }

    public function init() {
        // Charger les dépendances
        require_once UPGSAP_PLUGIN_DIR . 'includes/class-core.php';
        
        // Initialiser le core
        $this->core = new UPGSAP_Core();
    }

    /**
     * Enregistre les assets pour l'éditeur
     */
    public function enqueue_editor_assets() {
        // Scripts
        wp_enqueue_script(
            'upgsap-editor',
            UPGSAP_PLUGIN_URL . 'dist/blocks/animation-controls/index.js', // Changé pour utiliser le fichier compilé
            array(
                'wp-blocks',
                'wp-i18n',
                'wp-element',
                'wp-block-editor',
                'wp-components',
                'wp-compose',
                'wp-hooks'
            ),
            UPGSAP_VERSION,
            true
        );

        // Styles
        wp_enqueue_style(
            'upgsap-editor-style',
            UPGSAP_PLUGIN_URL . 'blocks/animation-controls/editor.css',
            array('wp-edit-blocks'),
            UPGSAP_VERSION
        );

        // Localization
        wp_localize_script(
            'upgsap-editor',
            'upgsapData',
            array(
                'pluginUrl' => UPGSAP_PLUGIN_URL,
                'version' => UPGSAP_VERSION,
                'nonce' => wp_create_nonce('upgsap-nonce')
            )
        );
    }

    /**
     * Active le plugin
     */
    public static function activate() {
        // Créer les tables si nécessaire
        if (!get_option('upgsap_version')) {
            add_option('upgsap_version', UPGSAP_VERSION);
        }
    }

    /**
     * Désactive le plugin
     */
    public static function deactivate() {
        // Nettoyage si nécessaire
    }
}

// Hooks d'activation/désactivation
register_activation_hook(__FILE__, array('UP_GSAP_Animate', 'activate'));
register_deactivation_hook(__FILE__, array('UP_GSAP_Animate', 'deactivate'));

// Initialiser le plugin
$upgsap = new UP_GSAP_Animate();