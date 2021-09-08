const React = require('react');

const GroupStatus = require('./GroupStatus');

class GroupStatusList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="user-status-list">
        {
          this.props.data.map((group) => {
            return (
              <GroupStatus key={group.id} data={group} loggedUser={this.props.loggedUser} onActionComplete={this.props.onActionComplete} modifiers={this.props.modifiers} />
            );
          })
        }
      </div>
    );
  }
}

module.exports = GroupStatusList;