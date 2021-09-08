const React = require('react');

const WP_Router = require('../../router/WP_Router')();

const FriendStatusList = require('../user-status/FriendStatusList'),
      LoaderSpinner = require('../loader/LoaderSpinner');

class WidgetMembers extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      newestMembers: [],
      popularMembers: [],
      activeMembers: [],
      loadingNewestMembers: false,
      loadingPopularMembers: false,
      loadingActiveMembers: false,
      currentTabItem: 'popular',
      loggedUser: false
    };

    this.getLoggedInMember = this.getLoggedInMember.bind(this);
    this.setActiveTab = this.setActiveTab.bind(this);
  }

  getLoggedInMember(callback = () => {}) {
    WP_Router.getLoggedInMember({friends: true})
    .done((loggedUser) => {
      // console.log('WIDGET MEMBERS - LOGGED USER: ', loggedUser);

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

  getNewestMembers() {
    this.setState({
      loadingNewestMembers: true
    });

    const filters = {
      type: 'newest',
      per_page: 5
    };

    WP_Router.getMembers(filters)
    .done((newestMembers) => {
      // console.log('WIDGET MEMBERS - NEWEST MEMBERS: ', newestMembers);

      this.setState({
        newestMembers: newestMembers,
        loadingNewestMembers: false
      });
    });
  }

  getPopularMembers() {
    this.setState({
      loadingPopularMembers: true
    });

    const filters = {
      type: 'popular',
      per_page: 5
    };

    WP_Router.getMembers(filters)
    .done((popularMembers) => {
      // console.log('WIDGET MEMBERS - POOPULAR MEMBERS: ', popularMembers);

      this.setState({
        popularMembers: popularMembers,
        loadingPopularMembers: false
      });
    });
  }

  getActiveMembers() {
    this.setState({
      loadingActiveMembers: true
    });

    const filters = {
      type: 'active',
      per_page: 5
    };

    WP_Router.getMembers(filters)
    .done((activeMembers) => {
      // console.log('WIDGET MEMBERS - ACTIVE MEMBERS: ', activeMembers);

      this.setState({
        activeMembers: activeMembers,
        loadingActiveMembers: false
      });
    });
  }

  componentDidMount() {
    this.getLoggedInMember();

    // get members
    this.getNewestMembers();
    this.getPopularMembers();
    this.getActiveMembers();
  }

  render() {
    return (
      <div className="widget-box">
        {/* WIDGET BOX TITLE */}
        <p className="widget-box-title">{vikinger_translation.members}</p>
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
            this.state.loadingNewestMembers &&
              <LoaderSpinner />
          }
          {
            !this.state.loadingNewestMembers &&
              <React.Fragment>
              {
                (this.state.newestMembers.length > 0) &&
                  <FriendStatusList data={this.state.newestMembers}
                                    loggedUser={this.state.loggedUser}
                                    onActionComplete={this.getLoggedInMember}
                                    modifiers="request-small"
                  />
              }
              {
                (this.state.newestMembers.length === 0) &&
                  <p className="no-results-text">{vikinger_translation.no_members_found}</p>
              }
              </React.Fragment>
          }
          </React.Fragment>
        }

        {
          this.state.currentTabItem === 'popular' &&
          <React.Fragment>
          {
            this.state.loadingPopularMembers &&
              <LoaderSpinner />
          }
          {
            !this.state.loadingPopularMembers &&
              <React.Fragment>
              {
                (this.state.popularMembers.length > 0) &&
                  <FriendStatusList data={this.state.popularMembers} loggedUser={this.state.loggedUser} onActionComplete={this.getLoggedInMember} modifiers="request-small" />
              }
              {
                (this.state.popularMembers.length === 0) &&
                  <p className="no-results-text">{vikinger_translation.no_members_found}</p>
              }
              </React.Fragment>
          }
          </React.Fragment>
        }

        {
          this.state.currentTabItem === 'active' &&
          <React.Fragment>
          {
            this.state.loadingActiveMembers &&
              <LoaderSpinner />
          }
          {
            !this.state.loadingActiveMembers &&
              <React.Fragment>
              {
                (this.state.activeMembers.length > 0) &&
                  <FriendStatusList data={this.state.activeMembers} loggedUser={this.state.loggedUser} onActionComplete={this.getLoggedInMember} modifiers="request-small" />
              }
              {
                (this.state.activeMembers.length === 0) &&
                  <p className="no-results-text">{vikinger_translation.no_members_found}</p>
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

module.exports = WidgetMembers;