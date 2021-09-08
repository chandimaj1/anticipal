const React = require('react');

class Grid extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="grid">
        {this.props.content}
      </div>
    );
  }
}

module.exports = Grid;