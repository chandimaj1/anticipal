const React = require('react');

const groupUtils = require('../utils/group');

const ActionRequest = require('./ActionRequest');

class UnbanGroupMemberActionRequest extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false
    };

    this.unbanGroupMember = this.unbanGroupMember.bind(this);
  }

  unbanGroupMember() {
    if (this.state.loading || this.props.locked) {
      return;
    }

    this.props.onActionStart && this.props.onActionStart();

    this.setState({
      loading: true
    });

    const groupable = groupUtils(this.props.loggedUser, this.props.group, this.props.member);

    groupable
    .unbanGroupMember()
    .done((result) => {
      // console.log('UNBAN GROUP MEMBER ACTION REQUEST - UNBAN GROUP MEMBER REQUEST RESULT: ', result);

      // get updated group data
      this.props.onActionComplete();
    })
    .fail((error) => {
      // console.log('UNBAN GROUP MEMBER ACTION REQUEST - UNBAN GROUP MEMBER REQUEST ERROR: ', error);

      this.setState({
        loading: false
      });
    });
  }

  render() {
    return (
      <ActionRequest  icon="ban"
                      type="accept"
                      title={vikinger_translation.unban_member}
                      loading={this.state.loading}
                      onClick={this.unbanGroupMember}
      />
    );
  }
}

module.exports = UnbanGroupMemberActionRequest;