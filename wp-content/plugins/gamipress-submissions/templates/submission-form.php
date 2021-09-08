<?php
/**
 * Submission form template
 *
 * This template can be overridden by copying it to yourtheme/gamipress/submissions/submission-form.php
 */
global $gamipress_submissions_template_args;

// Shorthand
$a = $gamipress_submissions_template_args;

$user_id = get_current_user_id();
$post_id = $a['post_id'];
$submission = gamipress_submissions_get_user_pending_submission( $user_id, $post_id ); ?>

<?php if( $submission ) : ?>

    <div class="gamipress-submissions-form">
        <p class="gamipress-submissions-pending-message gamipress-notice gamipress-notice-success"><?php echo __( 'Your submission has been sent successfully and is waiting for approval.', 'gamipress-submissions' ); ?></p>
        <?php if( ! empty( $submission->notes ) ) : ?>
        <label><?php echo $a['notes_label']; ?></label>
        <p class="gamipress-submissions-pending-notes"><?php echo $submission->notes; ?></p>
        <?php endif; ?>
    </div>

<?php else : ?>

    <div id="gamipress-submissions-form-<?php echo $post_id; ?>" class="gamipress-submissions-form" data-id="<?php echo $post_id; ?>">

        <?php
        /**
         * Before render submission form
         *
         * @since 1.0.0
         *
         * @param int   $post_id        The achievement or rank ID
         * @param int   $user_id        The user ID
         * @param array $template_args  Template received arguments
         */
        do_action( 'gamipress_before_render_submission_form', $post_id, $user_id, $a ); ?>

        <?php if( $a['notes'] ) : ?>
            <p class="gamipress-submissions-notes-wrap" style="display:none;">
                <label for="gamipress-submissions-notes-<?php echo $post_id; ?>"><?php echo $a['notes_label']; ?></label>
                <textarea id="gamipress-submissions-notes-<?php echo $post_id; ?>" class="gamipress-submissions-notes" rows="5"></textarea>
            </p>
        <?php endif; ?>
        <button type="button" class="gamipress-submissions-button"><?php echo $a['button_text']; ?></button>
        <div class="gamipress-spinner" style="display: none;"></div>

        <?php
        /**
         * After render submission form
         *
         * @since 1.0.0
         *
         * @param int   $post_id        The achievement or rank ID
         * @param int   $user_id        The user ID
         * @param array $template_args  Template received arguments
         */
        do_action( 'gamipress_after_render_submission_form', $post_id, $user_id, $a ); ?>

    </div>

<?php endif; ?>
