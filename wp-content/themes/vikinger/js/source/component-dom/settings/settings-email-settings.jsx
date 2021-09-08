const React = require('react'),
      ReactDOM = require('react-dom');

const EmailSettingsScreen = require('../../component/settings/EmailSettingsScreen');

const emailSettingsElement = document.querySelector('#email-settings-screen');

if (emailSettingsElement) {
  ReactDOM.render(
    <EmailSettingsScreen />,
    emailSettingsElement
  );
}