const React = require('react');

class Tag extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <a className="tag-item secondary" href={this.props.link}>{this.props.name}</a>
    );
  }
}

module.exports = Tag;