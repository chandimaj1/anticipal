const React = require('react'),
      ReactDOM = require('react-dom');

const ManageGroupsSettingsScreen = require('../../component/settings/ManageGroupsSettingsScreen');

const manageGroupsSettingsElement = document.querySelector('#manage-groups-settings-screen');

if (manageGroupsSettingsElement) {
  ReactDOM.render(
    <ManageGroupsSettingsScreen />,
    manageGroupsSettingsElement
  );
}