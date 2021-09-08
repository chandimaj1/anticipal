const React = require('react');

const plugins = require('../../utils/plugins');

class HexagonProgress_40_44 extends React.Component {
  constructor(props) {
    super(props);

    this.hexagonRef = React.createRef();

    this.hexagon = false;
  }

  componentDidMount() {
    this.hexagon = plugins.createHexagon({
      containerElement: this.hexagonRef.current,
      width: 40,
      height: 44,
      lineWidth: 3,
      roundedCorners: true,
      roundedCornerRadius: 1,
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

  componentDidUpdate(prevProps) {
    if (prevProps.data !== this.props.data) {
      // redraw hexagon
      this.hexagon.redrawProgress({
        start: 0,
        end: this.props.data.total,
        stop: this.props.data.current
      });
    }
  }

  render() {
    return (
      <div className="user-avatar-progress">
        <div ref={this.hexagonRef} className="hexagon-progress-40-44"></div>
      </div>
    );
  }
}

module.exports = HexagonProgress_40_44;