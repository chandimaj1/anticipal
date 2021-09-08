const React = require('react');

const IconSVG = require('../icon/IconSVG');

class FormInputSelect extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: props.value
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.setState({
      value: e.target.value
    }, () => {
      this.props.onChange(this.state.value);
    });
  }

  render() {
    return (
      <div className={`form-select ${this.props.is_required ? 'required' : ''}`}>
        <label htmlFor={this.props.name}>{this.props.label} {this.props.is_required && <span className="label-required">*</span>}</label>
        <select name={this.props.name}
                value={this.state.value}
                onChange={this.handleChange}
        >
          <option value="">{vikinger_translation.select_an_option}</option>
        {
          this.props.options.map((option) => {
            return (
              <option key={option.id} value={option.name}>{option.name}</option>
            );
          })
        }
        </select>

        <IconSVG icon="small-arrow" modifiers="form-select-icon" />
      </div>
    );
  }
}

module.exports = FormInputSelect;