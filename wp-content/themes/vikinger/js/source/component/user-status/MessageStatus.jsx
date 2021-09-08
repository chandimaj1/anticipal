const React = require('react');

const app = require('../../utils/core');

const AvatarSmall = require('../avatar/AvatarSmall'),
      BadgeVerified = require('../badge/BadgeVerified'),
      IconSVG = require('../icon/IconSVG');

class MessageStatus extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const messageContent = this.props.ownLastMessage ? `${vikinger_translation.you}: ${this.props.data.content}` : this.props.data.content;

    const displayVerifiedMemberBadge = vikinger_constants.plugin_active['bp-verified-member'] && this.props.data.recipients[0].user.verified;

    return (
      <div className="user-status">
        <AvatarSmall modifiers='user-status-avatar' noBorder noLink data={this.props.data.recipients[0].user} />
          
        <p className="user-status-title">
          {
            this.props.favorite &&
              <IconSVG icon="starred" modifiers="user-status-favorite-icon" />
          }
          <span className="bold">{this.props.data.recipients[0].user.name}</span>
          {
            displayVerifiedMemberBadge &&
              <BadgeVerified />
          }
        </p>
        <p className="user-status-text">{app.truncateText(messageContent, 40)}</p>
        <p className="user-status-timestamp floaty">{this.props.data.timestamp}</p>
      </div>
    );
  }
}

module.exports = MessageStatus;