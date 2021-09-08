<?php
$banner_1x = forminator_plugin_url() . 'assets/images/graphic-bulk-mode.png';
$banner_2x = forminator_plugin_url() . 'assets/images/graphic-bulk-mode@2x.png';
?>

<div
	id="forminator-new-feature"
	class="sui-dialog sui-dialog-onboard"
	aria-hidden="true"
>

	<div class="sui-dialog-overlay sui-fade-out" data-a11y-dialog-hide="forminator-new-feature" aria-hidden="true"></div>

	<div
		class="sui-dialog-content sui-fade-out"
		role="dialog"
	>

		<div class="sui-slider forminator-feature-modal" data-prop="forminator_dismiss_feature_11412" data-nonce="<?php echo esc_attr( wp_create_nonce( 'forminator_dismiss_notification' ) ); ?>">

			<ul role="document" class="sui-slider-content">

				<li class="sui-current sui-loaded" data-slide="1">

					<div class="sui-box">

						<div class="sui-box-banner" role="banner" aria-hidden="true">
							<img
								src="<?php echo esc_url( $banner_1x ); ?>"
								srcset="<?php echo esc_url( $banner_1x ); ?> 1x, <?php echo esc_url( $banner_2x ); ?> 2x"
								class="sui-image"
								alt="Forminator"
							/>
						</div>

						<div class="sui-box-header sui-block-content-center">

							<button data-a11y-dialog-hide="forminator-new-feature" class="sui-dialog-close forminator-dismiss-new-feature" aria-label="<?php esc_html_e( 'Close this dialog window', 'forminator' ); ?>"></button>

							<?php //if ( FORMINATOR_PRO ) { ?>

								<h2 class="sui-box-title"><?php esc_html_e( 'New! Bulk Edit, Quiz Pagination, and More', 'forminator' ); ?></h2>

								<p class="sui-description"><?php printf( esc_html__( 'Ever get tired of adding Select/Checkbox options one at a time? Good news! We\'ve added Bulk Edit and CSV Upload options to Radio, Checkbox and Select fields. Simply switch to Bulk Edit mode and choose from the predefined options, or import your own from a %1$s.csv%2$s file.', 'forminator' ), '<strong>', '</strong>' ); ?></p>

							<?php //} else { ?>

						 	<?php //} ?>

						</div>

							<div class="sui-box-body" sui-spacing-bottom="0">

								<ul class="sui-list" sui-type="bullets">

									<li>
										<p class="sui-description"><strong sui-color="darkgray"><?php esc_html_e( 'Image support in Checkbox and Radio fields', 'forminator' ); ?></strong></p>
										<p class="sui-description"><?php esc_html_e( 'Checkbox and Radio button fields now support images. So you can now use a combination of label + image or image only as checkbox / radio options.', 'forminator' ); ?></p>
									</li>

									<li>
										<p class="sui-description"><strong sui-color="darkgray"><?php esc_html_e( 'Pagination support in quizzes', 'forminator' ); ?></strong></p>
										<p class="sui-description"><?php esc_html_e( 'We\'ve also added support for pagination in knowledge quizzes. This option enables you to show quiz questions one at a time, or all the questions at once.', 'forminator' ); ?></p>
									</li>

									<li>
										<p class="sui-description"><strong sui-color="darkgray"><?php esc_html_e( 'Set reCAPTCHA badge position', 'forminator' ); ?></strong></p>
										<p class="sui-description"><?php esc_html_e( 'You now have more control over where the reCAPTCHA V3 badge should be positioned on your form pages.', 'forminator' ); ?></p>
									</li>

								</ul>

							</div>

							<div class="sui-box-footer sui-block-content-center">

								<button class="sui-button forminator-dismiss-new-feature" type="button" data-a11y-dialog-hide="forminator-new-feature"><?php esc_html_e( 'Got It', 'forminator' ); ?></button>

							</div>

					</div>

				</li>

			</ul>

		</div>

	</div>

</div>

<script type="text/javascript">
	jQuery( '#forminator-new-feature .forminator-dismiss-new-feature' ).on( 'click', function( e ) {
		e.preventDefault();

		var $notice = jQuery( e.currentTarget ).closest( '.forminator-feature-modal' );
		var ajaxUrl = '<?php echo forminator_ajax_url();// phpcs:ignore ?>';

		jQuery.post(
			ajaxUrl,
			{
				action: 'forminator_dismiss_notification',
				prop: $notice.data('prop'),
				_ajax_nonce: $notice.data('nonce')
			}
		).always( function() {
			$notice.hide();
		});
	});
</script>
