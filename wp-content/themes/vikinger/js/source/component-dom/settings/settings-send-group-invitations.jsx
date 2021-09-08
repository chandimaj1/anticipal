const React = require('react'),
      ReactDOM = require('react-dom');

const SendGroupInvitationsSettingsScreen = require('../../component/settings/SendGroupInvitationsSettingsScreen');

const sendGroupInvitationsSettingsElement = document.querySelector('#send-group-invitations-settings-screen');

if (sendGroupInvitationsSettingsElement) {
  ReactDOM.render(
    <SendGroupInvitationsSettingsScreen />,
    sendGroupInvitationsSettingsElement
  );
}