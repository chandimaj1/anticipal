const React = require('react');

const WP_Router = require('../../router/WP_Router')();

const Button = require('./Button');

class RemoveGroupInvitationButton extends React.Component {
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
      <Button modifiers={this.props.modifiers}
              text={this.props.text}
              icon={this.props.icon}
              title={this.props.title}
              loading={this.state.loading}
              onClick={this.removeGroupInvitation}
      />
    );
  }
}

module.exports = RemoveGroupInvitationButton;