const React = require('react'),
      ReactDOM = require('react-dom');

const LoginFormPopup = require('../../component/login/LoginFormPopup');

const loginFormPopupElements = document.querySelectorAll('.vk-login-form-popup');

if (loginFormPopupElements.length > 0) {
  for (const loginFormPopupElement of loginFormPopupElements) {
    const buttonText = loginFormPopupElement.getAttribute('data-buttontext'),
          buttonModifiers = loginFormPopupElement.getAttribute('data-buttonmodifiers') || false,
          action = loginFormPopupElement.getAttribute('data-action'),
          canRegister = (loginFormPopupElement.getAttribute('data-canregister') === '') || false;

    ReactDOM.render(
      <LoginFormPopup buttonText={buttonText}
                      buttonModifiers={buttonModifiers}
                      canRegister={canRegister}
                      action={action}
      />,
      loginFormPopupElement
    );
  }
}