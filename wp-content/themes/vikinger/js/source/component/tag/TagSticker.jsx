const React = require('react');

const plugins = require('../../utils/plugins');

const IconSVG = require('../icon/IconSVG');

class TagSticker extends React.Component {
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
      <div  ref={this.tooltipRef}
            className={`tag-sticker ${this.props.modifiers || ''}`}
            {...(this.props.title ? {'data-title': this.props.title} : {})}
      >
      {
        this.props.icon &&
          <IconSVG  icon={this.props.icon}
                    modifiers={`tag-sticker-icon ${this.props.iconModifiers || ''} ${this.props.text ? 'spaced' : ''}`}
          />
      }
      {this.props.text}
      </div>
    );
  }
}

module.exports = TagSticker;