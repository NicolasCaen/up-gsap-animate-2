<?php
/**
 * Plugin Name: UP GSAP Animate 2
 * Description: Plugin WordPress permettant d'ajouter des animations GSAP aux éléments de page
 * Version: 1.0.0
 * Author: UP
 * License: GPL-2.0+
 * Text Domain: up-gsap-animate-2
 */

// Si ce fichier est appelé directement, on sort.
if (!defined('WPINC')) {
    die;
}

define('UPGSAP_VERSION', '1.0.0');
define('UPGSAP_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('UPGSAP_PLUGIN_URL', plugin_dir_url(__FILE__));

// Autoloader
spl_autoload_register(function ($class) {
    $prefix = 'UPGSAP_';
    $base_dir = UPGSAP_PLUGIN_DIR . 'includes/';

    if (strpos($class, $prefix) === 0) {
        $relative_class = substr($class, strlen($prefix));
        $file = $base_dir . 'class-' . strtolower(str_replace('_', '-', $relative_class)) . '.php';
        if (file_exists($file)) {
            require $file;
        }
    }
});

// Initialisation du plugin
function upgsap_init() {
    $core = new UPGSAP_Core();
    $core->init();
}
add_action('plugins_loaded', 'upgsap_init'); 