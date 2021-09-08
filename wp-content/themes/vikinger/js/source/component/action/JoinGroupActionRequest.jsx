const React = require('react');

const groupUtils = require('../utils/group');

const ActionRequest = require('./ActionRequest');

class JoinGroupActionRequest extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false
    };

    this.joinGroup = this.joinGroup.bind(this);
  }

  joinGroup() {
    if (this.state.loading) {
      return;
    }

    this.setState({
      loading: true
    });

    const groupable = groupUtils(this.props.loggedUser, this.props.group);

    groupable.joinGroup((result) => {
      // console.log('JOIN GROUP ACTION REQUEST - JOIN GROUP RESULT: ', result);
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
      <ActionRequest icon="join-group" type="accept" title={vikinger_translation.join_group} loading={this.state.loading} onClick={this.joinGroup} />
    );
  }
}

module.exports = JoinGroupActionRequest;