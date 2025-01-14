<?php
/**
 * Tests pour la classe Animation Manager
 */
class UPGSAP_Test_Animations extends WP_UnitTestCase {
    private $animation_manager;

    public function setUp(): void {
        parent::setUp();
        $this->animation_manager = new UPGSAP_Animation_Manager();
    }

    public function test_animation_registration() {
        // Test d'enregistrement d'une animation valide
        $animation_params = [
            'duration' => 1,
            'ease' => 'power2.out',
            'opacity' => 0,
            'y' => 50
        ];

        $result = $this->animation_manager->register_animation('fade-in', $animation_params);
        $this->assertTrue($result);

        // Vérifie que l'animation est correctement enregistrée
        $stored_animation = $this->animation_manager->get_animation('fade-in');
        $this->assertNotFalse($stored_animation);
        $this->assertEquals($animation_params['duration'], $stored_animation['duration']);
    }

    public function test_invalid_animation_params() {
        // Test avec des paramètres invalides
        $invalid_params = [
            'duration' => 'invalid',
            'ease' => 123,
            'opacity' => 'not-a-number'
        ];

        $result = $this->animation_manager->register_animation('invalid', $invalid_params);
        $this->assertFalse($result);
    }

    public function test_animation_defaults() {
        // Test des valeurs par défaut
        $minimal_params = ['duration' => 2];
        $this->animation_manager->register_animation('minimal', $minimal_params);
        
        $animation = $this->animation_manager->get_animation('minimal');
        $this->assertEquals(1, $animation['opacity']);
        $this->assertEquals(0, $animation['x']);
        $this->assertEquals(0, $animation['y']);
    }
} 