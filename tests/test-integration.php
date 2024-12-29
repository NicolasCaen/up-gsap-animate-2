<?php
/**
 * Tests d'intégration pour le plugin GSAP Animate
 */
class Test_UPGSAP_Integration extends WP_UnitTestCase {
    private $core;
    private $animation_manager;
    private $timeline_manager;
    private $data_store;

    public function setUp(): void {
        parent::setUp();
        
        // Initialise les composants principaux
        $this->core = new UPGSAP_Core();
        $this->animation_manager = $this->core->get_animation_manager();
        $this->timeline_manager = $this->core->get_timeline_manager();
        $this->data_store = $this->core->get_data_store();
    }

    public function test_full_animation_workflow() {
        // 1. Enregistre une animation
        $animation_params = [
            'duration' => 1,
            'ease' => 'power2.out',
            'opacity' => 0,
            'y' => 50
        ];
        
        $this->animation_manager->register_animation('fade-in', $animation_params);

        // 2. Crée une timeline
        $timeline_config = [
            'trigger' => [
                'type' => 'scroll',
                'start' => 'top center'
            ],
            'sequence' => 'sequential'
        ];
        
        $this->timeline_manager->create_timeline('header-sequence', $timeline_config);

        // 3. Ajoute l'animation à la timeline
        $animation_data = [
            'target' => '.header',
            'animation' => 'fade-in',
            'position' => 0
        ];
        
        $this->timeline_manager->add_to_timeline('header-sequence', $animation_data);

        // 4. Sauvegarde la configuration
        $post_id = $this->factory->post->create();
        $config = [
            'animations' => [
                'fade-in' => $animation_params
            ],
            'timelines' => [
                'header-sequence' => [
                    'config' => $timeline_config,
                    'animations' => [$animation_data]
                ]
            ]
        ];
        
        $save_result = $this->data_store->save_page_animations($post_id, $config);
        $this->assertTrue($save_result);

        // 5. Vérifie la récupération des données
        $stored_config = $this->data_store->get_page_animations($post_id);
        $this->assertNotEmpty($stored_config);
        $this->assertEquals($config['animations']['fade-in'], $stored_config['animations']['fade-in']);
    }

    public function test_gutenberg_integration() {
        // Simule l'enregistrement d'un bloc Gutenberg
        $block_content = '<!-- wp:upgsap/animation-controls {
            "animation": {
                "type": "fade",
                "duration": 1,
                "ease": "power2.out"
            },
            "trigger": {
                "type": "scroll",
                "start": "top center"
            }
        } -->
        <div class="wp-block-upgsap-animation">Test content</div>
        <!-- /wp:upgsap/animation-controls -->';

        $post_id = $this->factory->post->create([
            'post_content' => $block_content
        ]);

        // Vérifie que le contenu est correctement parsé
        $post = get_post($post_id);
        $blocks = parse_blocks($post->post_content);
        
        $this->assertCount(1, $blocks);
        $this->assertEquals('upgsap/animation-controls', $blocks[0]['blockName']);
    }

    public function test_performance_optimization() {
        // Test du lazy loading
        $animation_html = '<div class="upgsap-animation" data-animation="fade-in"></div>';
        $filtered_html = apply_filters('the_content', $animation_html);
        
        // Vérifie que les attributs de lazy loading sont ajoutés
        $this->assertStringContainsString('data-gsap-loading="lazy"', $filtered_html);

        // Test de la désactivation mobile
        add_filter('upgsap_is_mobile', '__return_true');
        $mobile_html = apply_filters('the_content', $animation_html);
        $this->assertStringContainsString('data-animations-disabled', $mobile_html);
        remove_filter('upgsap_is_mobile', '__return_true');
    }

    public function test_error_handling() {
        // Test de la gestion des erreurs lors de l'enregistrement
        $invalid_config = ['invalid' => 'data'];
        $post_id = $this->factory->post->create();
        
        // Vérifie que les erreurs sont correctement gérées
        $result = $this->data_store->save_page_animations($post_id, $invalid_config);
        $this->assertFalse($result);
        
        // Vérifie les logs d'erreur
        $error_logs = $this->data_store->get_error_logs();
        $this->assertNotEmpty($error_logs);
    }

    public function test_cache_system() {
        $post_id = $this->factory->post->create();
        $config = [
            'animations' => [
                'test' => ['duration' => 1]
            ]
        ];

        // Sauvegarde et vérifie le cache
        $this->data_store->save_page_animations($post_id, $config);
        $cached_data = wp_cache_get("upgsap_animations_{$post_id}", 'upgsap');
        
        $this->assertNotFalse($cached_data);
        $this->assertEquals($config, $cached_data);

        // Vérifie l'invalidation du cache
        wp_update_post(['ID' => $post_id, 'post_content' => 'Updated']);
        $this->assertFalse(wp_cache_get("upgsap_animations_{$post_id}", 'upgsap'));
    }
} 