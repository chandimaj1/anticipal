const React = require('react'),
      ReactDOM = require('react-dom');

const HeaderNotifications = require('../../component/header/HeaderNotifications');

const headerNotificationsElement = document.querySelector('#header-notifications');

if (headerNotificationsElement) {
  ReactDOM.render(
    <HeaderNotifications />,
    headerNotificationsElement
  );
}