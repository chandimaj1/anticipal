const React = require('react');

const AvatarMicroHexagon = require('./AvatarMicroHexagon'),
      AvatarMicroCircle = require('./AvatarMicroCircle'),
      AvatarMicroSquare = require('./AvatarMicroSquare');

class AvatarMicro extends React.Component {
  constructor(props) {
    super(props);

    const avatarType = vikinger_constants.settings.avatar_type;

    this.AvatarElement;

    switch (avatarType) {
      case 'hexagon':
        this.AvatarElement = AvatarMicroHexagon;
        break;
      case 'circle':
        this.AvatarElement = AvatarMicroCircle;
        break;
      case 'square':
        this.AvatarElement = AvatarMicroSquare;
        break;
      default:
        this.AvatarElement = AvatarMicroHexagon;
    }
  }

  render() {
    return (
      <this.AvatarElement {...this.props} />
    );
  }
}

module.exports = AvatarMicro;