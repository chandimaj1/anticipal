const React = require('react'),
      ReactDOM = require('react-dom');

const FriendRequestsSettingsScreen = require('../../component/settings/FriendRequestsSettingsScreen');

const friendRequestsSettingsElement = document.querySelector('#friend-requests-settings-screen');

if (friendRequestsSettingsElement) {
  ReactDOM.render(
    <FriendRequestsSettingsScreen />,
    friendRequestsSettingsElement
  );
}