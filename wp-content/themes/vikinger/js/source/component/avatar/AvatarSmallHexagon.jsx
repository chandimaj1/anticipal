const React = require('react');

const HexagonBorder_50_56 = require('../hexagon/HexagonBorder_50_56'),
      HexagonImage_40_44 = require('../hexagon/HexagonImage_40_44'),
      HexagonImage_30_32 = require('../hexagon/HexagonImage_30_32'),
      HexagonProgress_40_44 = require('../hexagon/HexagonProgress_40_44'),
      HexagonProgressBorder_40_44 = require('../hexagon/HexagonProgressBorder_40_44'),
      HexagonBadge_16_18 = require('../hexagon/HexagonBadge_16_18'),
      HexagonBadgeBorder_22_24 = require('../hexagon/HexagonBadgeBorder_22_24');

class AvatarSmallHexagon extends React.Component {
  constructor(props) {
    super(props);

    this.noBorderClasses = this.props.noBorder ? 'no-border' : '';
  }

  render() {
    const Element = this.props.noLink || !vikinger_constants.plugin_active.buddypress ? 'div' : 'a';
    
    return (
      <Element  className={`user-avatar small ${!this.props.data.rank ? 'no-stats' : ''} ${this.props.noBorder && this.props.data.rank ? 'no-outline' : ''} ${this.noBorderClasses} ${this.props.modifiers || ''}`}
                {...(!this.props.noLink ? { href: this.props.data.link } : {})}
      >
      {
        !this.props.noBorder &&
          <HexagonBorder_50_56 />
      }

      {
        !this.props.data.rank &&
          <HexagonImage_40_44 imageURL={this.props.data.avatar_url} />
      }

      {
        this.props.data.rank &&
          <React.Fragment>
            <HexagonImage_30_32 imageURL={this.props.data.avatar_url} />
            <HexagonProgress_40_44 data={this.props.data.rank} />
            <HexagonProgressBorder_40_44 />
            <div className="user-avatar-badge">
              <HexagonBadgeBorder_22_24 />
              <HexagonBadge_16_18 />
              <p className="user-avatar-badge-text">{this.props.data.rank.current}</p>
            </div>
          </React.Fragment>
      }
      </Element>
    );
  }
}

module.exports = AvatarSmallHexagon;