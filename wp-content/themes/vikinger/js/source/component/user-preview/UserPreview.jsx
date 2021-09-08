const React = require('react');

const Avatar = require('../avatar/Avatar');

const IconSVG = require('../icon/IconSVG');

class UserPreview extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="user-preview small fixed-height">
        {/* USER PREVIEW COVER */}
        <div className="user-preview-cover" style={{background: `url('${this.props.data.cover_url}') center center /  cover no-repeat`}}>
        {
          this.props.actionableCover &&
            <div className="uploadable-item-remove-button" onClick={this.props.onCoverActionClick}>
              <IconSVG  icon="cross"
                        modifiers="uploadable-item-remove-button-icon"
              />
            </div>
        }
        </div>
        {/* USER PREVIEW COVER */}
      
        {/* USER PREVIEW INFO */}
        <div className="user-preview-info">
        {
          this.props.actionableAvatar &&
            <div className="uploadable-item-remove-button" onClick={this.props.onAvatarActionClick}>
              <IconSVG  icon="cross"
                        modifiers="uploadable-item-remove-button-icon"
              />
            </div>
        }
          <div className="user-short-description small">
            <Avatar data={this.props.data}
                    modifiers="user-short-description-avatar"
                    noLink
            />
          </div>
        </div>
        {/* USER PREVIEW INFO */}
      </div>
    );
  }
}

module.exports = UserPreview;