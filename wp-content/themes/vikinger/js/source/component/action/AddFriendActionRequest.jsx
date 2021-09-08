const React = require('react');

const friendUtils = require('../utils/friend');

const ActionRequest = require('./ActionRequest');

class AddFriendActionRequest extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false
    };

    this.addFriend = this.addFriend.bind(this);
  }

  addFriend() {
    if (this.state.loading) {
      return;
    }

    this.setState({
      loading: true
    });

    const friendable = friendUtils(this.props.loggedUser, this.props.userID);

    friendable.addFriend((result) => {
      // console.log('ADD FRIEND ACTION REQUEST - ADD FRIEND RESULT: ', result);
      // if friend added successfully
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
      <ActionRequest icon="add-friend" type="accept" title={vikinger_translation.add_friend} loading={this.state.loading} onClick={this.addFriend} />
    );
  }
}

module.exports = AddFriendActionRequest;