const React = require('react');

const groupUtils = require('../utils/group');

const ActionRequest = require('./ActionRequest');

class DemoteGroupMemberToModActionRequest extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false
    };

    this.demoteGroupMemberToMod = this.demoteGroupMemberToMod.bind(this);
  }

  demoteGroupMemberToMod() {
    if (this.state.loading || this.props.locked) {
      return;
    }

    this.props.onActionStart && this.props.onActionStart();

    this.setState({
      loading: true
    });

    const groupable = groupUtils(this.props.loggedUser, this.props.group, this.props.member);

    groupable
    .demoteGroupMemberToMod()
    .done((result) => {
      // console.log('DEMOTE GROUP MEMBER TO MOD ACTION REQUEST - DEMOTE GROUP MEMBER TO MOD REQUEST RESULT: ', result);

      // get updated group data
      this.props.onActionComplete();
    })
    .fail((error) => {
      // console.log('DEMOTE GROUP MEMBER TO MOD ACTION REQUEST - DEMOTE GROUP MEMBER TO MOD REQUEST ERROR: ', error);

      this.setState({
        loading: false
      });
    });
  }

  render() {
    return (
      <ActionRequest  icon="mod-shield"
                      type="decline"
                      title={vikinger_translation.demote_to_mod}
                      loading={this.state.loading}
                      onClick={this.demoteGroupMemberToMod}
      />
    );
  }
}

module.exports = DemoteGroupMemberToModActionRequest;