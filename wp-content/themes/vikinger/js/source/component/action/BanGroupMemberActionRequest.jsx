const React = require('react');

const groupUtils = require('../utils/group');

const ActionRequest = require('./ActionRequest');

class BanGroupMemberActionRequest extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false
    };

    this.banGroupMember = this.banGroupMember.bind(this);
  }

  banGroupMember() {
    if (this.state.loading || this.props.locked) {
      return;
    }

    this.props.onActionStart && this.props.onActionStart();

    this.setState({
      loading: true
    });

    const groupable = groupUtils(this.props.loggedUser, this.props.group, this.props.member);

    groupable
    .banGroupMember()
    .done((result) => {
      // console.log('BAN GROUP MEMBER ACTION REQUEST - BAN GROUP MEMBER REQUEST RESULT: ', result);

      // get updated group data
      this.props.onActionComplete();
    })
    .fail((error) => {
      // console.log('BAN GROUP MEMBER ACTION REQUEST - BAN GROUP MEMBER REQUEST ERROR: ', error);

      this.setState({
        loading: false
      });
    });
  }

  render() {
    return (
      <ActionRequest  icon="ban"
                      type="decline"
                      title={vikinger_translation.ban_member}
                      loading={this.state.loading}
                      onClick={this.banGroupMember}
      />
    );
  }
}

module.exports = BanGroupMemberActionRequest;