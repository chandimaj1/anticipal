const React = require('react');

const IconSVG = require('../icon/IconSVG');

class AlertLine extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={`alert-line alert-line-${this.props.type}`}>
        <IconSVG  icon={this.props.type}
                  modifiers="alert-line-icon"
        />
        <p className="alert-line-text"><span className="bold">{this.props.title}</span> {this.props.text}</p>
      </div>
    );
  }
}

module.exports = AlertLine;