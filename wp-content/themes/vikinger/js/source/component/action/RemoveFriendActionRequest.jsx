const React = require('react');

const friendUtils = require('../utils/friend');

const ActionRequest = require('./ActionRequest');

class RemoveFriendActionRequest extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false
    };

    this.removeFriend = this.removeFriend.bind(this);
  }

  removeFriend() {
    if (this.state.loading) {
      return;
    }

    this.setState({
      loading: true
    });

    const friendable = friendUtils(this.props.loggedUser, this.props.userID);

    friendable.removeFriend((result) => {
      // console.log('REMOVE FRIEND ACTION REQUEST - REMOVE FRIEND RESULT: ', result);
      // if friend removed successfully
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
      <ActionRequest icon="remove-friend" type="decline" title={vikinger_translation.remove_friend} loading={this.state.loading} onClick={this.removeFriend} />
    );
  }
}

module.exports = RemoveFriendActionRequest;