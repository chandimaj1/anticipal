const React = require('react'),
      ReactDOM = require('react-dom');

const MessagesSettingsScreen = require('../../component/settings/MessagesSettingsScreen');

const messagesSettingsElement = document.querySelector('#messages-settings-screen');

if (messagesSettingsElement) {
  const userID = Number.parseInt(messagesSettingsElement.getAttribute('data-userid'), 10) || false,
        messageID = Number.parseInt(messagesSettingsElement.getAttribute('data-messageid'), 10) || false;

  ReactDOM.render(
    <MessagesSettingsScreen userID={userID} messageID={messageID} />,
    messagesSettingsElement
  );
}