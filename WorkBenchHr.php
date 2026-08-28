<?php
/**
 * Plugin Name: WorkBench HR
 * Description: Workbench HR marketing site (static front experience shipped as a plugin).
 * Version: 1.3.1
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
 * Make sure a real WP page exists (used as the site homepage).
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

/**
 * Point WordPress "homepage" settings at the Workbench page.
 */
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

/**
 * True for the site homepage and the /workbench/ alias.
 */
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

  // WordPress front page (after page_on_front is set).
  if (!is_feed() && (is_front_page() || (is_page(WBHR_PAGE_SLUG) && is_front_page()))) {
    return true;
  }

  if (is_page(WBHR_PAGE_SLUG)) {
    return true;
  }

  $path = wbhr_request_path();

  // https://workbenchhr.com/
  if ($path === '') {
    return true;
  }

  // https://workbenchhr.com/workbench/
  if ($path === WBHR_PAGE_SLUG) {
    return true;
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
  // Keep /workbench/ working, but send people to the real homepage.
  $path = wbhr_request_path();
  if ($path === WBHR_PAGE_SLUG) {
    wp_safe_redirect(home_url('/'), 301);
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
  $url = home_url('/');
  echo '<div class="notice notice-success"><p>';
  echo 'WorkBench HR is active and set as the homepage: <a href="' . esc_url($url) . '"><strong>' . esc_html($url) . '</strong></a>';
  echo '</p></div>';
});
