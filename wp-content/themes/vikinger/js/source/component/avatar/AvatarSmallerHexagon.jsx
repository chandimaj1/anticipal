const React = require('react');

const HexagonBorder_34_36 = require('../hexagon/HexagonBorder_34_36'),
      HexagonImage_30_32 = require('../hexagon/HexagonImage_30_32');

class AvatarSmallerHexagon extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const Element = this.props.noLink ? 'div' : 'a';
    
    return (
      <Element  className={`user-avatar smaller no-stats ${this.props.noBorder ? 'no-border' : ''} ${this.props.modifiers || ''}`}
                {...(!this.props.noLink ? { href: this.props.data.link } : {})}
      >
        {
          !this.props.noBorder &&
            <HexagonBorder_34_36 />
        }
        <HexagonImage_30_32 imageURL={this.props.data.avatar_url} />
      </Element>
    );
  }
}

module.exports = AvatarSmallerHexagon;