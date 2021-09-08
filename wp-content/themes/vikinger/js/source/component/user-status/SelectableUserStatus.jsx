const React = require('react');

const AvatarSmall = require('../avatar/AvatarSmall'),
      BadgeVerified = require('../badge/BadgeVerified'),
      Checkbox = require('../form/Checkbox');

class SelectableUserStatus extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const displayVerifiedMemberBadge = vikinger_constants.plugin_active['bp-verified-member'] && this.props.data.verified;

    return (
      <div className="user-status user-status-selectable">
        <Checkbox active={this.props.selected} toggleActive={this.props.toggleSelectableActive} />

        <AvatarSmall modifiers='user-status-avatar' noBorder noLink data={this.props.data} />
          
        <p className="user-status-title">
          <span className="bold">{this.props.data.name}</span>
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
      </div>
    );
  }
}

module.exports = SelectableUserStatus;