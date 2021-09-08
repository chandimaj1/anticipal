const React = require('react');

const WP_Router = require('../../router/WP_Router')();

const Button = require('./Button');

class AcceptGroupMembershipButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false
    };

    this.acceptGroupMembership = this.acceptGroupMembership.bind(this);
  }

  acceptGroupMembership() {
    if (this.state.loading || this.props.locked) {
      return;
    }

    this.props.onActionStart && this.props.onActionStart();

    this.setState({
      loading: true
    });

    WP_Router.acceptGroupMembership(this.props.data.id, (result) => {
      // console.log('ACCEPT GROUP MEMBERSHIP ACTION REQUEST - ACCEPT GROUP MEMBERSHIP REQUEST RESULT: ', result);

      if (result) {
        this.props.onActionComplete();
      } else {
        this.setState({
          loading: false
        });
      }
    
    });
  }

  render() {
    return (
      <Button modifiers={this.props.modifiers}
              text={this.props.text}
              icon={this.props.icon}
              title={this.props.title}
              loading={this.state.loading}
              onClick={this.acceptGroupMembership}
      />
    );
  }
}

module.exports = AcceptGroupMembershipButton;