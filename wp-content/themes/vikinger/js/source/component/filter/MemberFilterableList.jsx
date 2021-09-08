const React = require('react');

const WP_Router = require('../../router/WP_Router')();

const FilterableList = require('./FilterableList'),
      MemberFilterBar = require('./MemberFilterBar'),
      MemberPreviewList = require('../member/MemberPreviewList');

class MemberFilterableList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loggedUser: false,
      loadingUser: true
    };

    this.getItemsFilters = this.getItemsFilters.bind(this);
    this.getItemsCountFilters = this.getItemsCountFilters.bind(this);

    this.getLoggedInMember = this.getLoggedInMember.bind(this);
  }

  getItemsFilters(currentPage) {
    const itemsFilters = {
      per_page: this.props.itemsPerPage,
      page: currentPage,
      data_scope: 'user-preview'
    };

    // limit to members friends of user
    if (this.props.userID) {
      itemsFilters.user_id = this.props.userID;
    }

    // limit to members of a group
    if (this.props.groupID) {
      itemsFilters.group_id = this.props.groupID;
    }

    // limit to search term
    if (this.props.searchTerm) {
      itemsFilters.search = this.props.searchTerm;
    }

    return itemsFilters;
  }

  getItemsCountFilters(filters) {
    const itemsCountFilters = {
      search: filters.search,
      type: filters.type
    };

    // limit to members friends of user
    if (this.props.userID) {
      itemsCountFilters.user_id = this.props.userID;
    }

    // limit to members of a group
    if (this.props.groupID) {
      itemsCountFilters.group_id = this.props.groupID;
    }

    // limit to search term
    if (this.props.searchTerm) {
      itemsCountFilters.search = this.props.searchTerm;
    }

    return itemsCountFilters;
  }

  getLoggedInMember(callback = () => {}) {
    WP_Router.getLoggedInMember('user-friends')
    .done((loggedUser) => {
      // console.log('MEMBER FILTERABLE LIST - LOGGED USER: ', loggedUser);

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
    // console.log('MEMBER FILTERABLE LIST - GROUP ID: ', this.props.groupID);

    return(
      <FilterableList itemType='member'
                      gridType={this.props.gridType}
                      themeColor={this.props.themeColor}
                      itemsPerPage={this.props.itemsPerPage}
                      itemPreviewList={MemberPreviewList}
                      filterBar={MemberFilterBar}
                      getItems={WP_Router.getMembers}
                      getItemsFilters={this.getItemsFilters}
                      getItemsCount={WP_Router.getMembersCount}
                      getItemsCountFilters={this.getItemsCountFilters}
                      searchTerm={this.props.searchTerm}
                      getLoggedInMember={this.getLoggedInMember}
                      loggedUser={this.state.loggedUser}
                      loadingUser={this.state.loadingUser}
      />
    );
  }
}

module.exports = MemberFilterableList;