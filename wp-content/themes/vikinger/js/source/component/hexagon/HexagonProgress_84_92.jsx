const React = require('react');

const plugins = require('../../utils/plugins');

class HexagonProgress_84_92 extends React.Component {
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
        <div ref={this.hexagonRef} className="hexagon-progress-84-92"></div>
      </div>
    );
  }
}

module.exports = HexagonProgress_84_92;