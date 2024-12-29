<?php
/**
 * Tests pour la classe Timeline Manager
 */
class Test_UPGSAP_Timeline_Manager extends WP_UnitTestCase {
    private $timeline_manager;

    public function setUp(): void {
        parent::setUp();
        $this->timeline_manager = new UPGSAP_Timeline_Manager();
    }

    public function test_create_timeline() {
        $config = [
            'trigger' => [
                'type' => 'scroll',
                'start' => 'top center'
            ],
            'sequence' => 'sequential'
        ];

        $result = $this->timeline_manager->create_timeline('header-sequence', $config);
        $this->assertTrue($result);

        $timeline = $this->timeline_manager->get_timeline('header-sequence');
        $this->assertNotFalse($timeline);
        $this->assertEquals($config['sequence'], $timeline['config']['sequence']);
    }

    public function test_add_animation_to_timeline() {
        $this->timeline_manager->create_timeline('test-timeline');

        $animation_data = [
            'target' => '.header',
            'animation' => 'fade-in',
            'position': 0
        ];

        $result = $this->timeline_manager->add_to_timeline('test-timeline', $animation_data);
        $this->assertTrue($result);

        $timeline = $this->timeline_manager->get_timeline('test-timeline');
        $this->assertCount(1, $timeline['animations']);
    }

    public function test_invalid_timeline_config() {
        $invalid_config = [
            'trigger' => [
                'type' => 'invalid-type'
            ]
        ];

        $result = $this->timeline_manager->create_timeline('invalid', $invalid_config);
        $this->assertFalse($result);
    }

    public function test_timeline_gsap_config() {
        $config = [
            'trigger' => [
                'type' => 'scroll',
                'start' => 'top center'
            ],
            'sequence' => 'sequential',
            'stagger' => 0.2
        ];

        $this->timeline_manager->create_timeline('test', $config);
        $gsap_config = $this->timeline_manager->to_gsap_config('test');

        $this->assertIsArray($gsap_config);
        $this->assertEquals($config['trigger'], $gsap_config['trigger']);
        $this->assertEquals($config['stagger'], $gsap_config['stagger']);
    }
} 