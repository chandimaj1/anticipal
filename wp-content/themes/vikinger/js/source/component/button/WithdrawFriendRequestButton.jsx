const React = require('react');

const friendUtils = require('../utils/friend');

const Button = require('./Button');

class WithdrawFriendRequestButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false
    };

    this.withdrawFriendRequest = this.withdrawFriendRequest.bind(this);
  }

  withdrawFriendRequest() {
    if (this.state.loading || this.props.locked) {
      return;
    }

    this.props.onActionStart && this.props.onActionStart();

    this.setState({
      loading: true
    });

    const friendable = friendUtils(this.props.loggedUser, this.props.userID);

    friendable.withdrawFriendRequest((result) => {
      // console.log('WITHDRAW FRIEND REQUEST BUTTON - WITHDRAW FRIEND REQUEST RESULT: ', result);

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
              onClick={this.withdrawFriendRequest}
      />
    );
  }
}

module.exports = WithdrawFriendRequestButton;