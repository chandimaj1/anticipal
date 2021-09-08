const React = require('react');

const groupUtils = require('../utils/group');

const Button = require('./Button');

class JoinGroupButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false
    };

    this.joinGroup = this.joinGroup.bind(this);
  }

  joinGroup() {
    if (this.state.loading || this.props.locked) {
      return;
    }

    this.props.onActionStart && this.props.onActionStart();

    this.setState({
      loading: true
    });

    const groupable = groupUtils(this.props.loggedUser, this.props.group);

    groupable.joinGroup((result) => {
      // console.log('JOIN GROUP BUTTON - JOIN GROUP RESULT: ', result);

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
              onClick={this.joinGroup}
      />
    );
  }
}

module.exports = JoinGroupButton;