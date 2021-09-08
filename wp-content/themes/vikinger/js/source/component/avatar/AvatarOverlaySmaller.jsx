const React = require('react');

const AvatarOverlaySmallerHexagon = require('./AvatarOverlaySmallerHexagon'),
      AvatarOverlaySmallerCircle = require('./AvatarOverlaySmallerCircle'),
      AvatarOverlaySmallerSquare = require('./AvatarOverlaySmallerSquare');

class AvatarOverlaySmaller extends React.Component {
  constructor(props) {
    super(props);

    const avatarType = vikinger_constants.settings.avatar_type;

    this.AvatarElement;

    switch (avatarType) {
      case 'hexagon':
        this.AvatarElement = AvatarOverlaySmallerHexagon;
        break;
      case 'circle':
        this.AvatarElement = AvatarOverlaySmallerCircle;
        break;
      case 'square':
        this.AvatarElement = AvatarOverlaySmallerSquare;
        break;
      default:
        this.AvatarElement = AvatarOverlaySmallerHexagon;
    }
  }

  render() {
    return (
      <this.AvatarElement {...this.props} />
    );
  }
}

module.exports = AvatarOverlaySmaller;