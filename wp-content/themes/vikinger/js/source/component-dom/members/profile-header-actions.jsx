const React = require('react'),
      ReactDOM = require('react-dom');

const ProfileHeaderActions = require('../../component/profile/ProfileHeaderActions');

const profileHeaderActionsElement = document.querySelector('#profile-header-actions');

if (profileHeaderActionsElement) {
  const userID = Number.parseInt(profileHeaderActionsElement.getAttribute('data-userid'), 10) || false;

  ReactDOM.render(
    <ProfileHeaderActions userID={userID} />,
    profileHeaderActionsElement
  );
}