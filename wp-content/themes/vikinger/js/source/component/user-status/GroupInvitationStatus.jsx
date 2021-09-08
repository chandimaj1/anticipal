const React = require('react');

const AvatarSmall = require('../avatar/AvatarSmall'),
      BadgeVerified = require('../badge/BadgeVerified');

const RemoveGroupInvitationActionRequest = require('../action/RemoveGroupInvitationActionRequest');

class GroupInvitationStatus extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const displayVerifiedMemberBadge = vikinger_constants.plugin_active['bp-verified-member'] && this.props.data.user.verified;

    return (
      <div className={`user-status ${this.props.modifiers || ''}`}>
        <AvatarSmall modifiers='user-status-avatar' noBorder data={this.props.data.user} />
          
        <p className="user-status-title">
          <a className="bold" href={this.props.data.user.link}>{this.props.data.user.name}</a>
          {
            displayVerifiedMemberBadge && vikinger_constants.settings.bp_verified_member_display_badge_in_profile_fullname &&
              <BadgeVerified />
          }
        </p>
        <p className="user-status-text small">&#64;{this.props.data.user.mention_name}
        {
          displayVerifiedMemberBadge && vikinger_constants.settings.bp_verified_member_display_badge_in_profile_username &&
            <BadgeVerified />
        }
        </p>

        <div className="action-request-list">
        {
          <RemoveGroupInvitationActionRequest data={this.props.data}
                                              onActionComplete={this.props.onActionComplete}
          />
        }
        </div>
      </div>
    );
  }
}

module.exports = GroupInvitationStatus;