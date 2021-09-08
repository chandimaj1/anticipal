const React = require('react');

const IconSVG = require('../icon/IconSVG');

class MediaLinkPreview extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={`media-link-preview ${this.props.disabled ? 'disabled' : ''}`}>
        {/* MEDIA LINK PREVIEW CLOSE BUTTON */}
        <div className="media-link-preview-close-button" onClick={this.props.onCloseButtonClick}>
          <IconSVG  icon="cross"
                    modifiers="media-link-preview-close-button-icon"
          />
        </div>
        {/* MEDIA LINK PREVIEW CLOSE BUTTON */}

        {/* IFRAME WRAP */}
        <div className="iframe-wrap">
          <iframe src={this.props.iframeSrc} allowFullScreen></iframe>
        </div>
        {/* IFRAME WRAP */}
      </div>
    );
  }
}

module.exports = MediaLinkPreview;