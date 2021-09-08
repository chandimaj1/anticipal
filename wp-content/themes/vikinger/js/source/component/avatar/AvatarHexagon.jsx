const React = require('react');

const HexagonBorder_100_110 = require('../hexagon/HexagonBorder_100_110'),
      HexagonImage_82_90 = require('../hexagon/HexagonImage_82_90'),
      HexagonImage_68_74 = require('../hexagon/HexagonImage_68_74'),
      HexagonProgress_84_92 = require('../hexagon/HexagonProgress_84_92'),
      HexagonProgressBorder_84_92 = require('../hexagon/HexagonProgressBorder_84_92'),
      HexagonBadge_22_24 = require('../hexagon/HexagonBadge_22_24'),
      HexagonBadgeBorder_28_32 = require('../hexagon/HexagonBadgeBorder_28_32');

class AvatarHexagon extends React.Component {
  constructor(props) {
    super(props);

    this.noBorderClasses = this.props.noBorder ? 'no-border' : '';
  }

  render() {
    const Element = this.props.noLink || !vikinger_constants.plugin_active.buddypress ? 'div' : 'a';
    
    return (
      <Element  className={`user-avatar ${!this.props.data.rank ? 'no-stats' : ''} ${this.props.noBorder && this.props.data.rank ? 'no-outline' : ''} ${this.noBorderClasses} ${this.props.modifiers || ''}`}
                {...(!this.props.noLink ? { href: this.props.data.link } : {})}
      >
      {
        !this.props.noBorder &&
          <HexagonBorder_100_110 />
      }

      {
        !this.props.data.rank &&
          <HexagonImage_82_90 imageURL={this.props.data.avatar_url} />
      }

      {
        this.props.data.rank &&
          <React.Fragment>
            <HexagonImage_68_74 imageURL={this.props.data.avatar_url} />
            <HexagonProgress_84_92 data={this.props.data.rank} />
            <HexagonProgressBorder_84_92 />
            <div className="user-avatar-badge">
              <HexagonBadgeBorder_28_32 />
              <HexagonBadge_22_24 />
              <p className="user-avatar-badge-text">{this.props.data.rank.current}</p>
            </div>
          </React.Fragment>
      }
      </Element>
    );
  }
}

module.exports = AvatarHexagon;