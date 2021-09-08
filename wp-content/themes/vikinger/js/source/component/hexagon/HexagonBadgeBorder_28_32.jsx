const React = require('react');

const plugins = require('../../utils/plugins');

class HexagonBadgeBorder_28_32 extends React.Component {
  constructor(props) {
    super(props);
    this.hexagonRef = React.createRef();
  }

  componentDidMount() {
    plugins.createHexagon({
      containerElement: this.hexagonRef.current,
      width: 28,
      height: 32,
      roundedCorners: true,
      roundedCornerRadius: 1,
      fill: true,
      lineColor: vikinger_constants.colors['--color-box-background']
    });
  }

  render() {
    return (
      <div className="user-avatar-badge-border">
        <div ref={this.hexagonRef} className="hexagon-28-32"></div>
      </div>
    );
  }
}

module.exports = HexagonBadgeBorder_28_32;