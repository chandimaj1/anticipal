const React = require('react'),
      ReactDOM = require('react-dom');

const NotificationsSettingsScreen = require('../../component/settings/NotificationsSettingsScreen');

const notificationsSettingsElement = document.querySelector('#notifications-settings-screen');

if (notificationsSettingsElement) {
  ReactDOM.render(
    <NotificationsSettingsScreen />,
    notificationsSettingsElement
  );
}