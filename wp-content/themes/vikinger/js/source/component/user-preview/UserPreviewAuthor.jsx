const React = require('react');

const AvatarMicro = require('../avatar/AvatarMicro'),
      BadgeVerified = require('../badge/BadgeVerified');

class UserPreviewAuthor extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const displayVerifiedMemberBadge = vikinger_constants.plugin_active['bp-verified-member'] && this.props.data.verified;

    return (
      <div className="user-preview-author">
        <AvatarMicro  data={this.props.data}
                      modifiers="user-preview-author-image"
                      noBorder
        />

        <p className="user-preview-author-title">{this.props.title || vikinger_translation.invited_by}</p>
        <p className="user-preview-author-text">
          <a href={this.props.data.link}>{this.props.data.name}</a>
          {
            displayVerifiedMemberBadge &&
              <BadgeVerified />
          }
        </p>
      </div>
    );
  }
}

module.exports = UserPreviewAuthor;