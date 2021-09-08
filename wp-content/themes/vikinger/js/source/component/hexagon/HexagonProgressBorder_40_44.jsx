const React = require('react');

const plugins = require('../../utils/plugins');

class HexagonProgressBorder_40_44 extends React.Component {
  constructor(props) {
    super(props);
    this.hexagonRef = React.createRef();
  }

  componentDidMount() {
    plugins.createHexagon({
      containerElement: this.hexagonRef.current,
      width: 40,
      height: 44,
      lineWidth: 3,
      roundedCorners: true,
      roundedCornerRadius: 1,
      lineColor: vikinger_constants.colors['--color-progressbar-underline']
    });
  }

  render() {
    return (
      <div className="user-avatar-progress-border">
        <div ref={this.hexagonRef} className="hexagon-border-40-44"></div>
      </div>
    );
  }
}

module.exports = HexagonProgressBorder_40_44;