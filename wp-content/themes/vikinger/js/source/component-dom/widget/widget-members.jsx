const React = require('react'),
      ReactDOM = require('react-dom');

const WidgetMembers = require('../../component/widget/WidgetMembers');

const membersWidgetElement = document.querySelector('#members-widget');

if (membersWidgetElement) {
  ReactDOM.render(
    <WidgetMembers />,
    membersWidgetElement
  );
}