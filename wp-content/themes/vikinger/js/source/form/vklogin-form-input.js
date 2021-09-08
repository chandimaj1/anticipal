const app = require('../utils/core'),
      plugins = require('../utils/plugins');

app.querySelector('#login form p, #login form div', plugins.createFormInput);