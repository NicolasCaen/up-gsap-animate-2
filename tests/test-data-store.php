<?php
/**
 * Tests pour la classe Data Store
 */
class UPGSAP_Test_Data_Store extends WP_UnitTestCase {
    private $data_store;
    private $test_post_id;

    public function setUp(): void {
        parent::setUp();
        $this->data_store = new UPGSAP_Data_Store();
        $this->test_post_id = $this->factory->post->create();
    }

    public function test_save_and_get_animations() {
        $test_animations = [
            [
                'type' => 'fade',
                'params' => [
                    'duration' => 1,
                    'ease' => 'power2.out'
                ]
            ]
        ];

        $result = $this->data_store->save_page_animations($this->test_post_id, $test_animations);
        $this->assertTrue($result);

        $saved_animations = $this->data_store->get_page_animations($this->test_post_id);
        $this->assertNotEmpty($saved_animations);
        $this->assertEquals($test_animations[0]['type'], $saved_animations[0]['type']);
    }

    public function test_invalid_animation_data() {
        $invalid_data = [
            ['invalid_format' => true]
        ];

        $result = $this->data_store->save_page_animations($this->test_post_id, $invalid_data);
        $this->assertFalse($result);
    }

    public function test_clear_animations() {
        $test_animations = [
            [
                'type' => 'fade',
                'params' => ['duration' => 1]
            ]
        ];

        $this->data_store->save_page_animations($this->test_post_id, $test_animations);
        $result = $this->data_store->clear_page_animations($this->test_post_id);
        
        $this->assertTrue($result);
        $this->assertEmpty($this->data_store->get_page_animations($this->test_post_id));
    }

    public function test_export_import_animations() {
        $original_animations = [
            [
                'type' => 'fade',
                'params' => [
                    'duration' => 1,
                    'ease' => 'power2.out'
                ]
            ]
        ];

        $this->data_store->save_page_animations($this->test_post_id, $original_animations);
        
        // Test export
        $exported = $this->data_store->export_animations($this->test_post_id);
        $this->assertNotFalse($exported);

        // Test import sur un nouveau post
        $new_post_id = $this->factory->post->create();
        $import_result = $this->data_store->import_animations($new_post_id, $exported);
        $this->assertTrue($import_result);

        // Vérifie que les données importées correspondent
        $imported_animations = $this->data_store->get_page_animations($new_post_id);
        $this->assertEquals($original_animations, $imported_animations);
    }
} 