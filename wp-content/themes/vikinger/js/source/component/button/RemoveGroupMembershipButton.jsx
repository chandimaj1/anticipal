const React = require('react');

const groupUtils = require('../utils/group');

const Button = require('./Button');

class RemoveGroupMembershipButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false
    };

    this.removeGroupMembership = this.removeGroupMembership.bind(this);
  }

  removeGroupMembership() {
    if (this.state.loading || this.props.locked) {
      return;
    }

    this.props.onActionStart && this.props.onActionStart();

    this.setState({
      loading: true
    });

    const groupable = groupUtils(this.props.loggedUser, this.props.group);

    groupable.removeGroupMembership((result) => {
      // console.log('REMOVE GROUP MEMBERSHIP BUTTON - REMOVE GROUP MEMBERSHIP RESULT: ', result);

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
              onClick={this.removeGroupMembership}
      />
    );
  }
}

module.exports = RemoveGroupMembershipButton;