const React = require('react');

const groupUtils = require('../utils/group');

const Button = require('./Button');

class LeaveGroupButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false
    };

    this.leaveGroup = this.leaveGroup.bind(this);
  }

  leaveGroup() {
    if (this.state.loading || this.props.locked) {
      return;
    }

    this.props.onActionStart && this.props.onActionStart();

    this.setState({
      loading: true
    });

    const groupable = groupUtils(this.props.loggedUser, this.props.group);

    groupable.leaveGroup((result) => {
      // console.log('LEAVE GROUP BUTTON - LEAVE GROUP RESULT: ', result);

      if (result) {
        // get updated user friend data
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
              onClick={this.leaveGroup}
      />
    );
  }
}

module.exports = LeaveGroupButton;