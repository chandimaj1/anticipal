const React = require('react');

const AvatarSmall = require('../avatar/AvatarSmall'),
      BadgeVerified = require('../badge/BadgeVerified');

class UserStatus extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const displayVerifiedMemberBadge = vikinger_constants.plugin_active['bp-verified-member'] && this.props.showVerifiedBadge && this.props.data.verified;

    return (
      <div className="user-status request-small">
        <AvatarSmall modifiers='user-status-avatar' noBorder data={this.props.data} />
          
        <p className="user-status-title">
          <a className="bold" href={this.props.data.link}>{this.props.data.name}</a>
        {
          displayVerifiedMemberBadge && vikinger_constants.settings.bp_verified_member_display_badge_in_profile_fullname &&
            <BadgeVerified />
        }
        </p>
        <p className="user-status-text small">&#64;{this.props.data.mention_name}
        {
          displayVerifiedMemberBadge && vikinger_constants.settings.bp_verified_member_display_badge_in_profile_username &&
            <BadgeVerified />
        }
        </p>

        <div className="action-request-list">
          <img className="user-status-reaction-image" src={this.props.data.reaction.image_url} alt={`reaction-${this.props.data.reaction.name}`} />
        </div>
      </div>
    );
  }
}

module.exports = UserStatus;