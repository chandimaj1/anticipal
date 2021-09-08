const React = require('react');

const plugins = require('../../utils/plugins');

const LoginForm = require('./LoginForm');

class LoginFormPopup extends React.Component {
  constructor(props) {
    super(props);

    this.loginFormPopupTriggerRef = React.createRef();
    this.loginFormPopupRef = React.createRef();
  }

  componentDidMount() {
    this.popup = plugins.createPopup({
      triggerElement: this.loginFormPopupTriggerRef.current,
      premadeContentElement: this.loginFormPopupRef.current,
      type: 'premade',
      popupSelectors: ['form-popup', 'animate-slide-down']
    });
  }

  render() {
    return (
      <React.Fragment>
        <p ref={this.loginFormPopupTriggerRef} className={`button ${this.props.buttonModifiers || ''}`}>{this.props.buttonText}</p>

        <div ref={this.loginFormPopupRef} className="popup-form-box">
          <LoginForm action={this.props.action} canRegister={this.props.canRegister} />
        </div>
      </React.Fragment>
    )
  }
}

module.exports = LoginFormPopup;