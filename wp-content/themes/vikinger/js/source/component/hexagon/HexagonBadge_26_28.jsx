const React = require('react');

const plugins = require('../../utils/plugins');

class HexagonBadge_26_28 extends React.Component {
  constructor(props) {
    super(props);
    this.hexagonRef = React.createRef();
  }

  componentDidMount() {
    plugins.createHexagon({
      containerElement: this.hexagonRef.current,
      width: 26,
      height: 28,
      roundedCorners: true,
      roundedCornerRadius: 1,
      fill: true,
      lineColor: vikinger_constants.colors['--color-avatar-rank-hexagon']
    });
  }

  render() {
    return (
      <div className="user-avatar-badge-content">
        <div ref={this.hexagonRef} className="hexagon-dark-26-28"></div>
      </div>
    );
  }
}

module.exports = HexagonBadge_26_28;