const React = require('react');

class VideoPreview extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="video-wrap">
        <video src={this.props.src} controls disablePictureInPicture controlsList="nodownload"></video>
      </div>
    );
  }
}

module.exports = VideoPreview;