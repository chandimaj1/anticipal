const React = require('react');

class Grid_3 extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="grid grid-3-3-3-3 centered-on-mobile">
        {this.props.content}
      </div>
    );
  }
}

module.exports = Grid_3;