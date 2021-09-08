const React = require('react');

const NotificationStatus = require('../user-status/NotificationStatus');

class NotificationBox extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={`notification-box animate-slide-down ${this.props.data.is_new ? 'unread' : ''}`}>
        <NotificationStatus data={this.props.data}
                            selectable={this.props.selectable}
                            selected={this.props.selected}
                            toggleSelectableActive={this.props.toggleSelectableActive}
        />
      </div>
    );
  }
}

module.exports = NotificationBox;