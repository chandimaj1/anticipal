const React = require('react');

class Grid_6 extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="grid grid-6-6 centered">
        {this.props.content}
      </div>
    );
  }
}

module.exports = Grid_6;