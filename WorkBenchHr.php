<?php
/**
 * Plugin Name: WorkBench HR
 * Description: Workbench HR marketing site (static front experience shipped as a plugin).
 * Version: 1.1.0
 * Author: Workbench HR
 * Text Domain: workbench-hr
 */

if (!defined('ABSPATH')) {
  exit;
}

define('WBHR_PLUGIN_FILE', __FILE__);
define('WBHR_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('WBHR_PLUGIN_URL', plugin_dir_url(__FILE__));
define('WBHR_PAGE_SLUG', 'workbench');

/**
 * Make sure a real WP page exists at /workbench/ (more reliable than custom rewrites on WP.com).
 */
function wbhr_ensure_landing_page() {
  $found = get_posts(array(
    'name'           => WBHR_PAGE_SLUG,
    'post_type'      => 'page',
    'post_status'    => array('publish', 'draft', 'private'),
    'posts_per_page' => 1,
    'fields'         => 'ids',
  ));

  if (!empty($found)) {
    $id = (int) $found[0];
    if (get_post_status($id) !== 'publish') {
      wp_update_post(array(
        'ID'          => $id,
        'post_status' => 'publish',
      ));
    }
    return $id;
  }

  return (int) wp_insert_post(array(
    'post_title'   => 'Workbench HR',
    'post_name'    => WBHR_PAGE_SLUG,
    'post_status'  => 'publish',
    'post_type'    => 'page',
    'post_content' => '<!-- Workbench HR landing is rendered by the WorkBench HR plugin. -->',
  ));
}

register_activation_hook(__FILE__, function () {
  wbhr_ensure_landing_page();
  flush_rewrite_rules();
});

register_deactivation_hook(__FILE__, function () {
  flush_rewrite_rules();
});

add_action('init', function () {
  wbhr_ensure_landing_page();
}, 20);

/**
 * Serve the static marketing HTML for /workbench/ (page match or direct path match).
 */
function wbhr_is_landing_request() {
  if (is_page(WBHR_PAGE_SLUG)) {
    return true;
  }

  if (empty($_SERVER['REQUEST_URI'])) {
    return false;
  }

  $path = (string) wp_parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
  $path = trim($path, '/');

  // Handles /workbench and /workbench/
  if ($path === WBHR_PAGE_SLUG) {
    return true;
  }

  // Handles subdirectory installs like /blog/workbench
  if (substr($path, -strlen(WBHR_PAGE_SLUG)) === WBHR_PAGE_SLUG) {
    $before = substr($path, 0, -strlen(WBHR_PAGE_SLUG));
    if ($before === '' || substr($before, -1) === '/') {
      return true;
    }
  }

  return false;
}

function wbhr_serve_landing() {
  $file = WBHR_PLUGIN_DIR . 'index.html';
  if (!is_readable($file)) {
    status_header(404);
    header('Content-Type: text/plain; charset=utf-8');
    echo 'Workbench HR landing page file (index.html) is missing from the plugin.';
    exit;
  }

  $html = file_get_contents($file);
  if ($html === false) {
    status_header(500);
    exit('Unable to read Workbench HR landing page.');
  }

  $base = esc_url(trailingslashit(WBHR_PLUGIN_URL));
  if (stripos($html, '<base ') === false) {
    $html = preg_replace(
      '#<head([^>]*)>#i',
      '<head$1><base href="' . $base . '">',
      $html,
      1
    );
  }

  global $wp_query;
  if ($wp_query instanceof WP_Query) {
    $wp_query->is_404 = false;
  }

  status_header(200);
  nocache_headers();
  header('Content-Type: text/html; charset=utf-8');
  echo $html;
  exit;
}

add_action('template_redirect', function () {
  if (!wbhr_is_landing_request()) {
    return;
  }
  wbhr_serve_landing();
}, 0);

/**
 * Admin helper so it’s obvious where to look.
 */
add_action('admin_notices', function () {
  if (!current_user_can('activate_plugins')) {
    return;
  }
  $screen = function_exists('get_current_screen') ? get_current_screen() : null;
  if (!$screen || $screen->id !== 'plugins') {
    return;
  }
  $url = home_url('/' . WBHR_PAGE_SLUG . '/');
  echo '<div class="notice notice-success"><p>';
  echo 'WorkBench HR is active. Open the marketing page at <a href="' . esc_url($url) . '"><strong>' . esc_html($url) . '</strong></a>';
  echo '</p></div>';
});
