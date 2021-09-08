const React = require('react');

const ProgressBar = require('progressbar.js');

class SquareProgressBar extends React.Component {
  constructor(props) {
    super(props);

    this.linePathRef = React.createRef();

    this.size = this.props.size || 'regular';
    this.fillAmount = this.props.fillAmount ? Math.min(Math.max(this.props.fillAmount, 0), 1) : 1;

    this.svgConfig = {
      small: {
        width: 40,
        strokeWidth: 8
      },
      regular: {
        width: 90,
        strokeWidth: 5
      },
      medium: {
        width: 108,
        strokeWidth: 5
      },
      big: {
        width: 134,
        strokeWidth: 6
      }
    };
  }

  componentDidMount() {
    this.progressBarElement = new ProgressBar.Path(this.linePathRef.current);

    this.progressBarElement.set(this.fillAmount);
  }

  render() {
    return (
      <svg viewBox="0 0 100 100" width={this.svgConfig[this.size].width}>
        <path fillOpacity="0"
              strokeWidth={this.svgConfig[this.size].strokeWidth}
              stroke={vikinger_constants.colors['--color-progressbar-underline']}
              d="M 0,2 L 98,2 L 98,98 L 2,98 L 2,4"
        />
        <path ref={this.linePathRef}
              fillOpacity="0"
              strokeWidth={this.svgConfig[this.size].strokeWidth}
              stroke="url(#vk-avatar-gradient)"
              d="M 0,2 L 98,2 L 98,98 L 2,98 L 2,4"
        />
      </svg>
    );
  }
}

module.exports = SquareProgressBar;