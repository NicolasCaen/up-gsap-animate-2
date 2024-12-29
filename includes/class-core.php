<?php
/**
 * Classe principale du plugin
 */
class UPGSAP_Core {
    private $version;
    private $animation_manager;
    private $timeline_manager;
    private $data_store;

    public function __construct() {
        $this->version = UPGSAP_VERSION;
    }

    public function init() {
        $this->load_dependencies();
        $this->register_hooks();
    }

    private function load_dependencies() {
        require_once UPGSAP_PLUGIN_DIR . 'includes/class-animation-manager.php';
        require_once UPGSAP_PLUGIN_DIR . 'includes/class-timeline-manager.php';
        require_once UPGSAP_PLUGIN_DIR . 'includes/class-data-store.php';

        $this->animation_manager = new UPGSAP_Animation_Manager();
        $this->timeline_manager = new UPGSAP_Timeline_Manager();
        $this->data_store = new UPGSAP_Data_Store();
    }

    private function register_hooks() {
        register_activation_hook(UPGSAP_PLUGIN_DIR . 'up-gsap-animate-2.php', array($this, 'activate'));
        register_deactivation_hook(UPGSAP_PLUGIN_DIR . 'up-gsap-animate-2.php', array($this, 'deactivate'));
        
        add_action('wp_enqueue_scripts', array($this, 'enqueue_scripts'));
        add_action('admin_enqueue_scripts', array($this, 'enqueue_admin_scripts'));
    }

    public function activate() {
        // Code d'activation
    }

    public function deactivate() {
        // Code de désactivation
    }

    public function enqueue_scripts() {
        // Chargement conditionnel de GSAP
        if ($this->should_load_gsap()) {
            wp_enqueue_script('gsap-core', 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js', array(), '3.12.2', true);
            wp_enqueue_script('gsap-scroll-trigger', 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js', array('gsap-core'), '3.12.2', true);
        }
    }

    private function should_load_gsap() {
        // Vérification si la page contient des animations
        return true; // À implémenter plus tard
    }

    public function enqueue_admin_scripts($hook) {
        if ('post.php' === $hook || 'post-new.php' === $hook) {
            wp_enqueue_script('upgsap-admin', UPGSAP_PLUGIN_URL . 'admin/js/admin.js', array('wp-blocks', 'wp-element'), $this->version, true);
        }
    }
} 