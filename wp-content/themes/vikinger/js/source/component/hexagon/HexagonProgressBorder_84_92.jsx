const React = require('react');

const plugins = require('../../utils/plugins');

class HexagonProgressBorder_84_92 extends React.Component {
  constructor(props) {
    super(props);
    this.hexagonRef = React.createRef();
  }

  componentDidMount() {
    plugins.createHexagon({
      containerElement: this.hexagonRef.current,
      width: 84,
      height: 92,
      lineWidth: 5,
      roundedCorners: true,
      roundedCornerRadius: 3,
      lineColor: vikinger_constants.colors['--color-progressbar-underline']
    });
  }

  render() {
    return (
      <div className="user-avatar-progress-border">
        <div ref={this.hexagonRef} className="hexagon-border-84-92"></div>
      </div>
    );
  }
}

module.exports = HexagonProgressBorder_84_92;