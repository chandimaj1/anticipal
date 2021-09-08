const React = require('react'),
      ReactDOM = require('react-dom');

const SocialSettingsScreen = require('../../component/settings/SocialSettingsScreen');

const socialSettingsElement = document.querySelector('#social-settings-screen');

if (socialSettingsElement) {
  ReactDOM.render(
    <SocialSettingsScreen />,
    socialSettingsElement
  );
}