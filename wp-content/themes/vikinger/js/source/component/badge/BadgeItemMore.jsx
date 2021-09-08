const React = require('react');

class BadgeItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <a className="badge-item badge-item-more" href={this.props.more_link}>
        <img src={`${vikinger_constants.vikinger_url}/img/badge/blank-s.png`} alt="badge-blank-s" />
        <p className="badge-item-text">+{this.props.more_count}</p>
      </a>
    );
  }
}

module.exports = BadgeItem;