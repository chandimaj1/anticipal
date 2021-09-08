const React = require('react');

const IconSVG = require('../icon/IconSVG');

class FormInputInteractive extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      [this.props.name]: this.props.value || '',
      active: this.props.value ? true : false
    };

    this.onChange = this.onChange.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.resetInput = this.resetInput.bind(this);
  }

  resetInput() {
    this.setState({
      [this.props.name]: '',
      active: false
    }, () => {
      if (this.props.onReset) {
        this.props.onReset(this.state[this.props.name]);
      }
    });
  }

  onFocus(e) {
    this.setState({
      active: true
    });
  }

  onBlur(e) {
    if (e.target.value === '') {
      this.setState({
        active: false
      });
    }
  }

  onChange(e) {
    this.setState({
      [this.props.name]: e.target.value
    }, () => {
      if (this.props.onChange) {
        this.props.onChange(this.state[this.props.name]);
      }
    });
  }

  render() {
    return (
      <div className={`interactive-input ${this.props.modifiers || ''} ${this.state.active ? 'active' : ''}`}>
        <input  type="text"
                name={this.props.name}
                placeholder={this.props.placeholder}
                value={this.state[this.props.name]}
                onChange={this.onChange}
                onFocus={this.onFocus}
                onBlur={this.onBlur}
        />

        {
          (this.state[this.props.name] === '') &&
            <div className="interactive-input-icon-wrap">
              <IconSVG icon="magnifying-glass" modifiers="interactive-input-icon" />
            </div>
        }

        {
          (this.state[this.props.name] !== '') &&
            <div className="interactive-input-action" onClick={this.resetInput}>
              <IconSVG icon="cross-thin" modifiers="interactive-input-action-icon" />
            </div>
        }
      </div>
    );
  }
}

module.exports = FormInputInteractive;