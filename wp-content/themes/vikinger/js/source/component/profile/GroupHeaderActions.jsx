const React = require('react');

const WP_Router = require('../../router/WP_Router')();

const groupUtils = require('../utils/group');

const JoinGroupButton = require('../button/JoinGroupButton'),
      LeaveGroupButton = require('../button/LeaveGroupButton'),
      RequestGroupMembershipButton = require('../button/RequestGroupMembershipButton'),
      RemoveGroupMembershipButton = require('../button/RemoveGroupMembershipButton'),
      TagSticker = require('../tag/TagSticker'),
      ButtonLink = require('../button/ButtonLink');

class GroupHeaderActions extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loggedUser: false,
      group: false,
      rejecting: false,
      accepting: false
    };

    this.rejecting = this.rejecting.bind(this);
    this.accepting = this.accepting.bind(this);

    this.getLoggedInMember = this.getLoggedInMember.bind(this);
  }

  rejecting() {
    this.setState({
      rejecting: true
    });
  }

  accepting() {
    this.setState({
      accepting: true
    });
  }

  getLoggedInMember(callback = () => {}) {
    WP_Router.getLoggedInMember('user-groups')
    .done((loggedUser) => {
      // console.log('GROUP HEADER ACTIONS - LOGGED USER: ', loggedUser);

      this.setState({
        loggedUser: loggedUser,
        rejecting: false,
        accepting: false
      }, callback);
    });
  }

  getGroup() {
    WP_Router.getGroups({include: [this.props.groupID]})
    .done((response) => {
      // console.log('GROUP HEADER ACTIONS - GROUP: ', response);

      this.setState({
        group: response[0]
      });
    });
  }

  componentDidMount() {
    this.getLoggedInMember();
    this.getGroup();
  }

  render() {
    const groupable = groupUtils(this.state.loggedUser, this.state.group);

    return (
      <div className="profile-header-info-actions">
      {
        this.state.loggedUser && this.state.group &&
          <React.Fragment>
          {
            groupable.isBannedFromGroup() &&
              <TagSticker modifiers="button-tag tertiary"
                          title="Banned"
                          icon="ban"
                          iconModifiers="white"
              />
          }
          {
            !groupable.isBannedFromGroup() &&
              <React.Fragment>
              {
                groupable.isGroupPublic() && !groupable.isGroupMember() &&
                  <JoinGroupButton  modifiers="profile-header-info-action secondary"
                                    title={vikinger_translation.join_group}
                                    icon="join-group"
                                    loggedUser={this.state.loggedUser}
                                    group={this.state.group}
                                    onActionComplete={() => {window.location = window.location;}}
                  />
              }

              {
                groupable.isGroupMember() && !groupable.isGroupAdmin() &&
                  <LeaveGroupButton modifiers="profile-header-info-action tertiary"
                                    title={vikinger_translation.leave_group}
                                    icon="leave-group"
                                    loggedUser={this.state.loggedUser}
                                    group={this.state.group}
                                    onActionComplete={() => {window.location = window.location;}}
                  />
              }

              {
                groupable.isGroupPrivate() && !groupable.isGroupMember() && !groupable.groupMembershipRequestSent() &&
                  <RequestGroupMembershipButton modifiers="profile-header-info-action secondary"
                                                title={vikinger_translation.send_join_request}
                                                icon="join-group"
                                                loggedUser={this.state.loggedUser}
                                                group={this.state.group}
                                                onActionComplete={this.getLoggedInMember}
                  />
              }

              {
                groupable.isGroupPrivate() && !groupable.isGroupMember() && groupable.groupMembershipRequestSent() &&
                  <RemoveGroupMembershipButton  modifiers="profile-header-info-action tertiary"
                                                title={vikinger_translation.cancel_join_request}
                                                icon="leave-group"
                                                loggedUser={this.state.loggedUser}
                                                group={this.state.group}
                                                onActionComplete={this.getLoggedInMember}
                  />
              }

              {
                (groupable.isGroupAdmin() || groupable.isGroupMod()) &&
                  <ButtonLink link={this.state.loggedUser.manage_groups_link}
                              modifiers="profile-header-info-action"
                              icon="more-dots"
                              title={vikinger_translation.manage_groups}
                  />
              }
              </React.Fragment>
          }
          </React.Fragment> 
      }
      </div>
    );
  }
}

module.exports = GroupHeaderActions;