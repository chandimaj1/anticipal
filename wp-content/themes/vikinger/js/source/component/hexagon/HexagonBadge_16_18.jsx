const React = require('react');

const plugins = require('../../utils/plugins');

class HexagonBadge_16_18 extends React.Component {
  constructor(props) {
    super(props);
    this.hexagonRef = React.createRef();
  }

  componentDidMount() {
    plugins.createHexagon({
      containerElement: this.hexagonRef.current,
      width: 16,
      height: 18,
      roundedCorners: true,
      roundedCornerRadius: 1,
      fill: true,
      lineColor: vikinger_constants.colors['--color-avatar-rank-hexagon']
    });
  }

  render() {
    return (
      <div className="user-avatar-badge-content">
        <div ref={this.hexagonRef} className="hexagon-dark-16-18"></div>
      </div>
    );
  }
}

module.exports = HexagonBadge_16_18;