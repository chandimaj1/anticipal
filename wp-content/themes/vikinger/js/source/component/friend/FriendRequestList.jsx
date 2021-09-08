const React = require('react');

const FriendRequest = require('./FriendRequest');

class FriendRequestList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="notification-box-list">
      {
        this.props.data.map((friendRequest) => {
          return (
            <FriendRequest  key={friendRequest.id}
                            data={friendRequest.user}
                            loggedUser={this.props.loggedUser}
                            onActionComplete={this.props.onActionComplete}
            />
          );
        })
      }
      </div>
    );
  }
}

module.exports = FriendRequestList;