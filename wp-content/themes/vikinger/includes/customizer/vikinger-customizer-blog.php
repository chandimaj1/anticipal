<?php
/**
 * Vikinger Customizer - Blog
 * 
 * @since 1.0.0
 */

function vikinger_customizer_blog($wp_customize) {
  /**
   * Blog section
   */
  $wp_customize->add_section('vikinger_blog', [
    'title'       => esc_html_x('Blog', '(Customizer) Blog - Title', 'vikinger'),
    'description' => esc_html_x('From here, you can change the blog post type used for regular open posts.', '(Customizer) Blog - Description', 'vikinger'),
    'priority'    => 280,
    'panel'       => 'vikinger_customizer'
  ]);

  /**
   * Post Type
   */
  $wp_customize->add_setting('vikinger_blog_setting_type', [
    'sanitize_callback' => 'sanitize_text_field',
    'default'           => 'v1'
  ]);

  $wp_customize->add_control('vikinger_blog_control_type', [
    'label'       => esc_html_x('Version 1 / Version 2', '(Customizer) Blog Option - Version 1 / Version 2 - Title', 'vikinger'),
    'description' => esc_html_x('You can choose to use version 1 or version 2 of the blog open post.', '(Customizer) Blog Option - Version 1 / Version 2 - Description', 'vikinger'),
    'type'        => 'radio',
    'choices'     => [
      'v1'  => esc_html__('Version 1', 'vikinger'),
      'v2'  => esc_html__('Version 2', 'vikinger')
    ],
    'section'     => 'vikinger_blog',
    'settings'    => 'vikinger_blog_setting_type',
  ]);
}

add_action('customize_register', 'vikinger_customizer_blog');