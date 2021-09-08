const React = require('react');

const AvatarSmallHexagon = require('./AvatarSmallHexagon'),
      AvatarSmallCircle = require('./AvatarSmallCircle'),
      AvatarSmallSquare = require('./AvatarSmallSquare');

class AvatarSmall extends React.Component {
  constructor(props) {
    super(props);

    const avatarType = vikinger_constants.settings.avatar_type;

    this.AvatarElement;

    switch (avatarType) {
      case 'hexagon':
        this.AvatarElement = AvatarSmallHexagon;
        break;
      case 'circle':
        this.AvatarElement = AvatarSmallCircle;
        break;
      case 'square':
        this.AvatarElement = AvatarSmallSquare;
        break;
      default:
        this.AvatarElement = AvatarSmallHexagon;
    }
  }

  render() {
    return (
      <this.AvatarElement {...this.props} />
    );
  }
}

module.exports = AvatarSmall;