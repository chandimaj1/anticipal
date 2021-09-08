const React = require('react'),
      ReactDOM = require('react-dom');

const GroupHeaderActions = require('../../component/profile/GroupHeaderActions');

const groupHeaderActionsElement = document.querySelector('#group-header-actions');

if (groupHeaderActionsElement) {
  const groupID = Number.parseInt(groupHeaderActionsElement.getAttribute('data-groupid'), 10) || false;

  ReactDOM.render(
    <GroupHeaderActions groupID={groupID} />,
    groupHeaderActionsElement
  );
}