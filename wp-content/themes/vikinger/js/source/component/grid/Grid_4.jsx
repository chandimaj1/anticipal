const React = require('react');

class Grid_4 extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="grid grid-4-4-4 centered-on-mobile">
        {this.props.content}
      </div>
    );
  }
}

module.exports = Grid_4;