const React = require('react');

const friendUtils = require('../utils/friend');

const ButtonLink = require('../button/ButtonLink');

const Avatar = require('../avatar/Avatar'),
      BadgeVerified = require('../badge/BadgeVerified'),
      AvatarSmall = require('../avatar/AvatarSmall');

class ActivityFriend extends React.Component {
  constructor(props) {
    super(props);

    this.friendable = false;
  }

  render() {
    if (this.props.user) {
      this.friendable = friendUtils(this.props.user, this.props.data.friend.id);
    }

    const displayVerified = vikinger_constants.plugin_active['bp-verified-member'] && vikinger_constants.settings.bp_verified_member_display_badge_in_activity_stream,
          displayVerifiedMemberBadge = displayVerified && this.props.data.author.verified,
          displayVerifiedMemberFriendBadge = displayVerified && this.props.data.friend.verified,
          displayVerifiedMemberFriendBadgeInUsername = displayVerifiedMemberFriendBadge && vikinger_constants.settings.bp_verified_member_display_badge_in_profile_username,
          displayVerifiedMemberFriendBadgeInFullname = displayVerifiedMemberFriendBadge && vikinger_constants.settings.bp_verified_member_display_badge_in_profile_fullname;

    return (
      <div ref={this.props.widgetBoxStatusRef} className="widget-box-status">
        <div className="widget-box-status-content">
          <div className="user-status">
            <div className="user-status-avatar">
              <AvatarSmall noBorder data={this.props.data.author} />
            </div>
        
            <p className="user-status-title medium">
              <a href={this.props.data.author.link}>{this.props.data.author.name}</a>
              {
                displayVerifiedMemberBadge &&
                  <BadgeVerified />
              }
              {` ${vikinger_translation.and}`}
              <a href={this.props.data.friend.link}>{` ${this.props.data.friend.name}`}</a>
              {
                displayVerifiedMemberFriendBadge &&
                  <BadgeVerified />
              }
              <span dangerouslySetInnerHTML={{__html: ` ${this.props.data.action}`}}></span>
            </p>

            <p className="user-status-text small">{this.props.data.timestamp}</p>
          </div>
  
          {/* USER PREVIEW WIDGET */}
          <div className="user-preview-widget">
            <a href={this.props.data.friend.link}>
              <div className="user-preview-widget-cover" style={{background: `url('${this.props.data.friend.cover_url}') center center / cover no-repeat`}}></div>
            </a>

            <div className="user-short-description small">
              <Avatar modifiers='user-short-description-avatar' data={this.props.data.friend} />
        
              <p className="user-short-description-title">
                <a href={this.props.data.friend.link}>{this.props.data.friend.name}</a>
                {
                  displayVerifiedMemberFriendBadgeInFullname &&
                    <BadgeVerified />
                }
              </p>
              <p className="user-short-description-text">
                <a href={this.props.data.friend.link}>&#64;{this.props.data.friend.mention_name}</a>
                {
                  displayVerifiedMemberFriendBadgeInUsername &&
                    <BadgeVerified />
                }
              </p>
            </div>

            {/* USER PREVIEW WIDGET FOOTER */}
            <div className="user-preview-widget-footer">
              {/* USER PREVIEW WIDGET FOOTER ACTION */}
              <div className="user-preview-widget-footer-action"></div>
              {/* USER PREVIEW WIDGET FOOTER ACTION */}

              {/* USER PREVIEW WIDGET FOOTER ACTION */}
              <div className="user-preview-widget-footer-action">
              {
                vikinger_constants.plugin_active.buddypress_messages && this.props.user && (this.props.user.id !== this.props.data.friend.id) && this.friendable.isFriend() &&
                  <ButtonLink modifiers="primary"
                              title={vikinger_translation.send_message}
                              icon="messages"
                              link={`${this.props.user.messages_link}?user_id=${this.props.data.friend.id}`}
                  />
              }
              </div>
              {/* USER PREVIEW WIDGET FOOTER ACTION */}
            </div>
            {/* USER PREVIEW WIDGET FOOTER */}
          </div>
          {/* USER PREVIEW WIDGET */}
        </div>
      </div>
    );
  }
}

module.exports = ActivityFriend;