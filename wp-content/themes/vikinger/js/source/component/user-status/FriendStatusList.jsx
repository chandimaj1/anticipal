const React = require('react');

const FriendStatus = require('./FriendStatus');

class FriendStatusList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="user-status-list">
        {
          this.props.data.map((user) => {
            return (
              <FriendStatus key={user.id} data={user} loggedUser={this.props.loggedUser} onActionComplete={this.props.onActionComplete} modifiers={this.props.modifiers} />
            );
          })
        }
      </div>
    );
  }
}

module.exports = FriendStatusList;