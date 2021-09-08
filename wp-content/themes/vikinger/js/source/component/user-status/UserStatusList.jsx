const React = require('react');

const UserStatus = require('./UserStatus');

class UserStatusList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="user-status-list">
        {
          this.props.data.map((user) => {
            return (
              <UserStatus key={user.id} data={user} showVerifiedBadge={this.props.showVerifiedBadge} />
            );
          })
        }
      </div>
    );
  }
}

module.exports = UserStatusList;