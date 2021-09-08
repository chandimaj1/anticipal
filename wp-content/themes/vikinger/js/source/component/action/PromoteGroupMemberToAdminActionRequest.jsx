const React = require('react');

const groupUtils = require('../utils/group');

const ActionRequest = require('./ActionRequest');

class PromoteGroupMemberToAdminActionRequest extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false
    };

    this.promoteGroupMemberToAdmin = this.promoteGroupMemberToAdmin.bind(this);
  }

  promoteGroupMemberToAdmin() {
    if (this.state.loading || this.props.locked) {
      return;
    }

    this.props.onActionStart && this.props.onActionStart();

    this.setState({
      loading: true
    });

    const groupable = groupUtils(this.props.loggedUser, this.props.group, this.props.member);

    groupable
    .promoteGroupMemberToAdmin()
    .done((result) => {
      // console.log('PROMOTE GROUP MEMBER TO ADMIN ACTION REQUEST - PROMOTE GROUP MEMBER TO ADMIN REQUEST RESULT: ', result);

      // get updated group data
      this.props.onActionComplete();
    })
    .fail((error) => {
      // console.log('PROMOTE GROUP MEMBER TO ADMIN ACTION REQUEST - PROMOTE GROUP MEMBER TO ADMIN REQUEST ERROR: ', error);

      this.setState({
        loading: false
      });
    });
  }

  render() {
    return (
      <ActionRequest  icon="admin-crown"
                      type="accept"
                      title={vikinger_translation.promote_to_admin}
                      loading={this.state.loading}
                      onClick={this.promoteGroupMemberToAdmin}
      />
    );
  }
}

module.exports = PromoteGroupMemberToAdminActionRequest;