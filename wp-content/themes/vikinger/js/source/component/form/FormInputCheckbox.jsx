const React = require('react');

const Checkbox = require('./Checkbox');

class FormInputCheckbox extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="form-input-checkbox">
        <Checkbox active={this.props.active} toggleActive={this.props.toggleActive} />

        <p className="form-input-checkbox-text" onClick={this.props.toggleActive}>{this.props.text}</p>
      </div>
    );
  }
}

module.exports = FormInputCheckbox;