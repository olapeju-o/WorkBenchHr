<?php
/**
 * Plugin Name: WorkBench HR
 * Description: Workbench HR marketing site (static front experience shipped as a plugin).
 * Version: 1.0.0
 * Author: Workbench HR
 * Text Domain: workbench-hr
 */

if (!defined('ABSPATH')) {
  exit;
}

define('WBHR_PLUGIN_FILE', __FILE__);
define('WBHR_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('WBHR_PLUGIN_URL', plugin_dir_url(__FILE__));

/**
 * Pretty URL: yoursite.com/workbench/
 * Serves the static marketing index from this plugin folder.
 */
add_action('init', function () {
  add_rewrite_rule('^workbench/?$', 'index.php?wbhr_landing=1', 'top');
  add_rewrite_tag('%wbhr_landing%', '1');
});

add_filter('query_vars', function ($vars) {
  $vars[] = 'wbhr_landing';
  return $vars;
});

add_action('template_redirect', function () {
  if ((string) get_query_var('wbhr_landing') !== '1') {
    return;
  }

  $file = WBHR_PLUGIN_DIR . 'index.html';
  if (!is_readable($file)) {
    status_header(404);
    exit('Workbench HR landing page is missing.');
  }

  // Rewrite relative asset URLs so CSS/JS/images load from the plugin directory.
  $html = file_get_contents($file);
  $base = esc_url(trailingslashit(WBHR_PLUGIN_URL));
  $html = preg_replace('#<head([^>]*)>#i', '<head$1><base href="' . $base . '">', $html, 1);

  nocache_headers();
  header('Content-Type: text/html; charset=utf-8');
  echo $html;
  exit;
});

register_activation_hook(__FILE__, function () {
  flush_rewrite_rules();
});

register_deactivation_hook(__FILE__, function () {
  flush_rewrite_rules();
});
