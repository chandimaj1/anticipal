const React = require('react');

const plugins = require('../../utils/plugins');

class HexagonBorder_50_56 extends React.Component {
  constructor(props) {
    super(props);
    this.hexagonRef = React.createRef();
  }

  componentDidMount() {
    plugins.createHexagon({
      containerElement: this.hexagonRef.current,
      width: 50,
      height: 56,
      roundedCorners: true,
      roundedCornerRadius: 2,
      fill: true,
      lineColor: vikinger_constants.colors['--color-box-background']
    });
  }

  render() {
    return (
      <div className="user-avatar-border">
        <div ref={this.hexagonRef} className="hexagon-50-56"></div>
      </div>
    );
  }
}

module.exports = HexagonBorder_50_56;