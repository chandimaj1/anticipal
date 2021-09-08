const React = require('react'),
      ReactDOM = require('react-dom');

const WidgetFriends = require('../../component/widget/WidgetFriends');

const friendsWidgetElement = document.querySelector('#friends-widget');

if (friendsWidgetElement) {
  const userID = Number.parseInt(friendsWidgetElement.getAttribute('data-userid'), 10) || false;

  ReactDOM.render(
    <WidgetFriends userID={userID} />,
    friendsWidgetElement
  );
}