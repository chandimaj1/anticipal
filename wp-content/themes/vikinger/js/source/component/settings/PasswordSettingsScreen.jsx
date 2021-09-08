const React = require('react');

const plugins = require('../../utils/plugins');

const WP_Router = require('../../router/WP_Router')();

const SectionHeader = require('../section/SectionHeader'),
      Loader = require('../loader/Loader'),
      LoaderSpinnerSmall = require('../loader/LoaderSpinnerSmall'),
      MessageBox = require('../message/MessageBox');

const FormInputPassword = require('../form/FormInputPassword');

class PasswordSettingsScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loggedUser: false,
      currentPassword: false,
      newPassword: false,
      newPasswordRepeat: false,
      saving: false,
      messageBoxTitle: '',
      messageBoxText: ''
    };

    this.messageBoxRef = React.createRef();

    this.setCurrentPassword = this.setCurrentPassword.bind(this);
    this.setNewPassword = this.setNewPassword.bind(this);
    this.setNewPasswordRepeat = this.setNewPasswordRepeat.bind(this);
    this.save = this.save.bind(this);
  }

  getLoggedInMember() {
    WP_Router.getLoggedInMember('user-settings-password')
    .done((response) => {
      // console.log('PASSWORD SETTINGS SCREEN - LOGGED IN USER: ', response);

      this.setState({
        loggedUser: response
      });
    });
  }

  setCurrentPassword(data) {
    this.setState({
      currentPassword: data
    });
  }

  setNewPassword(data) {
    this.setState({
      newPassword: data
    });
  }

  setNewPasswordRepeat(data) {
    this.setState({
      newPasswordRepeat: data
    });
  }

  save() {
    // return if already saving
    if (this.state.saving) {
      return;
    }

    const currentPasswordEntered = this.state.currentPassword,
          newPasswordEntered = this.state.newPassword,
          newPasswordRepeatEntered = this.state.newPasswordRepeat;

    // only process data if all fields where entered
    if (currentPasswordEntered && newPasswordEntered && newPasswordRepeatEntered) {
      // if new password doesn't match confirmation, show error popup
      if (newPasswordEntered !== newPasswordRepeatEntered) {
        this.setState({
          messageBoxTitle: vikinger_translation.new_password_mismatch_error_title,
          messageBoxText: vikinger_translation.new_password_mismatch_error_text
        }, () => {
          this.popup.show();
        });

        return;
      }

      // check if current password is correct
      const passwordCheckPromise = WP_Router.checkPassword({
        password_plain: this.state.currentPassword,
        password_hash: this.state.loggedUser.password,
        user_id: this.state.loggedUser.id
      });

      this.setState({
        saving: true
      });

      passwordCheckPromise.then((passwordMatches) => {
        // console.log('PASSWORD SETTINGS SCREEN - CHECK PASSWORD RESPONSE: ', passwordMatches);
        
        if (passwordMatches) {
          // console.log('PASSWORD SETTINGS SCREEN - ENTERED PASSWORD MATCHES CURRENT PASSWORD');

          // update password
          const updatePasswordPromise = WP_Router.updatePassword({
            password: this.state.newPassword,
            user_id: this.state.loggedUser.id
          });

          updatePasswordPromise.then((response) => {
            // console.log('PASSWORD SETTINGS SCREEN - UPDATE PASSWORD RESPONSE: ', response);

            // if password updated
            if (response) {
              // console.log('PASSWORD SETTINGS SCREEN - PASSWORD UPDATED CORRECTLY');

              window.location = window.location;
            } else {
              // password couldn't be updated
              this.setState({
                messageBoxTitle: vikinger_translation.change_password_error_title,
                messageBoxText: vikinger_translation.change_password_error_text,
                saving: false
              }, () => {
                this.popup.show();
              });
            }
          }, (error) => {
            // password couldn't be updated
            this.setState({
              messageBoxTitle: vikinger_translation.change_password_error_title,
              messageBoxText: vikinger_translation.change_password_error_text,
              saving: false
            }, () => {
              this.popup.show();
            });
          });
        } else {
          // password doesn't match, show error popup
          this.setState({
            messageBoxTitle: vikinger_translation.current_password_mismatch_error_title,
            messageBoxText: vikinger_translation.current_password_mismatch_error_text,
            saving: false
          }, () => {
            this.popup.show();
          });
        }
      }, (error) => {
        // console.log('PASSWORD SETTINGS SCREEN - CHECK PASSWORD ERROR: ', error);
      });
    }
  }

  componentDidMount() {
    this.getLoggedInMember();

    this.popup = plugins.createPopup({
      premadeContentElement: this.messageBoxRef.current,
      type: 'premade',
      popupSelectors: ['message-box-popup', 'animate-slide-down'],
      onOverlayCreate: function (overlay) {
        overlay.setAttribute('data-simplebar', '');
      }
    });
  }

  render() {
    return (
      <div className="account-hub-content">
        <SectionHeader pretitle={vikinger_translation.account} title={vikinger_translation.change_password} />

        {/* MESSAGE BOX */}
        <MessageBox ref={this.messageBoxRef}
                    data={{title: this.state.messageBoxTitle, text: this.state.messageBoxText}}
                    error
        />
        {/* MESSAGE BOX */}

        {
          this.state.loggedUser &&
            <div className="grid-column">
              {/* WIDGET BOX */}
              <div className="widget-box">
                {/* WIDGET BOX CONTENT */}
                <div className="widget-box-content">
                  {/* FORM */}
                  <div className="form">
                    {/* FORM ROW */}
                    <div className="form-row">
                      {/* FORM ITEM */}
                      <div className="form-item">
                        <FormInputPassword  label={vikinger_translation.enter_your_current_password}
                                            name="current_password"
                                            modifiers="small"
                                            onChange={this.setCurrentPassword}
                        />
                      </div>
                      {/* FORM ITEM */}
                    </div>
                    {/* FORM ROW */}

                    {/* FORM ROW */}
                    <div className="form-row split">
                      {/* FORM ITEM */}
                      <div className="form-item">
                        <FormInputPassword  label={vikinger_translation.your_new_password}
                                            name="new_password"
                                            modifiers="small"
                                            onChange={this.setNewPassword}
                        />
                      </div>
                      {/* FORM ITEM */}

                      {/* FORM ITEM */}
                      <div className="form-item">
                        <FormInputPassword  label={vikinger_translation.confirm_new_password}
                                            name="new_password_repeat"
                                            modifiers="small"
                                            onChange={this.setNewPasswordRepeat}
                        />
                      </div>
                      {/* FORM ITEM */}
                    </div>
                    {/* FORM ROW */}
                  </div>
                  {/* FORM */}
                </div>
                {/* WIDGET BOX CONTENT */}
              </div>
              {/* WIDGET BOX */}

              {/* ACCOUNT HUB CONTENT OPTIONS */}
              <div className="account-hub-content-options">
                <div className="button primary" onClick={this.save}>
                  {
                    !this.state.saving &&
                      vikinger_translation.save_changes
                  }
                  {
                    this.state.saving &&
                      <React.Fragment>
                        {vikinger_translation.saving}
                        <LoaderSpinnerSmall />
                      </React.Fragment>
                  }
                </div>
              </div>
              {/* ACCOUNT HUB CONTENT OPTIONS */}
            </div>
        }

        {
          !this.state.loggedUser &&
            <Loader />
        }
      </div>
    );
  }
}

module.exports = PasswordSettingsScreen;