<?php
/**
 * Configuration PHPUnit pour les tests
 */

// Charge l'autoloader de WordPress
$_tests_dir = getenv('WP_TESTS_DIR');
if (!$_tests_dir) {
    $_tests_dir = '/tmp/wordpress-tests-lib';
}

// Charge le framework de test WordPress
require_once $_tests_dir . '/includes/functions.php';
require_once $_tests_dir . '/includes/bootstrap.php'; 