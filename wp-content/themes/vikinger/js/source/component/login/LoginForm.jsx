const React = require('react');

const FormInput = require('../form/FormInput'),
      FormInputPassword = require('../form/FormInputPassword'),
      FormInputCheckbox = require('../form/FormInputCheckbox'),
      LoaderSpinnerSmall = require('../loader/LoaderSpinnerSmall');

const Logger = require('../../form/Logger')();

class LoginForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeTab: !props.canRegister ? 'login' : props.action,
      login_username: '',
      login_password: '',
      login_remember: true,
      login_form_username_empty_error: false,
      login_form_password_empty_error: false,
      login_form_submit_error: false,
      processing_login: false,
      register_email: '',
      register_username: '',
      register_password: '',
      register_password_repeat: '',
      register_form_email_empty_error: false,
      register_form_username_empty_error: false,
      register_form_password_empty_error: false,
      register_form_password_repeat_empty_error: false,
      register_form_email_invalid_error: false,
      register_form_username_exists_error: false,
      register_form_password_mismatch_error: false,
      processing_register: false,
      registration_complete: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.rememberMeToggle = this.rememberMeToggle.bind(this);

    this.login = this.login.bind(this);
    this.register = this.register.bind(this);

    // console.log('LOGIN FORM - ACTION: ', props.action);
    // console.log('LOGIN FORM - CAN REGISTER: ', props.canRegister);
  }

  setActiveTab(tab) {
    this.setState({
      activeTab: tab
    });
  }

  rememberMeToggle() {
    this.setState((state) => {
      return {
        login_remember: !state.login_remember
      };
    });
  }

  handleChange(e) {
    // console.log('LOGIN FORM - HANDLE CHANGE: ', e.target.name, e.target.value);

    this.setState({
      [e.target.name]: e.target.value
    }, () => {
      // console.log('LOGIN FORM - STATE: ', this.state);
    });
  }

  discardRegisterForm() {
    this.setState({
      register_email: '',
      register_username: '',
      register_password: '',
      register_password_repeat: ''
    });
  }

  register(e) {
    e.preventDefault();

    // return if processing register
    if (this.state.processing_register) {
      return;
    }

    this.setState({
      register_form_email_empty_error: false,
      register_form_username_empty_error: false,
      register_form_password_empty_error: false,
      register_form_password_repeat_empty_error: false,
      register_form_email_invalid_error: false,
      register_form_username_exists_error: false,
      register_form_password_mismatch_error: false,
      registration_complete: false
    });

    const emptyEmail = this.state.register_email === '',
          emptyUsername = this.state.register_username === '',
          emptyPassword = this.state.register_password === '',
          emptyPasswordRepeat = this.state.register_password_repeat === '',
          emptyValues = emptyEmail || emptyUsername || emptyPassword || emptyPasswordRepeat,
          passwordMismatch = this.state.register_password !== this.state.register_password_repeat;

    // return if there are empty values
    if (emptyValues) {
      if (emptyEmail) {
        this.setState({
          register_form_email_empty_error: true
        });
      }

      if (emptyUsername) {
        this.setState({
          register_form_username_empty_error: true
        });
      }

      if (emptyPassword) {
        this.setState({
          register_form_password_empty_error: true
        });
      }

      if (emptyPasswordRepeat) {
        this.setState({
          register_form_password_repeat_empty_error: true
        });
      }

      return;
    }

    // return if passwords don't match
    if (passwordMismatch) {
      this.setState({
        register_form_password_mismatch_error: true
      });

      return;
    }

    this.setState({
      processing_register: true
    });

    const registerPromise = Logger.register({
      username: this.state.register_username,
      password: this.state.register_password,
      email: this.state.register_email
    });

    registerPromise
    .done((response) => {
      // console.log('LOGIN FORM - REGISTER RESPONSE: ', response);

      if (typeof response.errors !== 'undefined') {
        // if email is invalid
        if (typeof response.errors.invalid_email !== 'undefined')  {
          this.setState({
            register_form_email_invalid_error: true,
            processing_register: false
          });
        } else if (typeof response.errors.existing_user_login !== 'undefined') {
        // if username already exists
          this.setState({
            register_form_username_exists_error: true,
            processing_register: false
          });
        }
      } else {
        this.setState({
          processing_register: false,
          registration_complete: true
        });

        this.discardRegisterForm();
      }
    })
    .fail((error) => {
      // console.log('LOGIN FORM - REGISTER ERROR: ', error);

      this.setState({
        processing_register: false
      });
    });
  }

  login(e) {
    e.preventDefault();

    // return if already processing login
    if (this.state.processing_login) {
      return;
    }

    this.setState({
      login_form_submit_error: false,
      login_form_username_empty_error: false,
      login_form_password_empty_error: false
    });

    const emptyUsername = this.state.login_username === '',
          emptyPassword = this.state.login_password === '',
          emptyValues = emptyUsername || emptyPassword;

    // return if there are empty fields
    if (emptyValues) {
      if (emptyUsername) {
        this.setState({
          login_form_username_empty_error: true
        });
      }

      if (emptyPassword) {
        this.setState({
          login_form_password_empty_error: true
        });
      }

      return;
    }

    this.setState({
      processing_login: true
    });

    const loginPromise = Logger.login({
      username: this.state.login_username,
      password: this.state.login_password,
      remember: this.state.login_remember
    });

    loginPromise
    .done((response) => {
      // console.log('LOGIN FORM - LOGIN RESPONSE: ', response);

      if (typeof response.result.errors === 'undefined') {
        window.location.replace(response.redirect_uri);
      } else {
        this.setState({
          login_form_submit_error: true,
          processing_login: false
        });
      }
    })
    .fail((error) => {
      // console.log('LOGIN FORM - LOGIN ERROR: ', error);

      this.setState({
        processing_login: false
      });
    });
  }

  render() {
    return (
      <div className={`form-box ${this.props.canRegister ? 'no-padding' : ''}`}>
      {
        this.props.canRegister &&
          <div className="form-box-tabs">
            {/* FORM BOX TAB */}
            <p className={`form-box-tab ${this.state.activeTab === 'login' ? 'active' : ''}`} onClick={() => {this.setActiveTab('login');}}>{vikinger_translation.login}</p>
            {/* FORM BOX TAB */}

            {/* FORM BOX TAB */}
            <p className={`form-box-tab ${this.state.activeTab === 'register' ? 'active' : ''}`} onClick={() => {this.setActiveTab('register');}}>{vikinger_translation.register}</p>
            {/* FORM BOX TAB */}
          </div>
      }
      {
        (this.state.activeTab === 'login') &&
          <div className="form-box-content">
            <h2 className="form-box-title">{vikinger_translation.account_login}</h2>

            <form className="form" onSubmit={this.login}>
              <div className="form-row">
                <div className="form-item">
                  <FormInput  label={vikinger_translation.username_or_email}
                              name="login_username"
                              value={this.state.login_username}
                              handleValue
                              onChange={this.handleChange}
                              error={this.state.login_form_username_empty_error || this.state.login_form_submit_error}
                              disabled={this.state.processing_login}
                              autoFocus
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-item">
                  <FormInputPassword  label={vikinger_translation.password}
                                      name="login_password"
                                      value={this.state.login_password}
                                      handleValue
                                      onChange={this.handleChange}
                                      error={this.state.login_form_password_empty_error || this.state.login_form_submit_error}
                                      disabled={this.state.processing_login}
                  />
                </div>
              </div>
        
              <div className="form-row">
                <div className="form-item">
                  <FormInputCheckbox  text={vikinger_translation.remember_me}
                                      active={this.state.login_remember}
                                      toggleActive={this.rememberMeToggle}
                  />
                </div>
              </div>
        
              <div className="form-row">
                <div className="form-item">
                  {
                    this.state.login_form_submit_error &&
                      <p className="error-field-message">* {vikinger_translation.wrong_user_message}</p>
                  }

                  <button className="button medium secondary">
                  {
                    !this.state.processing_login &&
                      vikinger_translation.login_to_your_account
                  }
                  {
                    this.state.processing_login &&
                      <React.Fragment>
                        {vikinger_translation.authenticating}
                        <LoaderSpinnerSmall />
                      </React.Fragment>
                  }
                  </button>
                </div>
              </div>
            </form>
          </div>
      }
      {
        (this.state.activeTab === 'register') &&
          <div className="form-box-content">
            <h2 className="form-box-title">{vikinger_translation.create_your_account}</h2>

            <form className="form" onSubmit={this.register}>
              <div className="form-row">
                <div className="form-item">
                  <FormInput  label={vikinger_translation.your_email}
                              name="register_email"
                              value={this.state.register_email}
                              handleValue
                              onChange={this.handleChange}
                              error={this.state.register_form_email_empty_error || this.state.register_form_email_invalid_error}
                              disabled={this.state.processing_register}
                              autoFocus
                  />
                </div>
              </div>
        
              <div className="form-row">
                <div className="form-item">
                  <FormInput  label={vikinger_translation.username}
                              name="register_username"
                              value={this.state.register_username}
                              handleValue
                              onChange={this.handleChange}
                              error={this.state.register_form_username_empty_error || this.state.register_form_username_exists_error}
                              disabled={this.state.processing_register}
                  />
                </div>
              </div>
        
              <div className="form-row">
                <div className="form-item">
                  <FormInputPassword  label={vikinger_translation.password}
                                      name="register_password"
                                      value={this.state.register_password}
                                      handleValue
                                      onChange={this.handleChange}
                                      error={this.state.register_form_password_empty_error || this.state.register_form_password_mismatch_error}
                                      disabled={this.state.processing_register}
                  />
                </div>
              </div>
        
              <div className="form-row">
                <div className="form-item">
                  <FormInputPassword  label={vikinger_translation.repeat_password}
                                      name="register_password_repeat"
                                      value={this.state.register_password_repeat}
                                      handleValue
                                      onChange={this.handleChange}
                                      error={this.state.register_form_password_empty_error || this.state.register_form_password_mismatch_error}
                                      disabled={this.state.processing_register}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-item">
                  {
                    this.state.register_form_email_invalid_error &&
                      <p className="error-field-message">* {vikinger_translation.invalid_email_message}</p>
                  }
                  {
                    this.state.register_form_password_mismatch_error &&
                      <p className="error-field-message">* {vikinger_translation.password_mismatch_message}</p>
                  }
                  {
                    this.state.register_form_username_exists_error &&
                      <p className="error-field-message">* {vikinger_translation.username_exists_message}</p>
                  }
                  <button className={`button medium ${this.state.registration_complete ? 'secondary' : 'primary'}`}>
                  {
                    !this.state.registration_complete &&
                      <React.Fragment>
                      {
                        !this.state.processing_register &&
                          vikinger_translation.register_now
                      }
                      {
                        this.state.processing_register &&
                          <React.Fragment>
                            {vikinger_translation.registering}
                            <LoaderSpinnerSmall />
                          </React.Fragment>
                      }
                      </React.Fragment>
                  }
                  {
                    this.state.registration_complete &&
                      vikinger_translation.registration_complete
                  }
                  </button>
                </div>
              </div>
            </form>
          </div>
      }
      </div>
    )
  }
}

module.exports = LoginForm;