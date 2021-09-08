const React = require('react');

const WP_Router = require('../../router/WP_Router')();

const HeaderFriendRequestsDropdown = require('./HeaderFriendRequestsDropdown'),
      HeaderNotificationsDropdown = require('./HeaderNotificationsDropdown'),
      HeaderMessagesDropdown = require('./HeaderMessagesDropdown');

class HeaderNotifications extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loggedUser: false
    };

    this.getLoggedInMember = this.getLoggedInMember.bind(this);
  }

  getLoggedInMember(callback = () => {}) {
    WP_Router.getLoggedInMember('user-friends')
    .done((loggedUser) => {
      // console.log('HEADER NOTIFICATIONS - LOGGED USER: ', loggedUser);

      this.setState({
        loggedUser: loggedUser
      }, callback);
    });
  }

  componentDidMount() {
    this.getLoggedInMember();
  }

  render() {
    return (
      <div className="action-list dark">
      {
        vikinger_constants.plugin_active.buddypress_friends &&
          <HeaderFriendRequestsDropdown loggedUser={this.state.loggedUser} onActionComplete={this.getLoggedInMember} />
      }
      {
        vikinger_constants.plugin_active.buddypress_messages && vikinger_constants.plugin_active.buddypress_friends &&
          <HeaderMessagesDropdown loggedUser={this.state.loggedUser} />
      }
        <HeaderNotificationsDropdown loggedUser={this.state.loggedUser} />
      </div>
    );
  }
}

module.exports = HeaderNotifications;