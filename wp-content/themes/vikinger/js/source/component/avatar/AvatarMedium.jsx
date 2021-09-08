const React = require('react');

const AvatarMediumHexagon = require('./AvatarMediumHexagon'),
      AvatarMediumCircle = require('./AvatarMediumCircle'),
      AvatarMediumSquare = require('./AvatarMediumSquare');

class AvatarMedium extends React.Component {
  constructor(props) {
    super(props);

    const avatarType = vikinger_constants.settings.avatar_type;

    this.AvatarElement;

    switch (avatarType) {
      case 'hexagon':
        this.AvatarElement = AvatarMediumHexagon;
        break;
      case 'circle':
        this.AvatarElement = AvatarMediumCircle;
        break;
      case 'square':
        this.AvatarElement = AvatarMediumSquare;
        break;
      default:
        this.AvatarElement = AvatarMediumHexagon;
    }
  }

  render() {
    return (
      <this.AvatarElement {...this.props} />
    );
  }
}

module.exports = AvatarMedium;