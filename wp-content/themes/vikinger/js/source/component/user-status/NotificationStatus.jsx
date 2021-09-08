const React = require('react');

const AvatarSmall = require('../avatar/AvatarSmall'),
      BadgeVerified = require('../badge/BadgeVerified'),
      IconSVG = require('../icon/IconSVG'),
      Checkbox = require('../form/Checkbox');

class NotificationStatus extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let statusIcon = 'comment';

    if (this.props.data.component === 'friends') {
      statusIcon = 'friend';
    }

    if (this.props.data.component === 'groups') {
      statusIcon = 'group';
    }

    if (this.props.data.component === 'messages') {
      statusIcon = 'messages';
    }

    if (this.props.data.component === 'forums') {
      statusIcon = 'forums';
    }

    const displayVerifiedMemberBadge = vikinger_constants.plugin_active['bp-verified-member'] && this.props.data.user && this.props.data.user.verified;

    return (
      <div className="user-status notification">
      {
        this.props.data.user &&
          <AvatarSmall modifiers='user-status-avatar' noBorder data={this.props.data.user} />
      }
        
      {
        !this.props.data.user && this.props.data.group &&
          <AvatarSmall modifiers='user-status-avatar' noBorder data={this.props.data.group} />
      }
          
        <p className="user-status-title">
        {
          this.props.data.user &&
            <React.Fragment>
              <a className="bold" href={this.props.data.user.link}>{this.props.data.user.name}</a>
              {
                displayVerifiedMemberBadge &&
                  <BadgeVerified />
              }
            </React.Fragment>
        }
          <span dangerouslySetInnerHTML={{__html: ` ${this.props.data.description}`}}></span>
        </p>
        <p className="user-status-timestamp">{this.props.data.timestamp}</p>

        <IconSVG icon={statusIcon} modifiers='user-status-icon' />

        {
          this.props.selectable &&
            <Checkbox active={this.props.selected} modifiers="small" toggleActive={this.props.toggleSelectableActive} />
        }
      </div>
    );
  }
}

module.exports = NotificationStatus;