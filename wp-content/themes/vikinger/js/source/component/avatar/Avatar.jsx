const React = require('react');

const AvatarHexagon = require('./AvatarHexagon'),
      AvatarCircle = require('./AvatarCircle'),
      AvatarSquare = require('./AvatarSquare');

class Avatar extends React.Component {
  constructor(props) {
    super(props);

    const avatarType = vikinger_constants.settings.avatar_type;

    this.AvatarElement;

    switch (avatarType) {
      case 'hexagon':
        this.AvatarElement = AvatarHexagon;
        break;
      case 'circle':
        this.AvatarElement = AvatarCircle;
        break;
      case 'square':
        this.AvatarElement = AvatarSquare;
        break;
      default:
        this.AvatarElement = AvatarHexagon;
    }
  }

  render() {
    return (
      <this.AvatarElement {...this.props} />
    );
  }
}

module.exports = Avatar;