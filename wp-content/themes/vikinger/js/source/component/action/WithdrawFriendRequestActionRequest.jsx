const React = require('react');

const friendUtils = require('../utils/friend');

const ActionRequest = require('./ActionRequest');

class WithdrawFriendRequestActionRequest extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false
    };

    this.withdrawFriendRequest = this.withdrawFriendRequest.bind(this);
  }

  withdrawFriendRequest() {
    if (this.state.loading) {
      return;
    }

    this.setState({
      loading: true
    });

    const friendable = friendUtils(this.props.loggedUser, this.props.userID);

    friendable.withdrawFriendRequest((result) => {
      // console.log('WITHDRAW FRIEND REQUEST ACTION REQUEST - WITHDRAW FRIEND REQUEST RESULT: ', result);
      // if request was withdrawn successfully
      if (result) {
        // get request user friend data
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
      <ActionRequest icon="remove-friend" type="decline" title={vikinger_translation.withdraw_friend} loading={this.state.loading} onClick={this.withdrawFriendRequest} />
    );
  }
}

module.exports = WithdrawFriendRequestActionRequest;