<?php
/**
 * Plugin Name: WorkBench HR
 * Description: Workbench HR marketing site (static front experience shipped as a plugin).
 * Version: 1.3.0
 * Author: Workbench HR
 * Text Domain: workbench-hr
 */

if (!defined('ABSPATH')) {
  exit;
}

define('WBHR_PLUGIN_FILE', __FILE__);
define('WBHR_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('WBHR_PLUGIN_URL', plugin_dir_url(__FILE__));
define('WBHR_PAGE_SLUG', 'demo');

/**
 * Make sure a real WP page exists at /demo/ (and keep homepage pointed at it).
 */
function wbhr_ensure_landing_page() {
  // Prefer the new /demo slug; migrate an old /workbench page if present.
  $found = get_posts(array(
    'name'           => 'demo',
    'post_type'      => 'page',
    'post_status'    => array('publish', 'draft', 'private'),
    'posts_per_page' => 1,
    'fields'         => 'ids',
  ));

  if (empty($found)) {
    $legacy = get_posts(array(
      'name'           => 'workbench',
      'post_type'      => 'page',
      'post_status'    => array('publish', 'draft', 'private'),
      'posts_per_page' => 1,
      'fields'         => 'ids',
    ));
    if (!empty($legacy)) {
      wp_update_post(array(
        'ID'        => (int) $legacy[0],
        'post_name' => 'demo',
        'post_title'=> 'Workbench HR Demo',
        'post_status' => 'publish',
      ));
      return (int) $legacy[0];
    }

    return (int) wp_insert_post(array(
      'post_title'   => 'Workbench HR Demo',
      'post_name'    => 'demo',
      'post_status'  => 'publish',
      'post_type'    => 'page',
      'post_content' => '<!-- Workbench HR landing is rendered by the WorkBench HR plugin. -->',
    ));
  }

  $id = (int) $found[0];
  if (get_post_status($id) !== 'publish') {
    wp_update_post(array(
      'ID'          => $id,
      'post_status' => 'publish',
    ));
  }
  return $id;
}

function wbhr_set_as_homepage() {
  $page_id = wbhr_ensure_landing_page();
  if ($page_id <= 0) {
    return;
  }
  update_option('show_on_front', 'page');
  update_option('page_on_front', $page_id);
}

register_activation_hook(__FILE__, function () {
  wbhr_set_as_homepage();
  flush_rewrite_rules();
});

register_deactivation_hook(__FILE__, function () {
  flush_rewrite_rules();
});

add_action('init', function () {
  wbhr_set_as_homepage();
}, 20);

function wbhr_request_path() {
  if (empty($_SERVER['REQUEST_URI'])) {
    return '';
  }
  $path = (string) wp_parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
  return trim($path, '/');
}

function wbhr_is_landing_request() {
  if (is_admin() || wp_doing_ajax() || wp_doing_cron()) {
    return false;
  }
  if (defined('REST_REQUEST') && REST_REQUEST) {
    return false;
  }
  if (defined('XMLRPC_REQUEST') && XMLRPC_REQUEST) {
    return false;
  }

  if (!is_feed() && is_front_page()) {
    return true;
  }

  if (is_page(array('demo', 'workbench'))) {
    return true;
  }

  $path = wbhr_request_path();
  return ($path === '' || $path === 'demo' || $path === 'workbench');
}

/**
 * Serve landing HTML with a clean site base URL, while assets still load from the plugin folder.
 */
function wbhr_prepare_landing_html($html) {
  $plugin_base = esc_url(trailingslashit(WBHR_PLUGIN_URL));
  $site_base   = esc_url(trailingslashit(home_url('/')));

  // Point relative CSS/JS/images at the plugin directory.
  $html = preg_replace_callback(
    '#\s(href|src)=([\'"])(?!https?:|//|/|#|mailto:|tel:|data:|javascript:)([^\'"]+)\2#i',
    function ($m) use ($plugin_base) {
      return ' ' . $m[1] . '=' . $m[2] . $plugin_base . ltrim($m[3], './') . $m[2];
    },
    $html
  );

  // Keep the address bar on the real site domain (not /wp-content/plugins/...).
  if (stripos($html, '<base ') === false) {
    $html = preg_replace(
      '#<head([^>]*)>#i',
      '<head$1><base href="' . $site_base . '">',
      $html,
      1
    );
  }

  return $html;
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

  $html = wbhr_prepare_landing_html($html);

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
  $path = wbhr_request_path();

  // Old pretty path → /demo
  if ($path === 'workbench') {
    wp_safe_redirect(home_url('/demo'), 301);
    exit;
  }

  if (!wbhr_is_landing_request()) {
    return;
  }

  wbhr_serve_landing();
}, 0);

add_action('admin_notices', function () {
  if (!current_user_can('activate_plugins')) {
    return;
  }
  $screen = function_exists('get_current_screen') ? get_current_screen() : null;
  if (!$screen || $screen->id !== 'plugins') {
    return;
  }
  echo '<div class="notice notice-success"><p>';
  echo 'WorkBench HR homepage: <a href="' . esc_url(home_url('/')) . '"><strong>' . esc_html(home_url('/')) . '</strong></a>';
  echo ' · Demo: <a href="' . esc_url(home_url('/demo')) . '"><strong>' . esc_html(home_url('/demo')) . '</strong></a>';
  echo '</p></div>';
});
