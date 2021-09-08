const React = require('react');

const HexagonBorder_22_24 = require('../hexagon/HexagonBorder_22_24'),
      HexagonImage_18_20 = require('../hexagon/HexagonImage_18_20');

class AvatarMicroHexagon extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const Element = this.props.noLink ? 'div' : 'a';
    
    return (
      <Element  className={`user-avatar micro no-stats ${this.props.noBorder ? 'no-border' : ''} ${this.props.modifiers || ''}`}
                {...(!this.props.noLink ? { href: this.props.data.link } : {})}
      >
        {
          !this.props.noBorder &&
            <HexagonBorder_22_24 />
        }
        <HexagonImage_18_20 imageURL={this.props.data.avatar_url} />
      </Element>
    );
  }
}

module.exports = AvatarMicroHexagon;