const React = require('react');

const xprofileUtils = require('../utils/xprofile');

const FormInput = require('../form/FormInput'),
      FormInputURL = require('../form/FormInputURL'),
      FormTextarea = require('../form/FormTextarea'),
      FormDatepicker = require('../form/FormDatepicker'),
      FormInputCheckboxList = require('../form/FormInputCheckboxList'),
      FormInputRadioList = require('../form/FormInputRadioList'),
      FormInputSelect = require('../form/FormInputSelect');

class FormRow extends React.Component {
  constructor(props) {
    super(props);

    this.xprofiler = xprofileUtils();
  }

  render() {
    return (
      <div className={`form-row ${this.props.modifiers || ''}`}>
        {
          this.props.data.map((field) => {
            let Input = FormInput,
                icon = this.xprofiler.getURLIcon(field.name),
                modifiers = 'small';

            if (field.type === 'textarea') {
              Input = FormTextarea;
              modifiers += ' mid-textarea';
            } else if (field.type === 'datebox') {
              Input = FormDatepicker;
            } else if (field.type === 'url') {
              Input = FormInputURL;
            } else if (field.type === 'checkbox') {
              Input = FormInputCheckboxList;
            } else if (field.type === 'radio') {
              Input = FormInputRadioList;
            } else if (field.type === 'selectbox') {
              Input = FormInputSelect;
            }

            return (
              <div key={field.name} className="form-item">
                <Input  label={field.name}
                        name={field.name.toLowerCase()}
                        value={field.value}
                        meta={field.meta}
                        options={field.options}
                        icon={icon}
                        modifiers={modifiers}
                        handleValue={this.props.handleValue}
                        onChange={(data) => {this.props.onFieldUpdate(field, data);}}
                />
              </div>
            );
          })
        }
      </div>
    );
  }
}

module.exports = FormRow;