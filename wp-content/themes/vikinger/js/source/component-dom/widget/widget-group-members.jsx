const React = require('react'),
      ReactDOM = require('react-dom');

const WidgetGroupMembers = require('../../component/widget/WidgetGroupMembers');

const groupMembersWidgetElement = document.querySelector('#group-members-widget');

if (groupMembersWidgetElement) {
  const groupID = Number.parseInt(groupMembersWidgetElement.getAttribute('data-groupid'), 10) || false;

  ReactDOM.render(
    <WidgetGroupMembers groupID={groupID} />,
    groupMembersWidgetElement
  );
}