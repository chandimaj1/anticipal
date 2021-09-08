const React = require('react');

const WP_Router = require('../../router/WP_Router')();

const friendUtils = require('../utils/friend');

const AddFriendButton = require('../button/AddFriendButton'),
      WithdrawFriendRequestButton = require('../button/WithdrawFriendRequestButton'),
      RejectFriendRequestButton = require('../button/RejectFriendRequestButton'),
      AcceptFriendRequestButton = require('../button/AcceptFriendRequestButton'),
      RemoveFriendButton = require('../button/RemoveFriendButton'),
      ButtonLink = require('../button/ButtonLink');

class ProfileHeaderActions extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loggedUser: false,
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
    WP_Router.getLoggedInMember('user-friends')
    .done((loggedUser) => {
      // console.log('PROFILE HEADER ACTIONS - LOGGED USER: ', loggedUser);

      this.setState({
        loggedUser: loggedUser,
        rejecting: false,
        accepting: false
      }, callback);
    });
  }

  componentDidMount() {
    this.getLoggedInMember();
  }

  render() {
    const friendable = friendUtils(this.state.loggedUser, this.props.userID);

    return (
      <div className="profile-header-info-actions">
      {
        this.state.loggedUser && (this.state.loggedUser.id !== this.props.userID) && !friendable.isFriend() && !friendable.friendRequestSent() && !friendable.friendRequestReceived() &&
          <AddFriendButton  modifiers="profile-header-info-action secondary"
                            text={vikinger_translation.add_friend}
                            loggedUser={this.state.loggedUser}
                            userID={this.props.userID}
                            onActionComplete={this.getLoggedInMember}
          />
      }

      {
        this.state.loggedUser && (this.state.loggedUser.id !== this.props.userID) && !friendable.isFriend() && friendable.friendRequestSent() &&
          <WithdrawFriendRequestButton  modifiers="profile-header-info-action tertiary"
                                        text={vikinger_translation.withdraw_friend}
                                        loggedUser={this.state.loggedUser}
                                        userID={this.props.userID}
                                        onActionComplete={this.getLoggedInMember}
          />
      }

      {
        this.state.loggedUser && (this.state.loggedUser.id !== this.props.userID) && !friendable.isFriend() && friendable.friendRequestReceived() &&
          <RejectFriendRequestButton  modifiers="profile-header-info-action tertiary"
                                      text={vikinger_translation.reject_friend}
                                      loggedUser={this.state.loggedUser}
                                      userID={this.props.userID}
                                      onActionStart={this.rejecting}
                                      onActionComplete={this.getLoggedInMember}
                                      locked={this.state.accepting}
          />
      }

      {
        this.state.loggedUser && (this.state.loggedUser.id !== this.props.userID) && !friendable.isFriend() && friendable.friendRequestReceived() &&
          <AcceptFriendRequestButton  modifiers="profile-header-info-action secondary"
                                      text={vikinger_translation.accept_friend}
                                      loggedUser={this.state.loggedUser}
                                      userID={this.props.userID}
                                      onActionStart={this.accepting}
                                      onActionComplete={() => {window.location = window.location;}}
                                      locked={this.state.rejecting}
          />
      }

      {
        this.state.loggedUser && (this.state.loggedUser.id !== this.props.userID) && friendable.isFriend() &&
          <RemoveFriendButton modifiers="profile-header-info-action tertiary"
                              text={vikinger_translation.remove_friend}
                              loggedUser={this.state.loggedUser}
                              userID={this.props.userID}
                              onActionComplete={() => {window.location = window.location;}}
          />
      }

      {
        vikinger_constants.plugin_active.buddypress_messages && this.state.loggedUser && (this.state.loggedUser.id !== this.props.userID) && friendable.isFriend() &&
          <ButtonLink modifiers="profile-header-info-action primary"
                      text={vikinger_translation.send_message}
                      link={`${this.state.loggedUser.messages_link}?user_id=${this.props.userID}`}
          />
      }
      </div>
    );
  }
}

module.exports = ProfileHeaderActions;