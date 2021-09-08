const React = require('react'),
      ReactDOM = require('react-dom');

const PasswordSettingsScreen = require('../../component/settings/PasswordSettingsScreen');

const passwordSettingsElement = document.querySelector('#password-settings-screen');

if (passwordSettingsElement) {
  ReactDOM.render(
    <PasswordSettingsScreen />,
    passwordSettingsElement
  );
}