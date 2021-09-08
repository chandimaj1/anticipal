const React = require('react');

const app = require('../../utils/core'),
      plugins = require('../../utils/plugins');

const xprofileUtils = require('../utils/xprofile');

const WP_Router = require('../../router/WP_Router')();

const SectionHeader = require('../section/SectionHeader'),
      Loader = require('../loader/Loader'),
      LoaderSpinnerSmall = require('../loader/LoaderSpinnerSmall'),
      MessageBox = require('../message/MessageBox');

const SettingsWidget = require('./SettingsWidget');

class SocialSettingsScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loggedUser: false,
      saving: false,
      messageBoxTitle: '',
      messageBoxText: '',
      profileDataGroups: [],
      profileDataFields: {}
    };

    this.messageBoxRef = React.createRef();

    this.updateProfileData = this.updateProfileData.bind(this);
    this.save = this.save.bind(this);
  }

  getLoggedInMember() {
    WP_Router.getLoggedInMember('user-settings')
    .done((response) => {
      // console.log('SOCIAL SETTINGS SCREEN - LOGGED IN USER: ', response);

      // get social data
      const xprofiler = xprofileUtils(response.profile_data),
            profileDataGroups = xprofiler.getGroups('social');

      this.setState({
        loggedUser: response,
        profileDataGroups: profileDataGroups
      });
    });
  }

  updateProfileData(field, value) {
    this.setState((state, props) => {
      const updatedProfileDataFields = {};
      app.deepExtend(updatedProfileDataFields, state.profileDataFields);

      // update profile data fields with new value
      // this is used to update fields when saving
      updatedProfileDataFields[field.id] = value;

      return {
        profileDataFields: updatedProfileDataFields
      };
    });
  }

  save() {
    // return if already saving
    if (this.state.saving) {
      return;
    }

    const profileDataChanged = Object.keys(this.state.profileDataFields).length > 0;

    // only process data if it changed
    if (profileDataChanged) {
      this.setState({
        saving: true
      });

      const updateProfileDataPromise = WP_Router.updateMemberXProfileData({
        fields: this.state.profileDataFields,
        member_id: this.state.loggedUser.id
      });

      updateProfileDataPromise
      .then((updateProfileDataResponse) => {
        // console.log('SOCIAL SETTINGS SCREEN - UPDATE PROFILE DATA RESPONSE:', updateProfileDataResponse);
  
        // refresh page
        window.location = window.location;
      }, (error) => {
        // console.log('SOCIAL SETTINGS SCREEN - ERROR WHEN SAVING: ', error);
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
    // console.log('SOCIAL SETTINGS SCREEN - PROFILE DATA GROUPS: ', this.state.profileDataGroups);
    // console.log('SOCIAL SETTINGS SCREEN - PROFILE DATA FIELDS: ', this.state.profileDataFields);

    return (
      <div className="account-hub-content">
        <SectionHeader pretitle={vikinger_translation.my_profile} title={vikinger_translation.social_networks} />

        {/* MESSAGE BOX */}
        <MessageBox ref={this.messageBoxRef}
                    data={{title: this.state.messageBoxTitle, text: this.state.messageBoxText}}
                    error
                    continue
                    onContinue={() => {this.popup.hide(); window.location = window.location;}}
        />
        {/* MESSAGE BOX */}

        {
          this.state.loggedUser &&
            <React.Fragment>
            {
              (this.state.profileDataGroups.length > 0) &&
                <div className="grid-column">
                  {
                    this.state.profileDataGroups.map((group) => {
                      return (
                        <SettingsWidget key={group.id}
                                        data={group}
                                        onFieldUpdate={this.updateProfileData}
                        />
                      );
                    })
                  }

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
              (this.state.profileDataGroups.length === 0) &&
                <p className="no-results-text">{vikinger_translation.no_social_info_available}</p>
            }
            </React.Fragment>
        }

        {
          !this.state.loggedUser &&
            <Loader />
        }
      </div>
    );
  }
}

module.exports = SocialSettingsScreen;