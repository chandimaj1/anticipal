const React = require('react');

const plugins = require('../../utils/plugins');

const IconSVG = require('../icon/IconSVG');

class Button extends React.Component {
  constructor(props) {
    super(props);

    this.tooltipRef = React.createRef();
  }

  componentDidMount() {
    if (this.props.title) {
      plugins.createTooltip({
        containerElement: this.tooltipRef.current,
        offset: 4,
        direction: 'top',
        animation: {
          type: 'translate-out-fade'
        }
      });
    }
  }

  render() {
    return (
      <a  ref={this.tooltipRef}
          className={`button ${this.props.modifiers || ''} ${this.props.icon && !this.props.text ? 'with-only-icon' : ''}`}
          {...(this.props.title ? {'data-title': this.props.title} : {})}
          href={this.props.link}
      >
        {
          this.props.icon &&
            <IconSVG modifiers="button-icon" icon={this.props.icon} />
        }
        {this.props.text}
      </a>
    );
  }
}

module.exports = Button;