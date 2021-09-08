const React = require('react');

const HexagonBorder_120_130 = require('../hexagon/HexagonBorder_120_130'),
      HexagonImage_82_90 = require('../hexagon/HexagonImage_82_90'),
      HexagonImage_100_110 = require('../hexagon/HexagonImage_100_110'),
      HexagonProgress_100_110 = require('../hexagon/HexagonProgress_100_110'),
      HexagonProgressBorder_100_110 = require('../hexagon/HexagonProgressBorder_100_110'),
      HexagonBadge_26_28 = require('../hexagon/HexagonBadge_26_28'),
      HexagonBadgeBorder_32_36 = require('../hexagon/HexagonBadgeBorder_32_36');

class AvatarMediumHexagon extends React.Component {
  constructor(props) {
    super(props);

    this.noBorderClasses = this.props.noBorder ? 'no-border' : '';
  }

  render() {
    const Element = this.props.noLink || !vikinger_constants.plugin_active.buddypress ? 'div' : 'a';
    
    return (
      <Element  className={`user-avatar medium ${!this.props.data.rank ? 'no-stats' : ''} ${this.props.noBorder && this.props.data.rank ? 'no-outline' : ''} ${this.noBorderClasses} ${this.props.modifiers || ''}`}
                {...(!this.props.noLink ? { href: this.props.data.link } : {})}
      >
      {
        !this.props.noBorder &&
          <HexagonBorder_120_130 />
      }

      {
        !this.props.data.rank &&
          <HexagonImage_100_110 imageURL={this.props.data.avatar_url} />
      }

      {
        this.props.data.rank &&
          <React.Fragment>
            <HexagonImage_82_90 imageURL={this.props.data.avatar_url} />
            <HexagonProgress_100_110 data={this.props.data.rank} />
            <HexagonProgressBorder_100_110 />
            <div className="user-avatar-badge">
              <HexagonBadgeBorder_32_36 />
              <HexagonBadge_26_28 />
              <p className="user-avatar-badge-text">{this.props.data.rank.current}</p>
            </div>
          </React.Fragment>
      }
      </Element>
    );
  }
}

module.exports = AvatarMediumHexagon;