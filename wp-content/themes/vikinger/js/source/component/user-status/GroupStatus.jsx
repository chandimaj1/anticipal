const React = require('react');

const groupUtils = require('../utils/group');

const AvatarSmall = require('../avatar/AvatarSmall'),
      JoinGroupActionRequest = require('../action/JoinGroupActionRequest'),
      LeaveGroupActionRequest = require('../action/LeaveGroupActionRequest'),
      TagSticker = require('../tag/TagSticker');

class GroupStatus extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      rejecting: false,
      accepting: false
    };

    this.accepting = this.accepting.bind(this);
    this.rejecting = this.rejecting.bind(this);
  }

  rejecting() {
    this.setState({
      rejecting: true
    });
  }

  accepting() {
    this.setState({
      accepting: true
    });
  }

  onActionComplete() {
    this.props.onActionComplete(() => {
      this.setState({
        rejecting: false,
        accepting: false
      });
    });
  }

  render() {
    const groupable = groupUtils(this.props.loggedUser, this.props.data);

    const memberCountText = this.props.data.total_member_count === 1 ? vikinger_translation.member : vikinger_translation.members;

    return (
      <div className={`user-status ${this.props.modifiers || ''}`}>
        <AvatarSmall modifiers='user-status-avatar' noBorder data={this.props.data} />
          
        <p className="user-status-title"><a className="bold" href={this.props.data.link}>{this.props.data.name}</a></p>
        <p className="user-status-text small">{this.props.data.total_member_count} {memberCountText.toLowerCase()}</p>

        <div className="action-request-list">
        {
          this.props.loggedUser && groupable.isBannedFromGroup() &&
            <TagSticker modifiers="tertiary"
                        icon="ban"
                        title={vikinger_translation.banned}
                        iconModifiers="white"
            />
        }
        {
          this.props.loggedUser && groupable.isGroupPublic() && !groupable.isGroupMember() && !groupable.isBannedFromGroup() &&
            <JoinGroupActionRequest group={this.props.data}
                                    loggedUser={this.props.loggedUser}
                                    onActionComplete={this.props.onActionComplete}
            />
        }

        {
          this.props.loggedUser && !groupable.isGroupCreator() && !groupable.isLastGroupMember() && groupable.isGroupMember() &&
            <LeaveGroupActionRequest  group={this.props.data}
                                      loggedUser={this.props.loggedUser}
                                      onActionComplete={this.props.onActionComplete}
            />
        }
        </div>
      </div>
    );
  }
}

module.exports = GroupStatus;