const React = require('react');

const app = require('../../utils/core');

const WP_Router = require('../../router/WP_Router')();

const SectionHeader = require('../section/SectionHeader');

const Loader = require('../loader/Loader'),
      LoaderSpinnerSmall = require('../loader/LoaderSpinnerSmall');

class EmailSettingsScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loggedUser: false,
      settings: [],
      savingSettings: false
    };

    this.currentPage = 1;

    this.emailSettings = [
      {
        name: vikinger_translation.activity,
        options: [
          {
            id: 'notification_activity_new_mention',
            name: vikinger_translation.mentions,
            description: vikinger_translation.email_settings_mentions_description
          },
          {
            id: 'notification_activity_new_reply',
            name: vikinger_translation.replies,
            description: vikinger_translation.email_settings_replies_description
          }
        ]
      },
      {
        name: vikinger_translation.messages,
        options: [
          {
            id: 'notification_messages_new_message',
            name: vikinger_translation.new_message,
            description: vikinger_translation.email_settings_newmessage_description
          }
        ]
      },
      {
        name: vikinger_translation.friends,
        options: [
          {
            id: 'notification_friends_friendship_request',
            name: vikinger_translation.new_friend_request,
            description: vikinger_translation.email_settings_newfriendrequest_description
          },
          {
            id: 'notification_friends_friendship_accepted',
            name: vikinger_translation.friend_request_accepted,
            description: vikinger_translation.email_settings_friendrequestaccepted_description
          }
        ]
      },
      {
        name: vikinger_translation.groups,
        options: [
          {
            id: 'notification_groups_invite',
            name: vikinger_translation.group_invite,
            description: vikinger_translation.email_settings_groupinvite_description
          },
          {
            id: 'notification_groups_group_updated',
            name: vikinger_translation.group_update,
            description: vikinger_translation.email_settings_groupupdate_description
          },
          {
            id: 'notification_groups_admin_promotion',
            name: vikinger_translation.group_promotion,
            description: vikinger_translation.email_settings_grouppromotion_description
          },
          {
            id: 'notification_groups_membership_request',
            name: vikinger_translation.private_group_membership_request,
            description: vikinger_translation.email_settings_privategroupmembershiprequest_description
          },
          {
            id: 'notification_membership_request_completed',
            name: vikinger_translation.group_join_request_status,
            description: vikinger_translation.email_settings_groupjoinrequeststatus_description
          }
        ]
      }
    ];

    this.saveSettings = this.saveSettings.bind(this);
  }

  getLoggedInMember() {
    WP_Router.getLoggedInMember('user-settings-notification')
    .done((response) => {
      // console.log('EMAIL SETTINGS SCREEN - LOGGED IN USER: ', response);

      this.setState({
        loggedUser: response,
        settings: app.deepMerge(response.email_settings)
      });
    });
  }

  toggleSetting(settingID) {
    this.setState((state, props) => {
      const newSettings = app.deepMerge(state.settings);

      newSettings[settingID] = newSettings[settingID] === 'yes' ? 'no' : 'yes';

      return {
        settings: newSettings
      };
    }, () => {
      // console.log('NOTIFICATIONS SETTINGS SCREEN - EMAIL SETTINGS: ', this.state.settings);
    });
  }

  saveSettings() {
    // return if already saving
    if (this.state.savingSettings) {
      return;
    }

    this.setState({
      savingSettings: true
    });

    const saveSettingsPromise = WP_Router.updateUserMetadata({
      user_id: this.state.loggedUser.id,
      metadata: this.state.settings
    });

    saveSettingsPromise
    .done((response) => {
      // refresh page
      window.location = window.location;
    })
    .fail((error) => {
      this.setState({
        savingSettings: false
      });
    });
  }

  componentDidMount() {
    this.getLoggedInMember();
  }

  render() {
    return (
      <div className="account-hub-content">
        <SectionHeader  pretitle={vikinger_translation.my_profile} title={vikinger_translation.email_settings} />

        {
          !this.state.loggedUser &&
            <Loader />
        }

        {
          this.state.loggedUser &&
            <React.Fragment>
              <div className="grid-column">
              {
                this.emailSettings.map((section) => {
                  return (
                    <div key={section.name} className="widget-box">
                      <p className="widget-box-title">{section.name}</p>

                      {/* WIDGET BOX CONTENT */}
                      <div className="widget-box-content">
                        {/* SWITCH OPTION LIST */}
                        <div className="switch-option-list">
                        {
                          section.options.map((option) => {
                            return (
                              <div key={option.id} className="switch-option">
                                <p className="switch-option-title">{option.name}</p>

                                <p className="switch-option-text">{option.description}</p>

                                <div  className={`form-switch ${this.state.settings[option.id] !== 'no' ? 'active' : ''}`}
                                      onClick={() => {this.toggleSetting(option.id);}}
                                >
                                  <div className="form-switch-button"></div>
                                </div>
                              </div>
                            );
                          })
                        }
                        </div>
                        {/* SWITCH OPTION LIST */}
                      </div>
                      {/* WIDGET BOX CONTENT */}
                    </div>
                  );
                })
              }
              </div>

              {/* ACCOUNT HUB CONTENT OPTIONS */}
              <div className="account-hub-content-options">
                <div className="button primary" onClick={this.saveSettings}>
                  {
                    !this.state.savingSettings &&
                      vikinger_translation.save_changes
                  }
                  {
                    this.state.savingSettings &&
                      <React.Fragment>
                        {vikinger_translation.saving}
                        <LoaderSpinnerSmall />
                      </React.Fragment>
                  }
                </div>
              </div>
              {/* ACCOUNT HUB CONTENT OPTIONS */}
            </React.Fragment>
        }
      </div>
    );
  }
}

module.exports = EmailSettingsScreen;