const React = require('react');

class FormInputRadioList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: props.value
    };

    this.handleChange = this.handleChange.bind(this);

    // console.log('FORM INPUT RADIO LIST - PROPS: ', props);
    // console.log('FORM INPUT RADIO LIST - STATE: ', this.state);
  }

  handleChange(e) {
    // console.log('FORM INPUT RADIO LIST - HANDLE CHANGE: ', e.target.name, e.target.value);

    this.setState({
      value: e.target.value
    }, () => {
      // console.log('FORM INPUT RADIO LIST - AFTER HANDLE CHANGE STATE: ', this.state);
  
      this.props.onChange(this.state.value);
    })
  }

  render() {
    return (
      <div className="form-input-list">
        <p className="form-input-list-title">{this.props.label}</p>

        {/* FORM INPUT LIST ITEMS */}
        <div className="form-input-list-items">
        {
          this.props.options.map((radio) => {
            return (
              <div key={radio.id} className="checkbox-wrap small">
                <label htmlFor={radio.name}>{radio.name}</label>
                <input  type="radio"
                        id={radio.name}
                        name={this.props.name}
                        value={radio.name}
                        checked={this.state.value === radio.name}
                        onChange={this.handleChange}
                />
                <div className="checkbox-box small round"></div>
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

module.exports = FormInputRadioList;