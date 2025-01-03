<?php
/**
 * Tests de compatibilité pour le plugin GSAP Animate
 */
class Test_Compatibility extends WP_UnitTestCase {
    private $animation_manager;
    private $data_store;
    private $core;

    public function setUp(): void {
        parent::setUp();
        $this->data_store = new UPGSAP_Data_Store();
        $this->animation_manager = new UPGSAP_Animation_Manager($this->data_store);
        $this->core = new UPGSAP_Core();
    }

    /**
     * Test la compatibilité avec l'éditeur classique
     */
    public function test_classic_editor_compatibility() {
        // Simuler l'environnement de l'éditeur classique
        if (!defined('CLASSIC_EDITOR_VERSION')) {
            define('CLASSIC_EDITOR_VERSION', '1.0');
        }
        
        // Vérifier que les hooks sont correctement ajoutés
        $this->assertTrue(has_action('edit_form_after_title', [$this->core, 'add_animation_metabox']));
        $this->assertTrue(has_action('save_post', [$this->core, 'save_animation_data']));
    }

    /**
     * Test la compatibilité avec différents thèmes
     */
    public function test_theme_compatibility() {
        $themes = [
            'twentytwentythree',
            'twentytwentytwo',
            'astra',
            'generatepress'
        ];

        foreach ($themes as $theme) {
            switch_theme($theme);
            
            // Vérifier que les styles sont correctement chargés
            $this->assertTrue(wp_style_is('up-gsap-animate-public', 'registered'));
            
            // Vérifier que GSAP est correctement chargé
            $this->assertTrue(wp_script_is('gsap-core', 'registered'));
            $this->assertTrue(wp_script_is('gsap-scrolltrigger', 'registered'));
        }
    }

    /**
     * Test la compatibilité avec les page builders
     */
    public function test_pagebuilder_compatibility() {
        $builders = [
            'elementor' => 'elementor/elementor.php',
            'divi-builder' => 'divi-builder/divi-builder.php',
            'beaver-builder' => 'beaver-builder-lite-version/fl-builder.php'
        ];

        foreach ($builders as $builder => $plugin) {
            // Simuler l'activation du builder
            activate_plugin($plugin);
            
            // Vérifier l'intégration des animations
            $animation = [
                'type' => 'fade',
                'duration' => 1,
                'trigger' => ['type' => 'scroll']
            ];
            
            $result = $this->animation_manager->register_animation('test-' . $builder, $animation);
            $this->assertTrue($result);
            
            // Vérifier que la configuration est correctement générée
            $config = $this->animation_manager->to_gsap_config('test-' . $builder);
            $this->assertIsArray($config);
            $this->assertArrayHasKey('duration', $config);
            
            deactivate_plugins($plugin);
        }
    }

    /**
     * Test la compatibilité avec différentes versions de PHP
     */
    public function test_php_compatibility() {
        // Vérifier les fonctionnalités PHP 7.4+
        $this->assertTrue(version_compare(PHP_VERSION, '7.4.0', '>='));
        
        // Tester les fonctionnalités typées
        try {
            $animation = [
                'type' => 'fade',
                'duration' => '1s' // Mauvais type intentionnel
            ];
            $this->animation_manager->register_animation('test-types', $animation);
            $this->fail('Should have thrown TypeError');
        } catch (TypeError $e) {
            $this->assertTrue(true);
        }
    }

    /**
     * Test la compatibilité avec différents navigateurs via User-Agent
     */
    public function test_browser_compatibility() {
        $user_agents = [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0'
        ];

        foreach ($user_agents as $ua) {
            $_SERVER['HTTP_USER_AGENT'] = $ua;
            
            // Vérifier que le code est généré correctement pour chaque navigateur
            $animation = [
                'type' => 'fade',
                'duration' => 1,
                'trigger' => ['type' => 'scroll']
            ];
            
            $result = $this->animation_manager->register_animation('test-browser', $animation);
            $this->assertTrue($result);
            
            $config = $this->animation_manager->to_gsap_config('test-browser');
            $this->assertIsArray($config);
        }
    }
}
