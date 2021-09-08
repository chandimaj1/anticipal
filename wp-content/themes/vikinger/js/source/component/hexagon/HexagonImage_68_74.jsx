const React = require('react');

const plugins = require('../../utils/plugins');

class HexagonImage_68_74 extends React.Component {
  constructor(props) {
    super(props);

    this.hexagonRef = React.createRef();

    this.hexagon = false;
  }

  componentDidMount() {
    this.hexagon = plugins.createHexagon({
      containerElement: this.hexagonRef.current,
      width: 68,
      height: 74,
      roundedCorners: true,
      roundedCornerRadius: 3,
      clip: true
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.imageURL !== this.props.imageURL) {
      // redraw hexagon
      this.hexagon.redrawImages();
    }
  }

  render() {
    return (
      <div className="user-avatar-content">
        <div ref={this.hexagonRef} className="hexagon-image-68-74" data-src={this.props.imageURL}></div>
      </div>
    );
  }
}

module.exports = HexagonImage_68_74;