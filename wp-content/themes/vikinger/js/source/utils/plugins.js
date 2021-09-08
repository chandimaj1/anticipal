const existsInDOM = function (selector) {
  return document.querySelectorAll(selector).length;
};

const plugins = {
  createTab: function (options) {
    if (existsInDOM(options.triggers) && existsInDOM(options.elements)) {
      return new XM_Tab(options);
    }
  },
  createHexagon: function (options) {
    if (existsInDOM(options.container) || (typeof options.containerElement !== 'undefined')) {
      return new XM_Hexagon(options);
    }
  },
  createProgressBar: function (options) {
    if (existsInDOM(options.container)) {
      return new XM_ProgressBar(options);
    }
  },
  createDropdown: function (options) {
    if (((existsInDOM(options.container) || typeof options.containerElement !== 'undefined') && options.controlToggle) || ((existsInDOM(options.trigger) || typeof options.triggerElement !== 'undefined') && (existsInDOM(options.container) || typeof options.containerElement !== 'undefined'))) {
      return new XM_Dropdown(options);
    }
  },
  createTooltip: function (options) {
    if (existsInDOM(options.container) || (typeof options.containerElement !== 'undefined')) {
      return new XM_Tooltip(options);
    }
  },
  createSlider: function (container, options) {
    if (container instanceof HTMLElement || existsInDOM(container)) {
      return new Swiper(container, options);
    }
  },
  createPopup: function (options) {
    if ((existsInDOM(options.trigger) || typeof options.triggerElement !== 'undefined') || (typeof options.premadeContentElement !== 'undefined')) {
      return new XM_Popup(options);
    }
  },
  createAccordion: function (options) {
    if (existsInDOM(options.triggerSelector) && existsInDOM(options.contentSelector)) {
      return new XM_Accordion(options);
    }
  },
  createFormInput: function (elements) {
    for (const el of elements) {
      if (el.classList.contains('always-active')) continue;
      
      const input = el.querySelector('input'),
            textarea = el.querySelector('textarea'),
            activeClass = 'active';
  
      let inputItem = undefined;
  
      if (input) inputItem = input;
      if (textarea) inputItem = textarea;
  
      if (inputItem) {
        // if input item has value or is already focused, activate it
        if ((inputItem.value !== '') || ((inputItem.getAttribute('data-pwd') !== null) && (inputItem.getAttribute('data-pwd') !== '')) || (inputItem === document.activeElement)) {
          el.classList.add(activeClass);
        }

        inputItem.addEventListener('focus', function () {
          el.classList.add(activeClass);
        });
  
        inputItem.addEventListener('blur', function () {
          if (inputItem.value === '') {
            el.classList.remove(activeClass);
          }
        });
      }
    }
  }
};

module.exports = plugins;