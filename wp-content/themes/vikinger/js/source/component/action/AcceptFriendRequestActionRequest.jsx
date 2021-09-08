const React = require('react');

const friendUtils = require('../utils/friend');

const ActionRequest = require('./ActionRequest');

class AcceptFriendRequestActionRequest extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false
    };

    this.acceptFriendRequest = this.acceptFriendRequest.bind(this);
  }

  acceptFriendRequest() {
    if (this.state.loading || this.props.locked) {
      return;
    }

    this.props.onActionStart && this.props.onActionStart();

    this.setState({
      loading: true
    });

    const friendable = friendUtils(this.props.loggedUser, this.props.userID);

    friendable.acceptFriendRequest((result) => {
      // console.log('ACCEPT FRIEND REQUEST ACTION REQUEST - ACCEPT FRIEND REQUEST RESULT: ', result);
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
      <ActionRequest icon="add-friend" type="accept" title={vikinger_translation.accept_friend} loading={this.state.loading} onClick={this.acceptFriendRequest} />
    );
  }
}

module.exports = AcceptFriendRequestActionRequest;