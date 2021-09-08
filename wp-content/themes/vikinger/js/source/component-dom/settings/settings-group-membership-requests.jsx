const React = require('react'),
      ReactDOM = require('react-dom');

const GroupMembershipRequestsSettingsScreen = require('../../component/settings/GroupMembershipRequestsSettingsScreen');

const groupMembershipRequestsSettingsElement = document.querySelector('#group-membership-requests-settings-screen');

if (groupMembershipRequestsSettingsElement) {
  ReactDOM.render(
    <GroupMembershipRequestsSettingsScreen />,
    groupMembershipRequestsSettingsElement
  );
}