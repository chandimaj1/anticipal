const React = require('react');

const IconSVG = require('../icon/IconSVG');

class Checkbox extends React.Component {
  constructor(props){
    super(props);
  }

  render() {
    return (
      <div className={`checkbox-box ${this.props.modifiers || ''} ${this.props.active ? 'active' : ''}`} onClick={this.props.toggleActive}>
        <IconSVG icon="cross" />
      </div>
    );
  }
}

module.exports = Checkbox;