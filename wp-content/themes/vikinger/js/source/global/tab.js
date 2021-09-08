const plugins = require('../utils/plugins');

/**
 * TAB
 * 
 * Used: Open Post Widgets
 */
plugins.createTab({
  container: '.tab-container',
  triggers: '.tab-option',
  elements: '.tab-item'
});