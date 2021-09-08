const React = require('react');

const WP_Router = require('../../router/WP_Router')();

const SectionHeader = require('../section/SectionHeader'),
      Loader = require('../loader/Loader'),
      Notification = require('../notification/Notification');

const FriendRequestList = require('../friend/FriendRequestList');

class FriendRequestsSettingsScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loggedUser: false
    };

    this.getLoggedInMember = this.getLoggedInMember.bind(this);
  }

  getLoggedInMember() {
    WP_Router.getLoggedInMember('user-friends')
    .done((response) => {
      // console.log('FRIEND REQUESTS SETTINGS SCREEN - LOGGED IN USER: ', response);

      this.setState({
        loggedUser: response
      });
    });
  }

  componentDidMount() {
    this.getLoggedInMember();
  }

  render() {
    return (
      <div className="account-hub-content">
        <SectionHeader  pretitle={vikinger_translation.my_profile} title={vikinger_translation.friend_requests_received} />
      {
        this.state.loggedUser &&
          <React.Fragment>
          {
            (this.state.loggedUser.friend_requests_received.length > 0) &&
              <FriendRequestList  data={this.state.loggedUser.friend_requests_received}
                                  loggedUser={this.state.loggedUser}
                                  onActionComplete={this.getLoggedInMember}
              />
          }
          {
            (this.state.loggedUser.friend_requests_received.length === 0) &&
              <Notification title={vikinger_translation.friend_requests_received_no_results_title}
                            text={vikinger_translation.friend_requests_received_no_results_text}
              />
          }
          </React.Fragment>
      }

      {
        !this.state.loggedUser &&
          <Loader />
      }

        <SectionHeader  pretitle={vikinger_translation.my_profile} title={vikinger_translation.friend_requests_sent} />

      {
        this.state.loggedUser &&
          <React.Fragment>
          {
            (this.state.loggedUser.friend_requests_sent.length > 0) &&
              <FriendRequestList  data={this.state.loggedUser.friend_requests_sent}
                                  loggedUser={this.state.loggedUser}
                                  onActionComplete={this.getLoggedInMember}
              />
          }
          {
            (this.state.loggedUser.friend_requests_sent.length === 0) &&
              <Notification title={vikinger_translation.friend_requests_sent_no_results_title}
                            text={vikinger_translation.friend_requests_sent_no_results_text}
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

module.exports = FriendRequestsSettingsScreen;