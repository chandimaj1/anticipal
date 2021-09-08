const React = require('react'),
      ReactDOM = require('react-dom');

const WidgetGroups = require('../../component/widget/WidgetGroups');

const groupsWidgetElement = document.querySelector('#groups-widget');

if (groupsWidgetElement) {
  const userID = Number.parseInt(groupsWidgetElement.getAttribute('data-userid'), 10) || false;

  ReactDOM.render(
    <WidgetGroups userID={userID} />,
    groupsWidgetElement
  );
}