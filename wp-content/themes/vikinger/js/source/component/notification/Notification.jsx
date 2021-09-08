const React = require('react');

const IconSVG = require('../icon/IconSVG');

class Notification extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="notification-section animate-slide-down">
        <IconSVG  icon="no-results"
                  modifiers="notification-section-icon"
        />

        <p className="notification-section-title">{this.props.title}</p>
        <p className="notification-section-text">{this.props.text}</p>
      </div>
    );
  }
}

module.exports = Notification;