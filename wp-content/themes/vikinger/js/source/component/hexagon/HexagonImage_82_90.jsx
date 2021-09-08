const React = require('react');

const plugins = require('../../utils/plugins');

class HexagonImage_82_90 extends React.Component {
  constructor(props) {
    super(props);

    this.hexagonRef = React.createRef();

    this.hexagon = false;
  }

  componentDidMount() {
    this.hexagon = plugins.createHexagon({
      containerElement: this.hexagonRef.current,
      width: 82,
      height: 90,
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
        <div ref={this.hexagonRef} className="hexagon-image-82-90" data-src={this.props.imageURL}></div>
      </div>
    );
  }
}

module.exports = HexagonImage_82_90;