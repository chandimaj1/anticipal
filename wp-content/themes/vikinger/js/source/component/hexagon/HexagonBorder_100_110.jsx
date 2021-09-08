const React = require('react');

const plugins = require('../../utils/plugins');

class HexagonBorder_100_110 extends React.Component {
  constructor(props) {
    super(props);
    this.hexagonRef = React.createRef();
  }

  componentDidMount() {
    plugins.createHexagon({
      containerElement: this.hexagonRef.current,
      width: 100,
      height: 110,
      roundedCorners: true,
      fill: true,
      lineColor: vikinger_constants.colors['--color-box-background']
    });
  }

  render() {
    return (
      <div className="user-avatar-border">
        <div ref={this.hexagonRef} className="hexagon-100-110"></div>
      </div>
    );
  }
}

module.exports = HexagonBorder_100_110;