const React = require('react');

const FormRow = require('../form/FormRow');

class SettingsWidget extends React.Component {
  constructor(props) {
    super(props);

    const formRows = [];
    
    let i = 0,
        formItems = [];

    for (const field of this.props.data.fields) {
      if (i === 2) {
        formRows.push(formItems);
        i = 0;
        formItems = [];
      }

      formItems.push(field);
      i++;
    }

    // dump remaining fields
    if (formItems.length > 0) {
      formRows.push(formItems);
    }

    this.formRows = formRows;

    // console.log('SETTINGS WIDGET - DATA: ', this.props.data);
  }

  render() {
    return (
      <div className="widget-box">
        {/* WIDGET BOX TITLE */}
        <p className="widget-box-title">{this.props.data.name}</p>
        {/* WIDGET BOX TITLE */}

        {/* WIDGET BOX CONTENT */}
        <div className="widget-box-content">
          {/* FORM */}
          <div className="form">
            {
              this.formRows.map((formItems, i) => {
                return (
                  <FormRow  key={i}
                            data={formItems}
                            modifiers="split"
                            onFieldUpdate={this.props.onFieldUpdate}
                  />
                );
              })
            }
          </div>
          {/* FORM */}
        </div>
        {/* WIDGET BOX CONTENT */}
      </div>
    );
  }
}

module.exports = SettingsWidget;