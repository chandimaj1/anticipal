const React = require('react');

const NotificationBox = require('./NotificationBox');

class NotificationBoxList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="notification-box-list">
      {
        this.props.data.map((notification, i) => {
          return (
            <NotificationBox  key={notification.id}
                              data={notification}
                              selectable={this.props.selectable}
                              selected={this.props.selectedItems[i]}
                              toggleSelectableActive={() => {this.props.toggleSelectableActive(i);}}
            />
          );
        })
      }
      </div>
    );
  }
}

module.exports = NotificationBoxList;