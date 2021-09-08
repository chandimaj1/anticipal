const React = require('react');

const plugins = require('../../utils/plugins');

class HexagonProgress_100_110 extends React.Component {
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
      gradient: {
        colors: [vikinger_constants.colors['--color-progressbar-line-gradient-end'], vikinger_constants.colors['--color-progressbar-line-gradient-start']]
      },
      scale: {
        start: 0,
        end: this.props.data.total,
        stop: this.props.data.current
      }
    });
  }

  render() {
    return (
      <div className="user-avatar-progress">
        <div ref={this.hexagonRef} className="hexagon-progress-100-110"></div>
      </div>
    );
  }
}

module.exports = HexagonProgress_100_110;