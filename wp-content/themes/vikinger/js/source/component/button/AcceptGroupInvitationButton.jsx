const React = require('react');

const WP_Router = require('../../router/WP_Router')();

const Button = require('./Button');

class AcceptGroupInvitationButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false
    };

    this.acceptGroupInvitation = this.acceptGroupInvitation.bind(this);
  }

  acceptGroupInvitation() {
    if (this.state.loading || this.props.locked) {
      return;
    }

    this.props.onActionStart && this.props.onActionStart();

    this.setState({
      loading: true
    });

    const acceptGroupInvitationPromise = WP_Router.acceptGroupInvitation(this.props.data.id);

    acceptGroupInvitationPromise
    .done((result) => {
      // console.log('ACCEPT GROUP INVITATION ACTION REQUEST - ACCEPT GROUP INVITATION REQUEST RESULT: ', result);

      // get updated group data
      this.props.onActionComplete();
    })
    .fail((error) => {
      // console.log('ACCEPT GROUP INVITATION ACTION REQUEST - ACCEPT GROUP INVITATION REQUEST ERROR: ', error);

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
              onClick={this.acceptGroupInvitation}
      />
    );
  }
}

module.exports = AcceptGroupInvitationButton;