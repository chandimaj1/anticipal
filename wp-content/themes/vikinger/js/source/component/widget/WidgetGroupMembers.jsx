const React = require('react');

const WP_Router = require('../../router/WP_Router')();

const FriendStatusList = require('../user-status/FriendStatusList'),
      LoaderSpinner = require('../loader/LoaderSpinner');

class WidgetGroupMembers extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      members: [],
      loading: false,
      loggedUser: false
    };

    this.getLoggedInMember = this.getLoggedInMember.bind(this);
  }

  getLoggedInMember(callback = () => {}) {
    WP_Router.getLoggedInMember({friends: true})
    .done((loggedUser) => {
      // console.log('WIDGET GROUP MEMBERS - LOGGED USER: ', loggedUser);

      this.setState({
        loggedUser: loggedUser
      }, callback);
    });
  }

  getMembers() {
    this.setState({
      loading: true
    });

    const filters = {
      group_id: this.props.groupID,
      exclude_admins: false,
      per_page: 5
    };

    const getGroupMembersPromise = WP_Router.getGroupMembers(filters);

    getGroupMembersPromise
    .done((members) => {
      // console.log('WIDGET GROUP MEMBERS - GET MEMBERS RESPONSE: ', members);

      this.setState({
        members: members,
        loading: false
      });
    })
    .fail((error) => {
      // console.log('WIDGET GROUP MEMBERS - GET MEMBERS ERROR: ', error);
    });
  }

  componentDidMount() {
    this.getLoggedInMember();

    // get members
    this.getMembers();
  }

  render() {
    return (
      <div className="widget-box">
        {/* WIDGET BOX TITLE */}
        <p className="widget-box-title">{vikinger_translation.newest_members}</p>
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
              (this.state.members.length > 0) &&
                <FriendStatusList data={this.state.members}
                                  loggedUser={this.state.loggedUser}
                                  onActionComplete={this.getLoggedInMember}
                                  modifiers="request-small"
                />
            }
            {
              (this.state.members.length === 0) &&
                <p className="no-results-text">{vikinger_translation.no_members_found}</p>
            }
            </React.Fragment>
        }
        </div>
        {/* WIDGET BOX CONTENT */}
      </div>
    );
  }
}

module.exports = WidgetGroupMembers;