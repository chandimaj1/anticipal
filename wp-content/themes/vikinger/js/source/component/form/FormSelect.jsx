const React = require('react');

const IconSVG = require('../icon/IconSVG');

class FormSelect extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      [this.props.name]: this.props.value || ''
    };

    this.onChange = this.onChange.bind(this);
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

  render() {
    return (
      <div className={`form-select ${this.props.markAsRequired ? 'required' : ''}`}>
        <label htmlFor={this.props.name}>{this.props.label} {this.props.required && <span className="label-required">*</span>}</label>
        <select name={this.props.name}
                value={this.state[this.props.name]}
                onChange={this.onChange}
        >
        {
          this.props.options.map((option) => {
            return (
              <option key={option.id} value={option.id}>{option.name}</option>
            );
          })
        }
        </select>

        <IconSVG icon="small-arrow" modifiers="form-select-icon" />
      </div>
    );
  }
}

module.exports = FormSelect;