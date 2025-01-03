<?php
/**
 * Classe principale du plugin
 */
class UPGSAP_Core {
    private $version = '1.0.0';
    private $animation_manager;
    private $timeline_manager;
    private $data_store;

    public function __construct() {
        $this->load_dependencies();
        $this->init();
        $this->register_hooks();
    }

    public function init() {
        $this->data_store = new UPGSAP_Data_Store();
        $this->animation_manager = new UPGSAP_Animation_Manager($this->data_store);
        // Initialisation des autres managers à venir
    }

    public function register_hooks() {
        add_action('init', [$this, 'register_block']);
        add_action('wp_enqueue_scripts', [$this, 'enqueue_scripts']);
        add_action('admin_enqueue_scripts', [$this, 'admin_enqueue_scripts']);
    }

    public function load_dependencies() {
        require_once plugin_dir_path(dirname(__FILE__)) . 'includes/class-data-store.php';
        require_once plugin_dir_path(dirname(__FILE__)) . 'includes/class-animation-manager.php';
        // Chargement des autres dépendances
    }

    /**
     * Enregistre les scripts et styles pour le front-end
     */
    public function enqueue_scripts() {
        // GSAP Core
        wp_enqueue_script(
            'gsap-core',
            'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js',
            [],
            '3.12.2',
            true
        );

        // ScrollTrigger
        wp_enqueue_script(
            'gsap-scrolltrigger',
            'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js',
            ['gsap-core'],
            '3.12.2',
            true
        );

        // Plugin Scripts
        wp_enqueue_script(
            'up-gsap-animate-public',
            plugin_dir_url(dirname(__FILE__)) . 'public/js/animations.js',
            ['gsap-core', 'gsap-scrolltrigger'],
            $this->version,
            true
        );

        // Plugin Styles
        wp_enqueue_style(
            'up-gsap-animate-public',
            plugin_dir_url(dirname(__FILE__)) . 'public/css/animations.css',
            [],
            $this->version
        );
    }

    /**
     * Enregistre les scripts et styles pour l'admin
     */
    public function admin_enqueue_scripts($hook) {
        // N'enregistrer que sur les pages d'administration du plugin
        if (!in_array($hook, array('post.php', 'post-new.php'))) {
            return;
        }

        // Admin styles
        wp_enqueue_style(
            'upgsap-admin-style',
            plugin_dir_url(dirname(__FILE__)) . 'admin/css/admin.css',
            array(),
            $this->version
        );

        // Admin scripts
        wp_enqueue_script(
            'upgsap-admin',
            plugin_dir_url(dirname(__FILE__)) . 'admin/js/admin.js',
            array('jquery'),
            $this->version,
            true
        );

        wp_localize_script('upgsap-admin', 'upgsapAdmin', array(
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('upgsap-admin-nonce'),
            'confirmDelete' => __('Are you sure you want to delete this animation?', 'up-gsap-animate-2')
        ));
    }

    /**
     * Enregistre le bloc Gutenberg
     */
    public function register_block() {
        // Éviter le double enregistrement
        if (WP_Block_Type_Registry::get_instance()->is_registered('upgsap/animation-controls')) {
            return;
        }

        register_block_type(
            plugin_dir_path(dirname(__FILE__)) . 'blocks/animation-controls',
            [
                'editor_script' => 'up-gsap-animate-block',
                'editor_style'  => 'up-gsap-animate-block-editor',
                'render_callback' => [$this, 'render_animation_block']
            ]
        );

        // Enregistrer le script du bloc
        wp_register_script(
            'up-gsap-animate-block',
            plugin_dir_url(dirname(__FILE__)) . 'blocks/animation-controls/index.js',
            ['wp-blocks', 'wp-element', 'wp-editor', 'wp-components'],
            $this->version,
            true
        );

        // Enregistrer le style du bloc
        wp_register_style(
            'up-gsap-animate-block-editor',
            plugin_dir_url(dirname(__FILE__)) . 'blocks/animation-controls/editor.css',
            ['wp-edit-blocks'],
            $this->version
        );
    }

    /**
     * Rendu du bloc d'animation
     */
    public function render_animation_block($attributes, $content) {
        if (empty($attributes['animation'])) {
            return $content;
        }

        $animation_data = wp_json_encode($attributes['animation']);
        $wrapper_attributes = get_block_wrapper_attributes([
            'class' => 'upgsap-animated',
            'data-animation' => esc_attr($animation_data)
        ]);

        return sprintf(
            '<div %1$s>%2$s</div>',
            $wrapper_attributes,
            $content
        );
    }
}