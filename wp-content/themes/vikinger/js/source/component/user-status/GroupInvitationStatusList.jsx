const React = require('react');

const GroupInvitationStatus = require('./GroupInvitationStatus');

class GroupInvitationStatusList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="user-status-list">
        {
          this.props.data.map((invitation) => {
            return (
              <GroupInvitationStatus  key={invitation.id}
                                      data={invitation}
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

module.exports = GroupInvitationStatusList;