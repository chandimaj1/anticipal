const React = require('react');

const plugins = require('../../utils/plugins');

class HexagonProgressBorder_100_110 extends React.Component {
  constructor(props) {
    super(props);
    this.hexagonRef = React.createRef();
  }

  componentDidMount() {
    plugins.createHexagon({
      containerElement: this.hexagonRef.current,
      width: 100,
      height: 110,
      lineWidth: 6,
      roundedCorners: true,
      lineColor: vikinger_constants.colors['--color-progressbar-underline']
    });
  }

  render() {
    return (
      <div className="user-avatar-progress-border">
        <div ref={this.hexagonRef} className="hexagon-border-100-110"></div>
      </div>
    );
  }
}

module.exports = HexagonProgressBorder_100_110;