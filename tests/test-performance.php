<?php
/**
 * Tests de performance pour le plugin GSAP Animate
 */
class Test_UPGSAP_Performance extends WP_UnitTestCase {
    private $core;
    private $start_memory;
    private $start_time;

    public function setUp(): void {
        parent::setUp();
        $this->core = new UPGSAP_Core();
        $this->start_memory = memory_get_usage();
        $this->start_time = microtime(true);
    }

    /**
     * Test la consommation mémoire lors du chargement des animations
     */
    public function test_memory_usage() {
        // Crée plusieurs animations pour tester l'impact mémoire
        for ($i = 0; $i < 100; $i++) {
            $animation_params = [
                'duration' => 1,
                'ease' => 'power2.out',
                'opacity' => 0,
                'y' => 50
            ];
            
            $this->core->get_animation_manager()->register_animation("animation-{$i}", $animation_params);
        }

        $memory_used = memory_get_usage() - $this->start_memory;
        
        // Vérifie que l'utilisation mémoire reste raisonnable (< 5MB)
        $this->assertLessThan(5 * 1024 * 1024, $memory_used);
    }

    /**
     * Test les performances du système de cache
     */
    public function test_cache_performance() {
        $post_id = $this->factory->post->create();
        $config = [
            'animations' => array_fill(0, 50, ['duration' => 1])
        ];

        // Test de la vitesse d'écriture du cache
        $start_write = microtime(true);
        $this->core->get_data_store()->save_page_animations($post_id, $config);
        $write_time = microtime(true) - $start_write;

        // Test de la vitesse de lecture du cache
        $start_read = microtime(true);
        for ($i = 0; $i < 100; $i++) {
            $this->core->get_data_store()->get_page_animations($post_id);
        }
        $read_time = (microtime(true) - $start_read) / 100;

        // Les opérations devraient être rapides (< 10ms)
        $this->assertLessThan(0.01, $write_time);
        $this->assertLessThan(0.01, $read_time);
    }

    /**
     * Test les performances du rendu des animations
     */
    public function test_render_performance() {
        // Crée une page avec plusieurs animations
        $animations = [];
        for ($i = 0; $i < 20; $i++) {
            $animations[] = sprintf(
                '<div class="upgsap-animation" data-animation=\'{"type":"fade","duration":1}\'></div>'
            );
        }
        
        $content = implode("\n", $animations);
        
        // Mesure le temps de rendu
        $start_render = microtime(true);
        $filtered_content = apply_filters('the_content', $content);
        $render_time = microtime(true) - $start_render;

        // Le rendu devrait être rapide (< 50ms)
        $this->assertLessThan(0.05, $render_time);
    }

    /**
     * Test l'optimisation du chargement des ressources
     */
    public function test_resource_loading() {
        global $wp_scripts;

        // Simule une page avec des animations
        $post_id = $this->factory->post->create([
            'post_content' => '<div class="upgsap-animation"></div>'
        ]);
        
        // Force le chargement des scripts
        do_action('wp_enqueue_scripts');
        
        // Vérifie que GSAP est chargé de manière optimisée
        $gsap_script = $wp_scripts->registered['gsap-core'];
        $this->assertTrue($gsap_script->extra['async'] || $gsap_script->extra['defer']);
    }

    /**
     * Test la performance du lazy loading
     */
    public function test_lazy_loading() {
        $observer = $this->getMockBuilder('IntersectionObserver')
                        ->disableOriginalConstructor()
                        ->getMock();

        // Simule 50 éléments d'animation
        $elements = [];
        for ($i = 0; $i < 50; $i++) {
            $elements[] = [
                'isIntersecting' => false,
                'target' => new DOMElement('div')
            ];
        }

        $start_observe = microtime(true);
        foreach ($elements as $entry) {
            if ($entry['isIntersecting']) {
                // Simule le chargement
                $this->core->get_animation_manager()->load_animation($entry['target']);
            }
        }
        $observe_time = microtime(true) - $start_observe;

        // Le traitement devrait être rapide (< 1ms par élément)
        $this->assertLessThan(0.05, $observe_time);
    }

    /**
     * Test la performance de la validation des données
     */
    public function test_validation_performance() {
        $large_config = [
            'animations' => array_fill(0, 100, [
                'duration' => 1,
                'ease' => 'power2.out',
                'opacity' => 0,
                'y' => 50
            ])
        ];

        $start_validation = microtime(true);
        $this->core->get_data_store()->validate_data($large_config);
        $validation_time = microtime(true) - $start_validation;

        // La validation devrait être rapide même avec beaucoup de données
        $this->assertLessThan(0.1, $validation_time);
    }

    public function tearDown(): void {
        parent::tearDown();
        
        // Log des métriques de performance
        $total_time = microtime(true) - $this->start_time;
        $total_memory = memory_get_usage() - $this->start_memory;
        
        error_log(sprintf(
            'Test Performance Metrics - Time: %.4fs, Memory: %.2fMB',
            $total_time,
            $total_memory / 1024 / 1024
        ));
    }
} 