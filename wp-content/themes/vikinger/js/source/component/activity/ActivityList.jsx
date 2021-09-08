const React = require('react');

const WP_Router = require('../../router/WP_Router')();

const Activity = require('./Activity');

class ActivityList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      reactions: []
    };
  }

  componentDidMount() {
    if (vikinger_constants.plugin_active.vkreact && vikinger_constants.plugin_active['vkreact-buddypress']) {
      WP_Router.getReactions()
      .done((response) => {
        // console.log('ACTIVITY LIST - REACTIONS: ', response);

        this.setState({
          reactions: response
        });
      });
    }
  }

  render() {
    return (
      this.props.data.map((activityData) => {
        return (
          <Activity key={activityData.id}
                    data={activityData}
                    user={this.props.user}
                    profileUserID={this.props.profileUserID}
                    pinnedActivityID={this.props.pinnedActivityID}
                    pinActivity={this.props.pinActivity}
                    unpinActivity={this.props.unpinActivity}
                    deleteActivity={this.props.deleteActivity}
                    reactions={this.state.reactions}
                    onShare={this.props.onShare}
                    onPlay={this.props.onPlay}
          />
        );
      })
    );
  }
}

module.exports = ActivityList;