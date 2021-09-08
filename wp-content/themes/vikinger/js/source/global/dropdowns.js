const plugins = require('../utils/plugins');

/**
 * HEADER SETTINGS
 */
plugins.createDropdown({
  trigger: '.header-settings-dropdown-trigger',
  container: '.header-settings-dropdown',
  offset: {
    top: 64,
    right: 6
  },
  animation: {
    type: 'translate-top'
  }
});