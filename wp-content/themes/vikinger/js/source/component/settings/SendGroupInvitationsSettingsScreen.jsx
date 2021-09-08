const React = require('react');

const WP_Router = require('../../router/WP_Router')();

const SectionHeader = require('../section/SectionHeader'),
      Loader = require('../loader/Loader'),
      LoaderSpinnerSmall = require('../loader/LoaderSpinnerSmall'),
      Notification = require('../notification/Notification');

const FormSelect = require('../form/FormSelect'),
      SelectableUserStatusList = require('../user-status/SelectableUserStatusList'),
      GroupInvitationStatusList = require('../user-status/GroupInvitationStatusList');

class SendGroupInvitationsSettingsScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loggedUser: false,
      groups: [],
      selectedGroup: false,
      selectedFriends: false,
      sendingInvitations: false
    };

    this.friends = [];

    this.getLoggedInMember = this.getLoggedInMember.bind(this);
    this.onChange = this.onChange.bind(this);
    this.toggleSelectableActive = this.toggleSelectableActive.bind(this);
    this.sendInvitations = this.sendInvitations.bind(this);
  }

  getLoggedInMember() {
    WP_Router.getLoggedInMember('user-groups-invitations')
    .done((response) => {
      // console.log('SEND GROUP INVITATIONS SETTINGS SCREEN - LOGGED IN USER: ', response);

      let groupOptions = [],
          selectedGroupID = false;

      const unbannedGroups = response.groups.filter(group => !group.is_banned);

      // if logged user belongs to any groups
      if (unbannedGroups.length > 0) {
        groupOptions = unbannedGroups.map(group => ({id: group.id, name: group.name, value: group.id}));
        selectedGroupID = groupOptions[0].value;

        const selectedGroup = response.groups.filter(group => group.id === Number.parseInt(selectedGroupID, 10))[0];

        this.friends = this.getInviteableFriends(response, selectedGroup);
      }

      this.setState((state, props) => {
        return {
          loggedUser: response,
          groups: groupOptions,
          selectedGroup: state.selectedGroup ? state.selectedGroup : selectedGroupID,
          selectedFriends: (new Array(this.friends.length)).fill(false),
          sendingInvitations: false
        }; 
      }, () => {
        // console.log('SEND GROUP INVITATIONS SETTINGS SCREEN - STATE: ', this.state);
      });
    });
  }

  getInviteableFriends(loggedUser, group) {
    const inviteableFriends = [];

    for (const friend of loggedUser.friends) {
      // friend isn't a member of the group
      if (!group.members.some(member => member.id === friend.id)) {
        // friend isn't banned from the group
        if (!group.banned.some(bannedMember => bannedMember.id === friend.id)) {
          // friend hasn't already been invited to the group
          if (!loggedUser.group_invitations_sent.some(invitation => (invitation.user.id === friend.id) && (group.id === invitation.group.id))) {
            // add friend as selectable to invite
            inviteableFriends.push(friend);
          }
        }
      }
    }

    return inviteableFriends;
  }

  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    }, () => {
      // console.log('SEND GROUP INVITATIONS SETTINGS SCREEN - SELECTED GROUP: ', this.state.selectedGroup);
    });
  }

  toggleSelectableActive(i) {
    this.setState((state, props) => {
      const selectedFriends = state.selectedFriends.slice();

      selectedFriends[i] = !selectedFriends[i];

      // console.log('SEND GROUP INVITATIONS SETTINGS SCREEN - SELECTED FRIENDS: ', selectedFriends);

      return {
        selectedFriends: selectedFriends
      };
    });
  }

  selectedFriends() {
    return this.state.selectedFriends.some(selected => selected);
  }

  sendInvitations() {
    // if already sending invitations or no friend is selected, return
    if (this.state.sendingInvitations || !this.selectedFriends()) {
      return;
    }

    this.setState({
      sendingInvitations: true
    });

    // send invitation promises
    const sendInvitationPromises = [];

    for (let i = 0; i < this.friends.length; i++) {
      // if friend selected
      if (this.state.selectedFriends[i]) {
        const sendInvitationPromise = WP_Router.sendGroupInvitation({
          group_id: this.state.selectedGroup,
          user_id: this.friends[i].id
        });

        sendInvitationPromises.push(sendInvitationPromise);
      }
    }

    jQuery
    .when(...sendInvitationPromises)
    .done((...sendInvitationResults) => {
      // console.log('SEND GROUP INVITATIONS SETTINGS SCREEN - SEND INVITATIONS RESPONSE: ', sendInvitationResults);
      
      // update logged in member
      this.getLoggedInMember();
    })
    .fail((error) => {
      // console.log('SEND GROUP INVITATIONS SETTINGS SCREEN - SEND INVITATIONS ERROR: ', error);

      this.setState({
        sendingInvitations: false
      });
    });
  }

  componentDidMount() {
    this.getLoggedInMember();
  }

  render() {
    const selectedGroup = this.state.loggedUser ? this.state.loggedUser.groups.filter(group => group.id === Number.parseInt(this.state.selectedGroup, 10))[0] : false;

    if (selectedGroup) {
      this.friends = this.getInviteableFriends(this.state.loggedUser, selectedGroup);
    }

    // console.log('SEND GROUP INVITATIONS SETTINGS SCREEN - SELECTED GROUP: ', selectedGroup);
    // console.log('SEND GROUP INVITATIONS SETTINGS SCREEN - INVITABLE FRIENDS: ', this.friends);

    const sentGroupInvitations = [];

    if (this.state.loggedUser) {
      const groupedSentGroupInvitations = {};

      for (const sentInvitation of this.state.loggedUser.group_invitations_sent) {
        if (typeof groupedSentGroupInvitations[sentInvitation.group.id] === 'undefined') {
          groupedSentGroupInvitations[sentInvitation.group.id] = [];
        }

        groupedSentGroupInvitations[sentInvitation.group.id].push(sentInvitation);
      }

      for (const groupID in groupedSentGroupInvitations) {
        sentGroupInvitations.push(groupedSentGroupInvitations[groupID]);
      }
    }

    // console.log('SEND GROUP INVITATIONS SETTINGS SCREEN - SENT GROUP INVITATIONS: ', sentGroupInvitations);

    return (
      <div className="account-hub-content">
      <SectionHeader pretitle={vikinger_translation.groups} title={vikinger_translation.send_invitations} />
      {
        this.state.loggedUser &&
          <React.Fragment>
          {
            (this.state.loggedUser.groups.length === 0) &&
              <Notification title={vikinger_translation.send_invitations_no_results_title}
                            text={vikinger_translation.send_invitations_no_results_text_1}
              />
          }

          {
            (this.state.loggedUser.groups.length > 0) &&
              <React.Fragment>
              {
                (this.state.groups.length === 0) &&
                  <Notification title={vikinger_translation.send_invitations_no_results_title}
                                text={vikinger_translation.send_invitations_no_results_text_2}
                  />
              }

              {
                (this.state.groups.length > 0) &&
                  <React.Fragment>
                    {/* WIDGET BOX */}
                    <div className="widget-box no-padding">
                      <p className="widget-box-title">{vikinger_translation.select_the_group}</p>

                      {/* WIDGET BOX CONTENT */}
                      <div className="widget-box-content">
                        {/* FORM */}
                        <div className="form padded">
                          <div className="form-row">
                            <div className="form-item">
                              <FormSelect options={this.state.groups}
                                          name="selectedGroup"
                                          value={this.state.selectedGroup}
                                          handleValue
                                          onChange={this.onChange}
                              />
                            </div>
                          </div>
                        </div>
                        {/* FORM */}
                      </div>
                      {/* WIDGET BOX CONTENT */}

                      <p className="widget-box-title">{vikinger_translation.select_your_friends}</p>

                      {/* WIDGET BOX HOLLOW */}
                      <div className="widget-box-hollow height-limit">
                      {
                        (this.friends.length === 0) &&
                          <p className="no-results-text">{vikinger_translation.send_invitations_friends_no_results}</p>
                      }

                      {
                        (this.friends.length > 0) &&
                          <SelectableUserStatusList data={this.friends}
                                                    loggedUser={this.state.loggedUser}
                                                    selectedItems={this.state.selectedFriends}
                                                    toggleSelectableActive={this.toggleSelectableActive}
                          />
                      }
                      </div>
                      {/* /WIDGET BOX HOLLOW */}

                      {/* WIDGET BOX FOOTER ACTIONS */}
                      <div className="widget-box-footer-actions">
                        <div className="button secondary" onClick={this.sendInvitations}>
                          {
                            !this.state.sendingInvitations &&
                              vikinger_translation.send_invitations
                          }
                          {
                            this.state.sendingInvitations &&
                              <React.Fragment>
                                {vikinger_translation.sending}
                                <LoaderSpinnerSmall />
                              </React.Fragment>
                          }
                        </div>
                      </div>
                      {/* WIDGET BOX FOOTER ACTIONS */}
                    </div>
                    {/* WIDGET BOX */}

                    <SectionHeader pretitle={vikinger_translation.groups} title={vikinger_translation.pending_invitations} />
                    {
                      (sentGroupInvitations.length === 0) &&
                        <Notification title={vikinger_translation.pending_invitations_no_results_title}
                                      text={vikinger_translation.pending_invitations_no_results_text}
                        />
                    }

                    {
                      (sentGroupInvitations.length > 0) &&
                        <div className="grid">
                        {
                          sentGroupInvitations.map((groupInvitations) => {
                            return (
                              <div key={groupInvitations[0].group.id} className="widget-box">
                                <p className="widget-box-title">{groupInvitations[0].group.name}</p>

                                <div className="widget-box-content">
                                  <GroupInvitationStatusList  data={groupInvitations}
                                                              loggedUser={this.state.loggedUser}
                                                              onActionComplete={this.getLoggedInMember}
                                  />
                                </div>
                              </div>
                            );
                          })
                        }
                        </div>
                    }
                  </React.Fragment>
              }
              </React.Fragment>
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

module.exports = SendGroupInvitationsSettingsScreen;