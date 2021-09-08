const React = require('react');

const app = require('../../utils/core'),
      plugins = require('../../utils/plugins');

const xprofileUtils = require('../utils/xprofile');

const WP_Router = require('../../router/WP_Router')();

const SectionHeader = require('../section/SectionHeader'),
      UserPreview = require('../user-preview/UserPreview'),
      UploadBox = require('../upload/UploadBox'),
      Loader = require('../loader/Loader'),
      LoaderSpinnerSmall = require('../loader/LoaderSpinnerSmall'),
      MessageBox = require('../message/MessageBox');

const SettingsWidget = require('./SettingsWidget');

class ProfileSettingsScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loggedUser: false,
      avatarFile: false,
      coverFile: false,
      deleteAvatar: false,
      deleteCover: false,
      saving: false,
      messageBoxTitle: '',
      messageBoxText: '',
      profileDataGroups: [],
      profileDataFields: {}
    };

    this.messageBoxRef = React.createRef();

    this.updateAvatarFile = this.updateAvatarFile.bind(this);
    this.deleteAvatar = this.deleteAvatar.bind(this);

    this.updateCoverFile = this.updateCoverFile.bind(this);
    this.deleteCover = this.deleteCover.bind(this);

    this.updateProfileData = this.updateProfileData.bind(this);
    this.save = this.save.bind(this);
  }

  getLoggedInMember() {
    WP_Router.getLoggedInMember('user-settings-profile')
    .done((response) => {
      // console.log('PROFILE SETTINGS SCREEN - LOGGED IN USER: ', response);

      // get profile data
      const xprofiler = xprofileUtils(response.profile_data),
            profileDataGroups = xprofiler.getGroups('profile');
            
      this.setState({
        loggedUser: response,
        profileDataGroups: profileDataGroups
      });
    });
  }

  updateAvatarFile(file) {
    // console.log('PROFILE SETTINGS SCREEN - AVATAR FILE: ', file);

    this.setState((state, props) => {
      const user = {};
      app.deepExtend(user, state.loggedUser);

      user.avatar_url = file.url;

      return {
        avatarFile: file,
        loggedUser: user,
        deleteAvatar: false
      };
    });
  }

  updateCoverFile(file) {
    // console.log('PROFILE SETTINGS SCREEN - COVER FILE: ', file);

    this.setState((state, props) => {
      const user = {};
      app.deepExtend(user, state.loggedUser);

      user.cover_url = file.url;

      return {
        coverFile: file,
        loggedUser: user,
        deleteCover: false
      };
    });
  }

  deleteAvatar() {
    this.setState((state, props) => {
      const user = {};
      app.deepExtend(user, state.loggedUser);

      user.avatar_url = user.default_avatar_url;

      return {
        loggedUser: user,
        deleteAvatar: true
      };
    });
  }

  deleteCover() {
    this.setState((state, props) => {
      const user = {};
      app.deepExtend(user, state.loggedUser);

      user.cover_url = user.default_cover_url;

      return {
        loggedUser: user,
        deleteCover: true
      };
    });
  }

  updateProfileData(field, value) {
    // console.log('PROFILE SETTINGS SCREEN - UPDATE PROFILE DATA: ', field, value);

    this.setState((state, props) => {
      const updatedProfileDataFields = {};
      app.deepExtend(updatedProfileDataFields, state.profileDataFields);

      // update profile data fields with new value
      // this is used to update fields when saving
      updatedProfileDataFields[field.id] = value;

      return {
        profileDataFields: updatedProfileDataFields
      };
    }, () => {
      // console.log('PROFILE SETTINGS SCREEN - UPDATE PROFILE DATA: ', this.state.profileDataFields);
    });
  }

  save() {
    // return if already saving
    if (this.state.saving) {
      return;
    }

    const avatarChanged = this.state.avatarFile,
          coverChanged = this.state.coverFile,
          deleteAvatar = this.state.deleteAvatar,
          deleteCover = this.state.deleteCover,
          profileDataChanged = Object.keys(this.state.profileDataFields).length > 0;

    // only process data if it changed
    if (avatarChanged || coverChanged || deleteAvatar || deleteCover || profileDataChanged) {
      this.setState({
        saving: true
      });

      let uploadAvatarPromise = {no_result: true},
          deleteAvatarPromise = {no_result: true},
          uploadCoverPromise = {no_result: true},
          deleteCoverPromise = {no_result: true},
          updateProfileDataPromise = {no_result: true};

      // if user changed avatar, save it
      if (avatarChanged) {
        uploadAvatarPromise = WP_Router.uploadMemberAvatar({
          user_id: this.state.loggedUser.id,
          file: this.state.avatarFile.file
        });
      }

      // if user wants to delete avatar, delete it
      if (deleteAvatar) {
        deleteAvatarPromise = WP_Router.deleteMemberAvatar({
          user_id: this.state.loggedUser.id
        });
      }

      // if user changed cover, save it
      if (coverChanged) {
        uploadCoverPromise = WP_Router.uploadMemberCover({
          user_id: this.state.loggedUser.id,
          file: this.state.coverFile.file
        });
      }

      // if user wants to delete cover, delete it
      if (deleteCover) {
        deleteCoverPromise = WP_Router.deleteMemberCover({
          user_id: this.state.loggedUser.id
        });
      }

      // if user changed profile data
      if (profileDataChanged) {
        updateProfileDataPromise = WP_Router.updateMemberXProfileData({
          fields: this.state.profileDataFields,
          member_id: this.state.loggedUser.id
        });
      }

      jQuery
      .when(uploadAvatarPromise, deleteAvatarPromise, uploadCoverPromise, deleteCoverPromise, updateProfileDataPromise)
      .done((avatarUploadResponse, deleteAvatarResponse, coverUploadResponse, deleteCoverResponse, updateProfileDataResponse) => {
        // console.log('PROFILE SETTINGS SCREEN - AVATAR UPLOAD RESPONSE:', avatarUploadResponse);
        // console.log('PROFILE SETTINGS SCREEN - COVER UPLOAD RESPONSE:', coverUploadResponse);
        // console.log('PROFILE SETTINGS SCREEN - UPDATE PROFILE DATA RESPONSE:', updateProfileDataResponse);
  
        // check if avatar was selected to be uploaded
        if (typeof avatarUploadResponse.no_result !== 'undefined') {
          // console.log('PROFILE SETTINGS SCREEN - USER DIDN\'T SELECT AVATAR TO CHANGE');
        } else {
          // success, release blob image resource
          // console.log('PROFILE SETTINGS SCREEN - AVATAR UPLOAD RESPONSE:', avatarUploadResponse);
        }

        // check if avatar was selected to be deleted
        if (typeof deleteAvatarResponse.no_result !== 'undefined') {
          // console.log('PROFILE SETTINGS SCREEN - USER DIDN\'T SELECT AVATAR TO DELETE');
        } else {
          // console.log('PROFILE SETTINGS SCREEN - AVATAR DELETE RESPONSE:', deleteAvatarResponse);
        }

        // check if cover was selected to be uploaded
        if (typeof coverUploadResponse.no_result !== 'undefined') {
          // console.log('PROFILE SETTINGS SCREEN - USER DIDN\'T SELECT COVER TO CHANGE');
        } else {
          // success, release blob image resource
          // console.log('PROFILE SETTINGS SCREEN - COVER UPLOAD SUCCESS');
        }

        // check if cover was selected to be deleted
        if (typeof deleteCoverResponse.no_result !== 'undefined') {
          // console.log('PROFILE SETTINGS SCREEN - USER DIDN\'T SELECT COVER TO DELETE');
        } else {
          // console.log('PROFILE SETTINGS SCREEN - COVER DELETE RESPONSE:', deleteCoverResponse);
        }

        // check if profile data was updated
        if (typeof updateProfileDataResponse.no_result !== 'undefined') {
          // console.log('PROFILE SETTINGS SCREEN - USER DIDN\'T CHANGE ANY PROFILE FIELDS');
        } else {
          // success
          // console.log('PROFILE SETTINGS SCREEN - USER UPDATED PROFILE FIELDS');
        }
  
        // refresh page
        window.location.reload();
      })
      .fail((error) => {
        // console.log('PROFILE SETTINGS SCREEN - ERROR WHEN SAVING: ', error);

        const errorJSON = error.responseJSON;

        if (typeof errorJSON !== 'undefined') {
          if (errorJSON.code === 'bp_rest_attachments_user_avatar_upload_error') {
            // show error popup
            this.setState({
              messageBoxTitle: vikinger_translation.avatar_upload_error,
              messageBoxText: errorJSON.message,
              saving: false
            }, () => {
              this.popup.show();
            });
          } else if (errorJSON.code === 'bp_rest_attachments_user_cover_upload_error') {
            // show error popup
            this.setState({
              messageBoxTitle: vikinger_translation.cover_upload_error,
              messageBoxText: errorJSON.message,
              saving: false
            }, () => {
              this.popup.show();
            });
          } else if (errorJSON.code === 'bp_rest_attachments_user_avatar_error') {
            // show error popup
            this.setState({
              messageBoxTitle: vikinger_translation.avatar_upload_error,
              messageBoxText: errorJSON.message,
              saving: false
            }, () => {
              this.popup.show();
            });
          }
        } else {
          // show error popup
          this.setState({
            messageBoxTitle: vikinger_translation.upload_error,
            messageBoxText: vikinger_translation.upload_error_message,
            saving: false
          }, () => {
            this.popup.show();
          });
        }
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
    // console.log('PROFILE SETTINGS SCREEN - PROFILE DATA GROUPS: ', this.state.profileDataGroups);
    // console.log('PROFILE SETTINGS SCREEN - PROFILE DATA FIELDS: ', this.state.profileDataFields);

    return (
      <div className="account-hub-content">
        <SectionHeader pretitle={vikinger_translation.my_profile} title={vikinger_translation.profile_info} />

        {/* MESSAGE BOX */}
        <MessageBox ref={this.messageBoxRef}
                    data={{title: this.state.messageBoxTitle, text: this.state.messageBoxText}}
                    error
                    continue
                    onContinue={() => {this.popup.hide(); window.location.reload();}}
        />
        {/* MESSAGE BOX */}

        {
          this.state.loggedUser &&
            <div className="grid-column">
              {/* GRID */}
              <div className="grid grid-3-3-3 centered">
                <UserPreview  data={this.state.loggedUser}
                              actionableAvatar={this.state.loggedUser.avatar_url !== this.state.loggedUser.default_avatar_url}
                              actionableCover={this.state.loggedUser.cover_url !== this.state.loggedUser.default_cover_url}
                              onAvatarActionClick={this.deleteAvatar}
                              onCoverActionClick={this.deleteCover}
                />

                <UploadBox  title={vikinger_translation.change_avatar}
                            text="jpg/jpeg/png/gif"
                            onFileSelect={this.updateAvatarFile} />

                <UploadBox  title={vikinger_translation.change_cover}
                            text="jpg/jpeg/png/gif"
                            onFileSelect={this.updateCoverFile} />
              </div>
              {/* GRID */}

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
          !this.state.loggedUser &&
            <Loader />
        }
      </div>
    );
  }
}

module.exports = ProfileSettingsScreen;