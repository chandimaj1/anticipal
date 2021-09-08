const React = require('react');

const app = require('../../utils/core');

const AvatarSmall = require('../avatar/AvatarSmall'),
      BadgeVerified = require('../badge/BadgeVerified'),
      IconSVG = require('../icon/IconSVG');

class SearchStatus extends React.Component {
  constructor(props) {
    super(props);

    this.statusTitle = '';
    this.statusText = '';
    this.statusIcon = '';

    if (props.type === 'user') {
      this.statusTitle = props.data.name;
      this.statusText = `@${props.data.mention_name}`;

      this.statusIcon = 'friend';
    }

    if (props.type === 'group') {
      this.statusTitle = props.data.name;
      const membersText = props.data.total_member_count === 1 ? vikinger_translation.member : vikinger_translation.members; 
      this.statusText = `${props.data.total_member_count} ${membersText.toLowerCase()}`;

      this.statusIcon = 'group';
    }

    if (props.type === 'post') {
      this.statusTitle = app.truncateText(props.data.title, 60);
      this.statusText = `${vikinger_translation.by} ${props.data.author.name}`;

      this.statusIcon = 'blog-posts';

      this.postCoverStyle = props.data.cover_url_thumb ? {background: `url(${props.data.cover_url_thumb}) center center / cover no-repeat`} : {};

      this.format = props.data.format ? props.data.format : 'standard';
      this.supportedFormats = ['standard', 'video', 'audio', 'gallery'];
      this.supportedFormatsIcons = {
        standard: 'blog-posts',
        video: 'videos',
        audio: 'headphones',
        gallery: 'gallery'
      };
      this.postFormatIcon = this.supportedFormats.includes(this.format) ? this.supportedFormatsIcons[this.format] : this.supportedFormatsIcons.standard;
    }
  }

  render() {
    const displayVerifiedMemberBadge =  vikinger_constants.plugin_active['bp-verified-member'] && (this.props.type === 'user') && this.props.data.verified,
          displayVerifiedMemberBadgeInUsername = displayVerifiedMemberBadge && vikinger_constants.settings.bp_verified_member_display_badge_in_profile_username,
          displayVerifiedMemberBadgeInFullname = displayVerifiedMemberBadge && vikinger_constants.settings.bp_verified_member_display_badge_in_profile_fullname;

    return (
      <div className="user-status notification">
      {
        (this.props.type === 'user' || this.props.type === 'group') &&
          <AvatarSmall  modifiers='user-status-avatar'
                        noBorder
                        noLink
                        data={this.props.data}
          />
      }
      {
        this.props.type === 'post' &&
          <React.Fragment>
          {
            this.props.data.cover_url &&
              <div className="user-status-avatar picture small round" style={this.postCoverStyle}></div>
          }
          {
            !this.props.data.cover_url &&
              <div className="post-format-tag">
                <IconSVG modifiers="post-format-tag-icon" icon={this.postFormatIcon} />
              </div>
          }
          </React.Fragment>
      }
          
        <p className="user-status-title">
          <span className="bold">{this.statusTitle}</span>
          {
            displayVerifiedMemberBadgeInFullname &&
              <BadgeVerified />
          }
        </p>
        <p className="user-status-text">{this.statusText}
        {
          displayVerifiedMemberBadgeInUsername &&
            <BadgeVerified />
        }
        </p>

        <IconSVG  icon={this.statusIcon}
                  modifiers='user-status-icon'
        />
      </div>
    );
  }
}

module.exports = SearchStatus;