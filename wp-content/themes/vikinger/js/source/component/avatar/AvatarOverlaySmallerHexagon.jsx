const React = require('react');

const HexagonBorder_34_36 = require('../hexagon/HexagonBorder_34_36'),
      HexagonImage_30_32 = require('../hexagon/HexagonImage_30_32'),
      HexagonOverlay_30_32 = require('../hexagon/HexagonOverlay_30_32');

class AvatarOverlaySmallerHexagon extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const Element = this.props.noLink ? 'div' : 'a';
    
    return (
      <Element  className={`user-avatar smaller no-stats ${this.props.modifiers || ''}`}
                {...(!this.props.noLink ? { href: this.props.link } : {})}
      >
        <HexagonBorder_34_36 />
        <HexagonImage_30_32 imageURL={this.props.data.avatar_url} />
        <HexagonOverlay_30_32 />

        <div className="user-avatar-overlay-content">
          <p className="user-avatar-overlay-content-text">+{this.props.count}</p>
        </div>
      </Element>
    );
  }
}

module.exports = AvatarOverlaySmallerHexagon;