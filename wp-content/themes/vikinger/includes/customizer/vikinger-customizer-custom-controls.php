<?php
/**
 * Vikinger Customizer - Custom Controls
 * 
 * @since 1.6.3
 */

function vikinger_customizer_custom_controls() {
  class WP_VK_MultiSelect_Control extends WP_Customize_Control {
    public $type = 'vk_multiselect';

    /**
    * Render the control's content.
    */
    public function render_content() {
      $input_id         = '_customize-input-' . $this->id;
      $description_id   = '_customize-description-' . $this->id;
      $describedby_attr = ( ! empty( $this->description ) ) ? ' aria-describedby="' . esc_attr( $description_id ) . '" ' : '';

      $pages = get_pages();
      
    ?>
    <?php if ( ! empty( $this->label ) ) : ?>
        <label for="<?php echo esc_attr( $input_id ); ?>" class="customize-control-title"><?php echo esc_html( $this->label ); ?></label>
    <?php endif; ?>
    <?php if ( ! empty( $this->description ) ) : ?>
        <span id="<?php echo esc_attr( $description_id ); ?>" class="description customize-control-description"><?php echo $this->description; ?></span>
    <?php endif; ?>
      <select id="<?php echo esc_attr( $input_id ); ?>" <?php echo $describedby_attr; ?> <?php $this->link(); ?> size="<?php echo esc_attr(count($pages)); ?>" multiple>
    <?php foreach ($pages as $page) : ?>
    <?php $selected = in_array($page->ID, $this->value()); ?>
        <option value="<?php echo esc_attr($page->ID); ?>" <?php echo $selected ? selected(1, 1, false) : ''; ?>><?php echo esc_html($page->post_title); ?></option>
    <?php endforeach; ?>
      </select>
    <?php
    }
  }
}

add_action('customize_register', 'vikinger_customizer_custom_controls');

?>
