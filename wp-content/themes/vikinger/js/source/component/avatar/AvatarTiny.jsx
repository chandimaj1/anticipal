const React = require('react');

const AvatarTinyHexagon = require('./AvatarTinyHexagon'),
      AvatarTinyCircle = require('./AvatarTinyCircle'),
      AvatarTinySquare = require('./AvatarTinySquare');

class AvatarTiny extends React.Component {
  constructor(props) {
    super(props);

    const avatarType = vikinger_constants.settings.avatar_type;

    this.AvatarElement;

    switch (avatarType) {
      case 'hexagon':
        this.AvatarElement = AvatarTinyHexagon;
        break;
      case 'circle':
        this.AvatarElement = AvatarTinyCircle;
        break;
      case 'square':
        this.AvatarElement = AvatarTinySquare;
        break;
      default:
        this.AvatarElement = AvatarTinyHexagon;
    }
  }

  render() {
    return (
      <this.AvatarElement {...this.props} />
    );
  }
}

module.exports = AvatarTiny;