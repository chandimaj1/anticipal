const React = require('react');

const ProgressBar = require('progressbar.js');

class CircleProgressBar extends React.Component {
  constructor(props) {
    super(props);

    this.progressBarRef = React.createRef();

    this.size = this.props.size || 'regular';
    this.fillAmount = this.props.fillAmount ? Math.min(Math.max(this.props.fillAmount, 0), 1) : 1;

    this.progressBarConfig = {
      small: {
        color: 'url(#vk-avatar-gradient)',
        trailColor: vikinger_constants.colors['--color-progressbar-underline'],
        strokeWidth: 8,
        trailWidth: 8,
        svgStyle: {
          width: '40px',
          height: '40px'
        }
      },
      regular: {
        color: 'url(#vk-avatar-gradient)',
        trailColor: vikinger_constants.colors['--color-progressbar-underline'],
        strokeWidth: 5,
        trailWidth: 5,
        svgStyle: {
          width: '90px',
          height: '90px'
        }
      },
      medium: {
        color: 'url(#vk-avatar-gradient)',
        trailColor: vikinger_constants.colors['--color-progressbar-underline'],
        strokeWidth: 5,
        trailWidth: 5,
        svgStyle: {
          width: '108px',
          height: '108px'
        }
      },
      big: {
        color: 'url(#vk-avatar-gradient)',
        trailColor: vikinger_constants.colors['--color-progressbar-underline'],
        strokeWidth: 6,
        trailWidth: 6,
        svgStyle: {
          width: '134px',
          height: '134px'
        }
      }
    };
  }

  componentDidMount() {
    this.progressBarElement = new ProgressBar.Circle(this.progressBarRef.current, this.progressBarConfig[this.props.size]);

    this.progressBarElement.set(this.fillAmount);
  }

  componentWillUnmount() {
    if (this.progressBarElement) {
      this.progressBarElement.destroy();
    }
  }

  render() {
    return (
      <div ref={this.progressBarRef} className="user-avatar-circle-progress"></div>
    );
  }
}

module.exports = CircleProgressBar;