const React = require('react');

const groupUtils = require('../utils/group');

const ActionRequest = require('./ActionRequest');

class LeaveGroupActionRequest extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false
    };

    this.leaveGroup = this.leaveGroup.bind(this);
  }

  leaveGroup() {
    if (this.state.loading) {
      return;
    }

    this.setState({
      loading: true
    });

    const groupable = groupUtils(this.props.loggedUser, this.props.group);

    groupable.leaveGroup((result) => {
      // console.log('LEAVE GROUP ACTION REQUEST - LEAVE GROUP RESULT: ', result);
      // if friend added successfully
      if (result) {
        // get updated user friend data
        this.props.onActionComplete();
      } else {
        this.setState({
          loading: false
        });
      }
    });
  }

  render() {
    return (
      <ActionRequest icon="leave-group" type="decline" title={vikinger_translation.leave_group} loading={this.state.loading} onClick={this.leaveGroup} />
    );
  }
}

module.exports = LeaveGroupActionRequest;