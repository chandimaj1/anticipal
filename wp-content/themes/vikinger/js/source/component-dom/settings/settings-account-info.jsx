const React = require('react'),
      ReactDOM = require('react-dom');

const AccountInfoSettingsScreen = require('../../component/settings/AccountInfoSettingsScreen');

const accountInfoSettingsElement = document.querySelector('#account-info-settings-screen');

if (accountInfoSettingsElement) {
  ReactDOM.render(
    <AccountInfoSettingsScreen />,
    accountInfoSettingsElement
  );
}