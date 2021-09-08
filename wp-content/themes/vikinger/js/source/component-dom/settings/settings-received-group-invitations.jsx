const React = require('react'),
      ReactDOM = require('react-dom');

const ReceivedGroupInvitationsSettingsScreen = require('../../component/settings/ReceivedGroupInvitationsSettingsScreen');

const receivedGroupInvitationsSettingsElement = document.querySelector('#received-group-invitations-settings-screen');

if (receivedGroupInvitationsSettingsElement) {
  ReactDOM.render(
    <ReceivedGroupInvitationsSettingsScreen />,
    receivedGroupInvitationsSettingsElement
  );
}