const React = require('react');

const groupUtils = require('../utils/group');

const ActionRequest = require('./ActionRequest');

class DemoteGroupMemberToMemberActionRequest extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false
    };

    this.demoteGroupMemberToMember = this.demoteGroupMemberToMember.bind(this);
  }

  demoteGroupMemberToMember() {
    if (this.state.loading || this.props.locked) {
      return;
    }

    this.props.onActionStart && this.props.onActionStart();

    this.setState({
      loading: true
    });

    const groupable = groupUtils(this.props.loggedUser, this.props.group, this.props.member);

    groupable
    .demoteGroupMemberToMember()
    .done((result) => {
      // console.log('DEMOTE GROUP MEMBER TO MEMBER ACTION REQUEST - DEMOTE GROUP MEMBER TO MEMBER REQUEST RESULT: ', result);

      // get updated group data
      this.props.onActionComplete();
    })
    .fail((error) => {
      // console.log('DEMOTE GROUP MEMBER TO MEMBER ACTION REQUEST - DEMOTE GROUP MEMBER TO MEMBER REQUEST ERROR: ', error);

      this.setState({
        loading: false
      });
    });
  }

  render() {
    return (
      <ActionRequest  icon="members"
                      type="decline"
                      title={vikinger_translation.demote_to_member}
                      loading={this.state.loading}
                      onClick={this.demoteGroupMemberToMember}
      />
    );
  }
}

module.exports = DemoteGroupMemberToMemberActionRequest;