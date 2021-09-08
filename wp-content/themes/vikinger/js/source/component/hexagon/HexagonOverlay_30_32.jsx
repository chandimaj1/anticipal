const React = require('react');
const app = require('../../utils/core');

const plugins = require('../../utils/plugins');

class HexagonOverlay_30_32 extends React.Component {
  constructor(props) {
    super(props);
    this.hexagonRef = React.createRef();
  }

  componentDidMount() {
    plugins.createHexagon({
      containerElement: this.hexagonRef.current,
      width: 30,
      height: 32,
      roundedCorners: true,
      roundedCornerRadius: 1,
      lineColor: app.hexaToRGB(vikinger_constants.colors['--color-secondary'], '.9'),
      fill: true
    });
  }

  render() {
    return (
      <div className="user-avatar-overlay">
        <div ref={this.hexagonRef} className="hexagon-overlay-30-32"></div>
      </div>
    );
  }
}

module.exports = HexagonOverlay_30_32;