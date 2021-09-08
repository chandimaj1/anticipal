const React = require('react');

const app = require('../../utils/core');

const TagSticker = require('../tag/TagSticker');

const Avatar = require('../avatar/Avatar'),
      AvatarSmall = require('../avatar/AvatarSmall'),
      BadgeVerified = require('../badge/BadgeVerified');

class ActivityGroup extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const memberCountText = this.props.data.group.total_member_count === 1 ? vikinger_translation.member : vikinger_translation.members;

    const displayVerified = vikinger_constants.plugin_active['bp-verified-member'] && vikinger_constants.settings.bp_verified_member_display_badge_in_activity_stream,
          displayVerifiedMemberBadge = displayVerified && this.props.data.author.verified;

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
              <span dangerouslySetInnerHTML={{__html: ` ${this.props.data.action}`}}></span>
            </p>

            <p className="user-status-text small">{this.props.data.timestamp}</p>
          </div>
  
          {/* USER PREVIEW WIDGET */}
          <div className="user-preview-widget">
            <a href={this.props.data.group.link}>
              <div className="user-preview-widget-cover" style={{background: `url('${this.props.data.group.cover_image_url}') center center / cover no-repeat`}}></div>
            </a>

            <TagSticker icon={this.props.data.group.status} />

            <div className="user-short-description small">
              <Avatar modifiers='user-short-description-avatar' data={this.props.data.group} />
        
              <p className="user-short-description-title"><a href={this.props.data.group.link}>{this.props.data.group.name}</a></p>
              <p className="user-short-description-text"><a href={this.props.data.group.link}>&#64;{(app.joinText(this.props.data.group.name)).toLowerCase()}</a></p>
            </div>

            {/* USER PREVIEW WIDGET FOOTER */}
            <div className="user-preview-widget-footer">
              {/* USER PREVIEW WIDGET FOOTER ACTION */}
              <div className="user-preview-widget-footer-action"></div>
              {/* USER PREVIEW WIDGET FOOTER ACTION */}

              {/* USER STATS */}
              <div className="user-stats">
                <div className="user-stat">
                  <p className="user-stat-title">{this.props.data.group.total_member_count}</p>
                  <p className="user-stat-text">{memberCountText}</p>
                </div>
              </div>
              {/* USER STATS */}
            </div>
            {/* USER PREVIEW WIDGET FOOTER */}
          </div>
          {/* USER PREVIEW WIDGET */}
        </div>
      </div>
    );
  }
}

module.exports = ActivityGroup;