const React = require('react');

const WP_Router = require('../../router/WP_Router')();

const FriendStatusList = require('../user-status/FriendStatusList'),
      LoaderSpinner = require('../loader/LoaderSpinner');

class WidgetFriends extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      friends: [],
      loading: false,
      loggedUser: false,
      user: false
    };

    this.getLoggedInMember = this.getLoggedInMember.bind(this);
  }

  getLoggedInMember(callback = () => {}) {
    WP_Router.getLoggedInMember({friends: true})
    .done((loggedUser) => {
      // console.log('WIDGET FRIENDS - LOGGED USER: ', loggedUser);

      this.setState({
        loggedUser: loggedUser
      }, callback);
    });
  }

  componentDidMount() {
    this.getLoggedInMember();

    WP_Router.getMembers({include: [this.props.userID]})
    .done((user) => {
      // console.log('WIDGET FRIENDS - USER: ', user[0]);

      this.setState({
        user: user[0]
      });
    });

    this.setState({
      loading: true
    });

    WP_Router.getMembers({user_id: this.props.userID, per_page: 5})
    .done((friends) => {
      // console.log('WIDGET FRIENDS - FRIENDS: ', friends);

      this.setState({
        friends: friends,
        loading: false
      });
    });
  }

  render() {
    return (
      <div className="widget-box">
        {/* WIDGET BOX TITLE */}
        <p className="widget-box-title">{vikinger_translation.friends} <span className="highlighted">{this.state.friends.length}</span></p>
        {/* WIDGET BOX TITLE */}

        {/* WIDGET BOX CONTENT */}
        <div className="widget-box-content">
        {
          this.state.loading &&
            <LoaderSpinner />
        }
        {
          !this.state.loading &&
            <React.Fragment>
            {
              (this.state.friends.length > 0) &&
                <React.Fragment>
                  <FriendStatusList data={this.state.friends} loggedUser={this.state.loggedUser} onActionComplete={this.getLoggedInMember} modifiers="request-small" />
                  <a className="widget-box-button button small secondary" href={this.state.user ? this.state.user.friends_link : '#'}>{vikinger_translation.see_all_friends}</a>
                </React.Fragment>
            }
            {
              (this.state.friends.length === 0) &&
                <p className="no-results-text">{vikinger_translation.no_friends_found}</p>
            }
            {
              this.state.user && this.state.loggedUser && (this.state.friends.length === 0) && (this.state.user.id === this.state.loggedUser.id) &&
                <a className="widget-box-button button small secondary" href={this.state.loggedUser.members_link}>{vikinger_translation.find_friends}</a>
            }
            </React.Fragment>
        }
        </div>
        {/* WIDGET BOX CONTENT */}
      </div>
    );
  }
}

module.exports = WidgetFriends;