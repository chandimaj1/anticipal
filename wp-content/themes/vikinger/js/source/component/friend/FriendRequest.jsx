const React = require('react');

const FriendStatus = require('../user-status/FriendStatus');

class FriendRequest extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="notification-box">
        <FriendStatus data={this.props.data}
                      loggedUser={this.props.loggedUser}
                      modifiers="request"
                      onActionComplete={this.props.onActionComplete}
                      allowReject={true}
        />
      </div>
    );
  }
}

module.exports = FriendRequest;