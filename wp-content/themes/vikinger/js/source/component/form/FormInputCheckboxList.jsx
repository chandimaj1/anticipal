const React = require('react');

const app = require('../../utils/core');

const IconSVG = require('../icon/IconSVG');

class FormInputCheckboxList extends React.Component {
  constructor(props) {
    super(props);

    const initialOptions = {};

    for (const option of props.options) {
      initialOptions[option.name] = props.value.includes(option.name);
    }

    this.state = {
      options: initialOptions
    };

    this.handleChange = this.handleChange.bind(this);

    // console.log('FORM INPUT CHECKBOX LIST - PROPS: ', props);
    // console.log('FORM INPUT CHECKBOX LIST - STATE: ', this.state);
  }

  handleChange(e) {
    // console.log('FORM INPUT CHECKBOX LIST - HANDLE CHANGE: ', e.target.name, e.target.checked);

    e.persist();

    this.setState((state, props) => {
      const options = app.deepMerge(state.options);

      options[e.target.name] = e.target.checked;

      return {
        options: options
      }
    }, () => {
      const checkboxValue = this.generateCheckboxValue();
  
      // console.log('FORM INPUT CHECKBOX LIST - AFTER HANDLE CHANGE STATE: ', this.state);
      // console.log('FORM INPUT CHECKBOX LIST - AFTER HANDLE CHANGE VALUE: ', checkboxValue);
  
      this.props.onChange(checkboxValue);
    });
  }

  generateCheckboxValue() {
    const values = [];

    for (const option in this.state.options) {
      if (this.state.options[option]) {
        values.push(option);
      }
    }

    if (values.length === 0) {
      return '';
    }

    return values;
  }

  render() {
    return (
      <div className="form-input-list">
        <p className="form-input-list-title">{this.props.label}</p>

        {/* FORM INPUT LIST ITEMS */}
        <div className="form-input-list-items">
        {
          this.props.options.map((checkbox) => {
            return (
              <div key={checkbox.id} className="checkbox-wrap small">
                <label htmlFor={checkbox.name}>{checkbox.name}</label>
                <input  type="checkbox"
                        id={checkbox.name}
                        name={checkbox.name}
                        checked={this.state.options[checkbox.name]}
                        onChange={this.handleChange}
                />
                <div className="checkbox-box small">
                  <IconSVG  icon="cross"
                            modifiers="form-input-checkbox-box-icon"
                  />
                </div>
              </div>
            );
          })
        }
        </div>
        {/* FORM INPUT LIST ITEMS */}
      </div>
    );
  }
}

module.exports = FormInputCheckboxList;