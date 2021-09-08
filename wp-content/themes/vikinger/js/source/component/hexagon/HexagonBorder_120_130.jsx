const React = require('react');

const plugins = require('../../utils/plugins');

class HexagonBorder_120_130 extends React.Component {
  constructor(props) {
    super(props);
    this.hexagonRef = React.createRef();
  }

  componentDidMount() {
    plugins.createHexagon({
      containerElement: this.hexagonRef.current,
      width: 120,
      height: 130,
      roundedCorners: true,
      fill: true,
      lineColor: vikinger_constants.colors['--color-box-background']
    });
  }

  render() {
    return (
      <div className="user-avatar-border">
        <div ref={this.hexagonRef} className="hexagon-120-130"></div>
      </div>
    );
  }
}

module.exports = HexagonBorder_120_130;