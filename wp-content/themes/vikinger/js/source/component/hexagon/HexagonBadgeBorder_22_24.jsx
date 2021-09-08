const React = require('react');

const plugins = require('../../utils/plugins');

class HexagonBadgeBorder_22_24 extends React.Component {
  constructor(props) {
    super(props);
    this.hexagonRef = React.createRef();
  }

  componentDidMount() {
    plugins.createHexagon({
      containerElement: this.hexagonRef.current,
      width: 22,
      height: 24,
      roundedCorners: true,
      roundedCornerRadius: 1,
      fill: true,
      lineColor: vikinger_constants.colors['--color-box-background']
    });
  }

  render() {
    return (
      <div className="user-avatar-badge-border">
        <div ref={this.hexagonRef} className="hexagon-22-24"></div>
      </div>
    );
  }
}

module.exports = HexagonBadgeBorder_22_24;