const React = require('react');

const groupUtils = require('../utils/group');

const ActionRequest = require('./ActionRequest');

class PromoteGroupMemberToModActionRequest extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false
    };

    this.promoteGroupMemberToMod = this.promoteGroupMemberToMod.bind(this);
  }

  promoteGroupMemberToMod() {
    if (this.state.loading || this.props.locked) {
      return;
    }

    this.props.onActionStart && this.props.onActionStart();

    this.setState({
      loading: true
    });

    const groupable = groupUtils(this.props.loggedUser, this.props.group, this.props.member);

    groupable
    .promoteGroupMemberToMod()
    .done((result) => {
      // console.log('PROMOTE GROUP MEMBER TO MOD ACTION REQUEST - PROMOTE GROUP MEMBER TO MOD REQUEST RESULT: ', result);

      // get updated group data
      this.props.onActionComplete();
    })
    .fail((error) => {
      // console.log('PROMOTE GROUP MEMBER TO MOD ACTION REQUEST - PROMOTE GROUP MEMBER TO MOD REQUEST ERROR: ', error);

      this.setState({
        loading: false
      });
    });
  }

  render() {
    return (
      <ActionRequest  icon="mod-shield"
                      type="accept"
                      title={vikinger_translation.promote_to_mod}
                      loading={this.state.loading}
                      onClick={this.promoteGroupMemberToMod}
      />
    );
  }
}

module.exports = PromoteGroupMemberToModActionRequest;