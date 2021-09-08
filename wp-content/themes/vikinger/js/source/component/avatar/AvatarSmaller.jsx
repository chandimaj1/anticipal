const React = require('react');

const AvatarSmallerHexagon = require('./AvatarSmallerHexagon'),
      AvatarSmallerCircle = require('./AvatarSmallerCircle'),
      AvatarSmallerSquare = require('./AvatarSmallerSquare');

class AvatarSmaller extends React.Component {
  constructor(props) {
    super(props);

    const avatarType = vikinger_constants.settings.avatar_type;

    this.AvatarElement;

    switch (avatarType) {
      case 'hexagon':
        this.AvatarElement = AvatarSmallerHexagon;
        break;
      case 'circle':
        this.AvatarElement = AvatarSmallerCircle;
        break;
      case 'square':
        this.AvatarElement = AvatarSmallerSquare;
        break;
      default:
        this.AvatarElement = AvatarSmallerHexagon;
    }
  }

  render() {
    return (
      <this.AvatarElement {...this.props} />
    );
  }
}

module.exports = AvatarSmaller;