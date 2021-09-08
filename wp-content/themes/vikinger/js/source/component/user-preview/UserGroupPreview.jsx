const React = require('react');

const Avatar = require('../avatar/Avatar'),
      TagSticker = require('../tag/TagSticker');

class UserGroupPreview extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="user-preview small">
        {/* USER PREVIEW COVER */}
        <div className="user-preview-cover" style={{background: `url('${this.props.data.cover_image_url}') center center /  cover no-repeat`}}></div>
        {/* USER PREVIEW COVER */}
      
        {/* USER PREVIEW INFO */}
        <div className="user-preview-info">
          <TagSticker icon={this.props.data.status} />

          {/* USER SHORT DESCRIPTION */}
          <div className="user-short-description small">
            <Avatar data={this.props.data}
                    modifiers="user-short-description-avatar"
                    noLink
            />

            <p className="user-short-description-title small">{this.props.data.name}</p>
            <p className="user-short-description-text regular">{this.props.descriptionText}</p>
          </div>
          {/* USER SHORT DESCRIPTION */}
        </div>
        {/* USER PREVIEW INFO */}
      </div>
    );
  }
}

module.exports = UserGroupPreview;