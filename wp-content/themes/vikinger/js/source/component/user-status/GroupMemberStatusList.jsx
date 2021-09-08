const React = require('react');

const GroupMemberStatus = require('./GroupMemberStatus');

class GroupMemberStatusList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="user-status-list">
        {
          this.props.data.map((user) => {
            return (
              <GroupMemberStatus  key={user.id}
                                  data={user}
                                  group={this.props.group}
                                  loggedUser={this.props.loggedUser}
                                  onActionComplete={this.props.onActionComplete}
                                  modifiers={this.props.modifiers}
              />
            );
          })
        }
      </div>
    );
  }
}

module.exports = GroupMemberStatusList;