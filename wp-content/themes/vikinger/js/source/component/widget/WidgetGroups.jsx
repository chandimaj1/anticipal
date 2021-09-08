const React = require('react');

const WP_Router = require('../../router/WP_Router')();

const GroupStatusList = require('../user-status/GroupStatusList'),
      LoaderSpinner = require('../loader/LoaderSpinner');

class WidgetGroups extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      newestGroups: [],
      popularGroups: [],
      activeGroups: [],
      loadingNewestGroups: false,
      loadingPopularGroups: false,
      loadingActiveGroups: false,
      currentTabItem: 'popular',
      loggedUser: false
    };

    this.getLoggedInMember = this.getLoggedInMember.bind(this);
    this.setActiveTab = this.setActiveTab.bind(this);
  }

  getLoggedInMember(callback = () => {}) {
    WP_Router.getLoggedInMember({groups: true})
    .done((loggedUser) => {
      // console.log('WIDGET GROUPS - LOGGED USER: ', loggedUser);

      this.setState({
        loggedUser: loggedUser
      }, callback);
    });
  }

  setActiveTab(item) {
    this.setState({
      currentTabItem: item
    });
  }

  getNewestGroups() {
    this.setState({
      loadingNewestGroups: true
    });

    const filters = {
      type: 'newest',
      per_page: 5
    };

    // limit to member groups
    if (this.props.userID) {
      filters.user_id = this.props.userID;
    }

    WP_Router.getGroups(filters)
    .done((newestGroups) => {
      // console.log('WIDGET GROUPS - NEWEST GROUPS: ', newestGroups);

      this.setState({
        newestGroups: newestGroups,
        loadingNewestGroups: false
      });
    });
  }

  getPopularGroups() {
    this.setState({
      loadingPopularGroups: true
    });

    const filters = {
      type: 'popular',
      per_page: 5
    };

    // limit to member groups
    if (this.props.userID) {
      filters.user_id = this.props.userID;
    }

    WP_Router.getGroups(filters)
    .done((popularGroups) => {
      // console.log('WIDGET GROUPS - POOPULAR GROUPS: ', popularGroups);

      this.setState({
        popularGroups: popularGroups,
        loadingPopularGroups: false
      });
    });
  }

  getActiveGroups() {
    this.setState({
      loadingActiveGroups: true
    });

    const filters = {
      type: 'active',
      per_page: 5
    };

    // limit to member groups
    if (this.props.userID) {
      filters.user_id = this.props.userID;
    }

    WP_Router.getGroups(filters)
    .done((activeGroups) => {
      // console.log('WIDGET GROUPS - ACTIVE GROUPS: ', activeGroups);

      this.setState({
        activeGroups: activeGroups,
        loadingActiveGroups: false
      });
    });
  }

  componentDidMount() {
    this.getLoggedInMember();

    // get groups
    this.getNewestGroups();
    this.getPopularGroups();
    this.getActiveGroups();
  }

  render() {
    return (
      <div className="widget-box">
        {/* WIDGET BOX TITLE */}
        <p className="widget-box-title">{vikinger_translation.groups}</p>
        {/* WIDGET BOX TITLE */}

        {/* WIDGET BOX CONTENT */}
        <div className="widget-box-content">
          {/* FILTERS */}
          <div className="filters">
            <p className={`filter ${this.state.currentTabItem === 'newest' ? 'active' : ''}`} onClick={() => {this.setActiveTab('newest');}}>{vikinger_translation.newest}</p>
            <p className={`filter ${this.state.currentTabItem === 'popular' ? 'active' : ''}`} onClick={() => {this.setActiveTab('popular');}}>{vikinger_translation.popular}</p>
            <p className={`filter ${this.state.currentTabItem === 'active' ? 'active' : ''}`} onClick={() => {this.setActiveTab('active');}}>{vikinger_translation.active}</p>
          </div>
          {/* /FILTERS */}

        {
          this.state.currentTabItem === 'newest' &&
          <React.Fragment>
          {
            this.state.loadingNewestGroups &&
              <LoaderSpinner />
          }
          {
            !this.state.loadingNewestGroups &&
              <React.Fragment>
              {
                (this.state.newestGroups.length > 0) &&
                  <GroupStatusList data={this.state.newestGroups} loggedUser={this.state.loggedUser} onActionComplete={this.getLoggedInMember} modifiers="request-small" />
              }
              {
                (this.state.newestGroups.length === 0) &&
                  <p className="no-results-text">{vikinger_translation.no_groups_found}</p>
              }
              </React.Fragment>
          }
          </React.Fragment>
        }

        {
          this.state.currentTabItem === 'popular' &&
          <React.Fragment>
          {
            this.state.loadingPopularGroups &&
              <LoaderSpinner />
          }
          {
            !this.state.loadingPopularGroups &&
              <React.Fragment>
              {
                (this.state.popularGroups.length > 0) &&
                  <GroupStatusList data={this.state.popularGroups} loggedUser={this.state.loggedUser} onActionComplete={this.getLoggedInMember} modifiers="request-small" />
              }
              {
                (this.state.popularGroups.length === 0) &&
                  <p className="no-results-text">{vikinger_translation.no_groups_found}</p>
              }
              </React.Fragment>
          }
          </React.Fragment>
        }

        {
          this.state.currentTabItem === 'active' &&
          <React.Fragment>
          {
            this.state.loadingActiveGroups &&
              <LoaderSpinner />
          }
          {
            !this.state.loadingActiveGroups &&
              <React.Fragment>
              {
                (this.state.activeGroups.length > 0) &&
                  <GroupStatusList data={this.state.activeGroups} loggedUser={this.state.loggedUser} onActionComplete={this.getLoggedInMember} modifiers="request-small" />
              }
              {
                (this.state.activeGroups.length === 0) &&
                  <p className="no-results-text">{vikinger_translation.no_groups_found}</p>
              }
              </React.Fragment>
          }
          </React.Fragment>
        }
        </div>
        {/* WIDGET BOX CONTENT */}
      </div>
    );
  }
}

module.exports = WidgetGroups;