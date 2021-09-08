const plugins = require('../utils/plugins');

plugins.createAccordion({
  triggerSelector: '.accordion-trigger-linked',
  contentSelector: '.accordion-content-linked',
  startOpenClass: 'accordion-open',
  selectedClass: 'selected',
  linkTriggers: true
});