const React = require('react');

const app = require('../../utils/core');

const WP_Router = require('../../router/WP_Router')();

const FilterableList = require('./FilterableList'),
      GroupFilterBar = require('./GroupFilterBar'),
      GroupPreviewList = require('../group/GroupPreviewList');

class GroupFilterableList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loggedUser: false,
      loadingUser: true
    };

    this.getItems = this.getItems.bind(this);

    this.getItemsFilters = this.getItemsFilters.bind(this);
    this.getItemsCountFilters = this.getItemsCountFilters.bind(this);

    this.getLoggedInMember = this.getLoggedInMember.bind(this);
  }

  getItems(config) {
    const args = app.deepMerge({data_scope: 'group-preview'}, config);

    return WP_Router.getGroups(args);
  }

  getItemsFilters(currentPage) {
    const itemsFilters = {
      per_page: this.props.itemsPerPage,
      page: currentPage
    };

    // limit to user groups
    if (this.props.userID) {
      itemsFilters.user_id = this.props.userID;
    }

    // limit to search term
    if (this.props.searchTerm) {
      itemsFilters.search = this.props.searchTerm;
      // itemsFilters.search_columns = ['name'];
    }

    return itemsFilters;
  }

  getItemsCountFilters(filters) {
    const itemsCountFilters = {
      search: filters.search,
      type: filters.type
    };

    // limit to user groups
    if (this.props.userID) {
      itemsCountFilters.user_id = this.props.userID;
    }

    // limit to search term
    if (this.props.searchTerm) {
      itemsCountFilters.search = this.props.searchTerm;
      // itemsCountFilters.search_columns = ['name'];
    }

    return itemsCountFilters;
  }

  getLoggedInMember(callback = () => {}) {
    WP_Router.getLoggedInMember('user-groups')
    .done((loggedUser) => {
      // console.log('GROUP FILTERABLE LIST - LOGGED USER: ', loggedUser);

      this.setState({
        loggedUser: loggedUser,
        loadingUser: false
      }, callback);
    });
  }

  componentDidMount() {
    this.getLoggedInMember();
  }

  render() {
    return(
      <FilterableList itemType='group'
                      gridType={this.props.gridType}
                      themeColor={this.props.themeColor}
                      itemsPerPage={this.props.itemsPerPage}
                      itemPreviewList={GroupPreviewList}
                      filterBar={GroupFilterBar}
                      getItems={this.getItems}
                      getItemsFilters={this.getItemsFilters}
                      getItemsCount={WP_Router.getGroupsCount}
                      getItemsCountFilters={this.getItemsCountFilters}
                      searchTerm={this.props.searchTerm}
                      getLoggedInMember={this.getLoggedInMember}
                      loggedUser={this.state.loggedUser}
                      loadingUser={this.state.loadingUser}
      />
    );
  }
}

module.exports = GroupFilterableList;