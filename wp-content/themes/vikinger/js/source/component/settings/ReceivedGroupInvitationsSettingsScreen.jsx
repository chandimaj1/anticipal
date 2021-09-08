const React = require('react');

const WP_Router = require('../../router/WP_Router')();

const SectionHeader = require('../section/SectionHeader'),
      Loader = require('../loader/Loader'),
      Notification = require('../notification/Notification'),
      GroupInvitationPreview = require('../group/GroupInvitationPreview');

class ReceivedGroupInvitationsSettingsScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loggedUser: false
    };

    this.getLoggedInMember = this.getLoggedInMember.bind(this);
  }

  getLoggedInMember() {
    WP_Router.getLoggedInMember('user-groups-received-invitations')
    .done((response) => {
      // console.log('RECEIVED GROUP INVITATIONS SETTINGS SCREEN - LOGGED IN USER: ', response);

      this.setState({
        loggedUser: response
      });
    });
  }

  componentDidMount() {
    this.getLoggedInMember();
  }

  render() {
    const receivedInvitationsCount = this.state.loggedUser ? this.state.loggedUser.group_invitations_received.length : 0;

    return (
      <div className="account-hub-content">
        <SectionHeader  pretitle={vikinger_translation.groups}
                        title={vikinger_translation.received_invitations}
                        titleCount={receivedInvitationsCount}
        />
      {
        this.state.loggedUser &&
          <React.Fragment>
          {
            (this.state.loggedUser.group_invitations_received.length === 0) &&
              <Notification title={vikinger_translation.received_invitations_no_results_title}
                            text={vikinger_translation.received_invitations_no_results_text}
              />
          }

          {
            (this.state.loggedUser.group_invitations_received.length > 0) &&
              <div className="grid grid-3-3-3 centered-on-mobile">
              {
                this.state.loggedUser.group_invitations_received.map((invitation) => {
                  return (
                    <GroupInvitationPreview key={invitation.id}
                                            data={invitation}
                                            onActionComplete={this.getLoggedInMember}
                    />
                  );
                })
              }
              </div>
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

module.exports = ReceivedGroupInvitationsSettingsScreen;