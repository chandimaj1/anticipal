const React = require('react');

const plugins = require('../../utils/plugins');

class HexagonImage_40_44 extends React.Component {
  constructor(props) {
    super(props);
    this.hexagonRef = React.createRef();
  }

  componentDidMount() {
    plugins.createHexagon({
      containerElement: this.hexagonRef.current,
      width: 40,
      height: 44,
      roundedCorners: true,
      roundedCornerRadius: 1,
      clip: true
    });
  }

  render() {
    return (
      <div className="user-avatar-content">
        <div ref={this.hexagonRef} className="hexagon-image-40-44" data-src={this.props.imageURL}></div>
      </div>
    );
  }
}

module.exports = HexagonImage_40_44;