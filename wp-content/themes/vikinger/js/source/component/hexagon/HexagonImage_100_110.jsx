const React = require('react');

const plugins = require('../../utils/plugins');

class HexagonImage_100_110 extends React.Component {
  constructor(props) {
    super(props);
    this.hexagonRef = React.createRef();
  }

  componentDidMount() {
    plugins.createHexagon({
      containerElement: this.hexagonRef.current,
      width: 100,
      height: 110,
      roundedCorners: true,
      clip: true
    });
  }

  render() {
    return (
      <div className="user-avatar-content">
        <div ref={this.hexagonRef} className="hexagon-image-100-110" data-src={this.props.imageURL}></div>
      </div>
    );
  }
}

module.exports = HexagonImage_100_110;