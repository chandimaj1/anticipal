const React = require('react');

const groupUtils = require('../utils/group');

const ActionRequest = require('./ActionRequest');

class RemoveGroupMemberActionRequest extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false
    };

    this.removeGroupMember = this.removeGroupMember.bind(this);
  }

  removeGroupMember() {
    if (this.state.loading || this.props.locked) {
      return;
    }

    this.props.onActionStart && this.props.onActionStart();

    this.setState({
      loading: true
    });

    const groupable = groupUtils(this.props.loggedUser, this.props.group, this.props.member);

    groupable
    .removeGroupMember()
    .done((result) => {
      // console.log('REMOVE GROUP MEMBER ACTION REQUEST - REMOVE GROUP MEMBER REQUEST RESULT: ', result);

      // get updated group data
      this.props.onActionComplete();
    })
    .fail((error) => {
      // console.log('REMOVE GROUP MEMBER ACTION REQUEST - REMOVE GROUP MEMBER REQUEST ERROR: ', error);

      this.setState({
        loading: false
      });
    });
  }

  render() {
    return (
      <ActionRequest  icon="remove-user"
                      type="decline"
                      title={vikinger_translation.remove_member}
                      loading={this.state.loading}
                      onClick={this.removeGroupMember}
      />
    );
  }
}

module.exports = RemoveGroupMemberActionRequest;