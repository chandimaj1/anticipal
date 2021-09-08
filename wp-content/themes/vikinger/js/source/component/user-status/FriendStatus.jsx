const React = require('react');

const friendUtils = require('../utils/friend');

const AvatarSmall = require('../avatar/AvatarSmall'),
      BadgeVerified = require('../badge/BadgeVerified'),
      AddFriendActionRequest = require('../action/AddFriendActionRequest'),
      RemoveFriendActionRequest = require('../action/RemoveFriendActionRequest'),
      WithdrawFriendRequestActionRequest = require('../action/WithdrawFriendRequestActionRequest'),
      AcceptFriendRequestActionRequest = require('../action/AcceptFriendRequestActionRequest'),
      RejectFriendRequestActionRequest = require('../action/RejectFriendRequestActionRequest');

class FriendStatus extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      rejecting: false,
      accepting: false
    };

    this.accepting = this.accepting.bind(this);
    this.rejecting = this.rejecting.bind(this);
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

  onActionComplete() {
    this.props.onActionComplete(() => {
      this.setState({
        rejecting: false,
        accepting: false
      });
    });
  }

  render() {
    const friendable = friendUtils(this.props.loggedUser, this.props.data.id);

    const displayVerifiedMemberBadge = vikinger_constants.plugin_active['bp-verified-member'] && this.props.data.verified,
          displayVerifiedMemberBadgeInUsername = displayVerifiedMemberBadge && vikinger_constants.settings.bp_verified_member_display_badge_in_profile_username,
          displayVerifiedMemberBadgeInFullname = displayVerifiedMemberBadge && vikinger_constants.settings.bp_verified_member_display_badge_in_profile_fullname;

    return (
      <div className={`user-status ${this.props.modifiers || ''}`}>
        <AvatarSmall modifiers='user-status-avatar' noBorder data={this.props.data} />
          
        <p className="user-status-title">
          <a className="bold" href={this.props.data.link}>{this.props.data.name}</a>
          {
            displayVerifiedMemberBadgeInFullname &&
              <BadgeVerified />
          }
        </p>
        <p className="user-status-text small">&#64;{this.props.data.mention_name}
        {
          displayVerifiedMemberBadgeInUsername &&
            <BadgeVerified />
        }
        </p>

        <div className="action-request-list">
        {
          this.props.loggedUser && (this.props.loggedUser.id !== this.props.data.id) && !friendable.isFriend() && !friendable.friendRequestSent() && !friendable.friendRequestReceived() &&
            <AddFriendActionRequest userID={this.props.data.id}
                                    loggedUser={this.props.loggedUser}
                                    onActionComplete={this.props.onActionComplete}
            />
        }

        {
          this.props.loggedUser && (this.props.loggedUser.id !== this.props.data.id) && !friendable.isFriend() && friendable.friendRequestSent() &&
            <WithdrawFriendRequestActionRequest userID={this.props.data.id}
                                                loggedUser={this.props.loggedUser}
                                                onActionComplete={this.props.onActionComplete}
            />
        }

        {
          this.props.loggedUser && (this.props.loggedUser.id !== this.props.data.id) && !friendable.isFriend() && friendable.friendRequestReceived() &&
            <AcceptFriendRequestActionRequest userID={this.props.data.id}
                                              loggedUser={this.props.loggedUser}
                                              onActionStart={this.accepting}
                                              onActionComplete={this.props.onActionComplete}
                                              locked={this.state.rejecting}
            />
        }

        {
          this.props.allowReject && this.props.loggedUser && (this.props.loggedUser.id !== this.props.data.id) && !friendable.isFriend() && friendable.friendRequestReceived() &&
            <RejectFriendRequestActionRequest userID={this.props.data.id}
                                              loggedUser={this.props.loggedUser}
                                              onActionStart={this.rejecting}
                                              onActionComplete={this.props.onActionComplete}
                                              locked={this.state.accepting}
            />
        }

        {
          this.props.loggedUser && (this.props.loggedUser.id !== this.props.data.id) && friendable.isFriend() &&
            <RemoveFriendActionRequest  userID={this.props.data.id}
                                        loggedUser={this.props.loggedUser}
                                        onActionComplete={this.props.onActionComplete}
            />
        }
        </div>
      </div>
    );
  }
}

module.exports = FriendStatus;