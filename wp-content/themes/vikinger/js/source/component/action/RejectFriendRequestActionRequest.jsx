const React = require('react');

const friendUtils = require('../utils/friend');

const ActionRequest = require('./ActionRequest');

class AcceptFriendRequestActionRequest extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false
    };

    this.rejectFriendRequest = this.rejectFriendRequest.bind(this);
  }

  rejectFriendRequest() {
    if (this.state.loading || this.props.locked) {
      return;
    }

    this.props.onActionStart && this.props.onActionStart();

    this.setState({
      loading: true
    });

    const friendable = friendUtils(this.props.loggedUser, this.props.userID);

    friendable.rejectFriendRequest((result) => {
      // console.log('REJECT FRIEND REQUEST ACTION REQUEST - REJECT FRIEND REQUEST RESULT: ', result);
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
      <ActionRequest icon="remove-friend" type="decline" title={vikinger_translation.reject_friend} loading={this.state.loading} onClick={this.rejectFriendRequest} />
    );
  }
}

module.exports = AcceptFriendRequestActionRequest;