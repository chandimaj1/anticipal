const React = require('react');

const WP_Router = require('../../router/WP_Router')();

const ActionRequest = require('./ActionRequest');

class RemoveGroupInvitationActionRequest extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false
    };

    this.removeGroupInvitation = this.removeGroupInvitation.bind(this);
  }

  removeGroupInvitation() {
    if (this.state.loading || this.props.locked) {
      return;
    }

    this.props.onActionStart && this.props.onActionStart();

    this.setState({
      loading: true
    });

    const removeGroupInvitationPromise = WP_Router.removeGroupInvitation(this.props.data.id);

    removeGroupInvitationPromise
    .done((result) => {
      // console.log('REMOVE GROUP INVITATION ACTION REQUEST - REMOVE GROUP INVITATION REQUEST RESULT: ', result);

      // get updated group data
      this.props.onActionComplete();
    })
    .fail((error) => {
      // console.log('REMOVE GROUP INVITATION ACTION REQUEST - REMOVE GROUP INVITATION REQUEST ERROR: ', error);

      this.setState({
        loading: false
      });
    });
  }

  render() {
    return (
      <ActionRequest  icon="remove-user"
                      type="decline"
                      title={vikinger_translation.remove_invitation}
                      loading={this.state.loading}
                      onClick={this.removeGroupInvitation}
      />
    );
  }
}

module.exports = RemoveGroupInvitationActionRequest;