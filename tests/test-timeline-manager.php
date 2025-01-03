<?php
/**
 * Tests pour la classe Timeline Manager
 */
class UPGSAP_Test_Timeline extends WP_UnitTestCase {
    private $timeline_manager;

    public function setUp(): void {
        parent::setUp();
        $this->timeline_manager = new UPGSAP_Timeline_Manager();
    }

    public function test_timeline_creation() {
        $timeline_params = [
            'trigger' => [
                'type' => 'scroll',
                'start' => 'top center'
            ],
            'animations' => []
        ];

        $result = $this->timeline_manager->create_timeline('header-sequence', $timeline_params);
        $this->assertTrue($result);

        $timeline = $this->timeline_manager->get_timeline('header-sequence');
        $this->assertNotFalse($timeline);
    }

    public function test_add_animation_to_timeline() {
        // Crée d'abord une timeline
        $this->timeline_manager->create_timeline('main-sequence', []);

        // Ajoute une animation
        $animation = [
            'target' => '.header',
            'animation' => 'fade-in',
            'position' => 0
        ];

        $result = $this->timeline_manager->add_to_timeline('main-sequence', $animation);
        $this->assertTrue($result);

        // Vérifie que l'animation a été ajoutée
        $timeline = $this->timeline_manager->get_timeline('main-sequence');
        $this->assertCount(1, $timeline['animations']);
    }

    public function test_invalid_timeline_params() {
        $invalid_params = [
            'trigger' => 'not-an-array',
            'animations' => 'also-not-an-array'
        ];

        $result = $this->timeline_manager->create_timeline('invalid', $invalid_params);
        $this->assertFalse($result);
    }
} 