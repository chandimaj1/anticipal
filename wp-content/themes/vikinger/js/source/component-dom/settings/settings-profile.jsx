const React = require('react'),
      ReactDOM = require('react-dom');

const ProfileSettingsScreen = require('../../component/settings/ProfileSettingsScreen');

const profileSettingsElement = document.querySelector('#profile-settings-screen');

if (profileSettingsElement) {
  ReactDOM.render(
    <ProfileSettingsScreen />,
    profileSettingsElement
  );
}