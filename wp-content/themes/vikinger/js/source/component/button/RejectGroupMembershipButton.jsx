const React = require('react');

const WP_Router = require('../../router/WP_Router')();

const Button = require('./Button');

class RejectGroupMembershipButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false
    };

    this.rejectGroupMembership = this.rejectGroupMembership.bind(this);
  }

  rejectGroupMembership() {
    if (this.state.loading || this.props.locked) {
      return;
    }

    this.props.onActionStart && this.props.onActionStart();

    this.setState({
      loading: true
    });

    WP_Router.removeGroupMembership(this.props.data.id, (result) => {
      // console.log('CANCEL GROUP MEMBERSHIP ACTION REQUEST - CANCEL GROUP MEMBERSHIP REQUEST RESULT: ', result);

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
              onClick={this.rejectGroupMembership}
      />
    );
  }
}

module.exports = RejectGroupMembershipButton;