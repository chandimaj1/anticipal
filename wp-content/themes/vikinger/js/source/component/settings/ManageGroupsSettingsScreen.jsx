const React = require('react');

const WP_Router = require('../../router/WP_Router')();

const SectionHeader = require('../section/SectionHeader'),
      Loader = require('../loader/Loader');

const UserGroupManagePreview = require('../user-preview/UserGroupManagePreview'),
      ActionBox = require('../action/ActionBox'),
      Notification = require('../notification/Notification');

class ManageGroupsSettingsScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loggedUser: false
    };

    this.getLoggedInMember = this.getLoggedInMember.bind(this);
  }

  getLoggedInMember() {
    WP_Router.getLoggedInMember('user-groups-preview')
    .done((response) => {
      // console.log('MANAGE GROUPS SETTINGS SCREEN - LOGGED IN USER: ', response);

      this.setState({
        loggedUser: response
      });
    });
  }

  componentDidMount() {
    this.getLoggedInMember();
  }

  render() {
    // only show groups the user is an admin or mod of
    const groups = this.state.loggedUser ? this.state.loggedUser.groups.filter(group => group.is_admin || group.is_mod) : [],
          userCanCreateGroups = !vikinger_constants.settings.bp_restrict_group_creation || vikinger_constants.settings.current_user_is_admin;

    return (
      <div className="account-hub-content">
      <SectionHeader pretitle={vikinger_translation.groups} title={vikinger_translation.manage_groups} />
      {
        this.state.loggedUser &&
          <React.Fragment>
          {
            (userCanCreateGroups || (groups.length > 0)) &&
              <div className="grid grid-3-3-3 centered-on-mobile">
              {
                userCanCreateGroups &&
                  <ActionBox  title={vikinger_translation.create_new_group}
                              text={vikinger_translation.create_new_group_text}
                              actionText={vikinger_translation.start_creating}
                              loggedUser={this.state.loggedUser}
                  />
              }

              {
                (groups.length > 0) && groups.map((group) => {
                  let groupPreviewDescriptionText = '';

                  if (group.creator_id === this.state.loggedUser.id) {
                    groupPreviewDescriptionText = vikinger_translation.group_creator;
                  } else if (group.is_admin) {
                    groupPreviewDescriptionText = vikinger_translation.group_admin;
                  } else if (group.is_mod) {
                    groupPreviewDescriptionText = vikinger_translation.group_mod;
                  }

                  return (
                    <UserGroupManagePreview key={group.id}
                                            data={group}
                                            loggedUser={this.state.loggedUser}
                                            descriptionText={groupPreviewDescriptionText}
                                            forumOptions={this.state.forumOptions}
                    />
                  );
                })
              }
              </div>
          }
          {
            !userCanCreateGroups && (groups.length === 0) &&
              <Notification title={vikinger_translation.no_groups_found}
                            text={vikinger_translation.cant_manage_groups_message}
              />
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

module.exports = ManageGroupsSettingsScreen;