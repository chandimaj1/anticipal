const React = require('react');

class FormInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      [this.props.name]: this.props.value || '',
      active: this.props.value ? true : false
    };

    this.inputRef = React.createRef();

    this.onChange = this.onChange.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }

  blurInput(value) {
    if (value === '') {
      this.setState({
        active: false
      });
    }
  }

  focusInput() {
    this.setState({
      active: true
    });
  }

  onFocus(e) {
    this.focusInput();
  }

  onBlur(e) {
    this.blurInput(e.target.value);
  }

  onChange(e) {
    this.setState({
      [this.props.name]: e.target.value
    }, () => {
      if (this.props.onChange) {
        if (this.props.handleValue) {
          this.props.onChange({target: {name: this.props.name, value: this.state[this.props.name]}});
        } else {
          this.props.onChange(this.state[this.props.name]);
        }
      }
    });
  }

  componentDidUpdate(prevProps) {
    // handling input value and value changed
    if (this.props.handleValue && (prevProps.value !== this.props.value)) {
      // if input isn't focused, blur it
      if (this.inputRef.current !== document.activeElement) {
        this.focusInput();
        this.blurInput(this.props.value);
      }
    }
  }

  render() {
    return (
      <div className={`form-input ${this.props.modifiers || ''} ${this.state.active ? 'active' : ''} ${this.props.markAsRequired ? 'required' : ''}`}>
        <label htmlFor={this.props.name}>{this.props.label} {this.props.required && <span className="label-required">*</span>}</label>
        <input  ref={this.inputRef}
                type="text"
                className={`${this.props.error ? 'input-error' : ''} ${this.props.disabled ? 'input-disabled' : ''}`}
                name={this.props.name}
                value={this.state[this.props.name]}
                onChange={this.onChange}
                onFocus={this.onFocus}
                onBlur={this.onBlur}
                disabled={this.props.disabled}
        />
      </div>
    );
  }
}

module.exports = FormInput;