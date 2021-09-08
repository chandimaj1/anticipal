<?php
/* Configuration file for PressPermit Page Template Limiter
 * (Temporary implementation prior to settings UI development)
 *
 * Copy the contents of this file into your active theme's functions.php file and edit as desired.
 *
 */

// NOTE: Move the following constant definition to wp-config.php
if (!defined('PRESSPERMIT_ENABLE_PAGE_TEMPLATE_LIMITER')) {
	define('PRESSPERMIT_ENABLE_PAGE_TEMPLATE_LIMITER', true);
}

add_filter('presspermit_page_template_restrictions', 'my_page_template_restrictions');

function my_page_template_restrictions($cfg) {
	// To customize your configuration, uncomment or add elements in the arrays below.
	
	/* Roles which should be exempted from all page template restrictions 
     *
	 * (administrator is exempted by default) 
	 */
	$cfg['exempt_roles'] = [
		'administrator' => true, 
		//'editor' => true,
	];


	/*  Templates with restricted access
	 *
	 *  "Default Template" will always appear in Page Edit form when any other template is selectable
	 *  However, if unqualified user attempts to change a saved page to "Default Template", the setting will be reverted back
	 *
	 *  Note: only entries set to true will be limited.
	 */
	$cfg['restricted_templates'] = [ 
		//'default' => true,
		//'links.php' => true, 
		//'archives.php' => true,
		//'filename1.php' => true,
	];
	

	/* Template file prefixes to apply limited access for
	 *
	 * Setting 'yourpfx_' => true causes yourpfx_links.php, yourpfx_archives.php, yourpfx_*.php, etc. to be access-limited
	 *
	 */
	$cfg['restricted_prefixes'] = [
		//'special_' => true,
		//'custom_' => true
	];
	

	/* Allow specific page templates per WP role
	 */
	$cfg['allow_by_role'] = [
		//'editor' => ['default', 'filename1.php', 'snarfer.php', 'archives.php', 'links.php'],
		//'author' => ['default', 'filename1.php', 'snarfer.php'],
		//'contributor' => ['filename1.php', 'snarfer.php'],
		//'subscriber' => ['snarfer.php']
	];
	

	/* Allow specific template file prefixes per WP role
     */
	$cfg['allow_prefix_by_role'] = [
		//'editor' => ['special_', 'custom_'],
		//'author' => ['special_'],
		//'contributor' => [],
		//'subscriber' => []
	];
	

	/* Allow only specific templates per PressPermit group
	 *
	 * Set array key value to ID of desired group as indicated by the id argument 
	 * when selecting a group for editing from Permissions > Groups
     */
	$cfg['allow_by_group'] = [
		//7 => ['filename3.php', 'filename4.php'],
		//9 => ['filename3.php', 'filename5.php']
	];
	

	/* Allow specific template file prefixes per PressPermit group
	 *
	 * Set array key value to ID of desired group as indicated by the id argument 
	 * when selecting a group for editing from Permissions > Groups
	 */
	$cfg['allow_prefix_by_group'] = [
		//7 => ['special_', 'custom_'],
		//9 => ['custom_']
	];
	
	return $cfg;
}