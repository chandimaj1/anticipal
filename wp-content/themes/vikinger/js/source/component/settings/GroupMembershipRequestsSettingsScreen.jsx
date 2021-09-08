const React = require('react');

const WP_Router = require('../../router/WP_Router')();

const SectionHeader = require('../section/SectionHeader'),
      Loader = require('../loader/Loader'),
      Notification = require('../notification/Notification'),
      GroupReceivedMembershipRequestPreview = require('../group/GroupReceivedMembershipRequestPreview'),
      GroupSentMembershipRequestPreview = require('../group/GroupSentMembershipRequestPreview');

class GroupMembershipRequestsSettingsScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loggedUser: false
    };

    this.getLoggedInMember = this.getLoggedInMember.bind(this);
  }

  getLoggedInMember() {
    WP_Router.getLoggedInMember('user-groups-memberships')
    .done((response) => {
      // console.log('GROUP MEMBERSHIP REQUESTS SETTINGS SCREEN - LOGGED IN USER: ', response);

      this.setState({
        loggedUser: response
      });
    });
  }

  componentDidMount() {
    this.getLoggedInMember();
  }

  render() {
    const receivedMembershipRequestsCount = this.state.loggedUser ? this.state.loggedUser.group_membership_requests_received.length : 0,
          sentMembershipRequestsCount = this.state.loggedUser ? this.state.loggedUser.group_membership_requests_sent.length : 0;

    return (
      <div className="account-hub-content">
        <SectionHeader  pretitle={vikinger_translation.groups}
                        title={vikinger_translation.received_membership_requests}
                        titleCount={receivedMembershipRequestsCount}
        />
      {
        this.state.loggedUser &&
          <React.Fragment>
          {
            (this.state.loggedUser.group_membership_requests_received.length === 0) &&
              <Notification title={vikinger_translation.received_membership_requests_no_results_title}
                            text={vikinger_translation.received_membership_requests_no_results_text}
              />
          }

          {
            (this.state.loggedUser.group_membership_requests_received.length > 0) &&
              <div className="grid grid-3-3-3 centered-on-mobile">
              {
                this.state.loggedUser.group_membership_requests_received.map((membershipRequest) => {
                  return (
                    <GroupReceivedMembershipRequestPreview  key={membershipRequest.id}
                                                            data={membershipRequest}
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

        <SectionHeader  pretitle={vikinger_translation.groups}
                        title={vikinger_translation.sent_membership_requests}
                        titleCount={sentMembershipRequestsCount}
        />
      {
        this.state.loggedUser &&
          <React.Fragment>
          {
            (this.state.loggedUser.group_membership_requests_sent.length === 0) &&
              <Notification title={vikinger_translation.sent_membership_requests_no_results_title}
                            text={vikinger_translation.sent_membership_requests_no_results_text}
              />
          }

          {
            (this.state.loggedUser.group_membership_requests_sent.length > 0) &&
              <div className="grid grid-3-3-3 centered-on-mobile">
              {
                this.state.loggedUser.group_membership_requests_sent.map((membershipRequest) => {
                  return (
                    <GroupSentMembershipRequestPreview  key={membershipRequest.id}
                                                        data={membershipRequest}
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

module.exports = GroupMembershipRequestsSettingsScreen;