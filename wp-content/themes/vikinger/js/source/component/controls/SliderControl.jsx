const React = require('react');

const IconSVG = require('../icon/IconSVG');

class SliderControl extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.props.controlClicked();
  }

  render() {
    return (
      <div className={`slider-control ${this.props.direction} ${this.props.disabled ? 'disabled' : ''}`} onClick={this.handleClick}>
        <IconSVG  icon="small-arrow"
                  modifiers="slider-control-icon"
        />

      {
        this.props.double &&
          <IconSVG  icon="small-arrow"
                    modifiers="slider-control-icon"
          />
      }
      </div>
    );
  }
}

module.exports = SliderControl;