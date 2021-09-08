const React = require('react');

const WP_Router = require('../../router/WP_Router')();

const FilterableList = require('./FilterableList'),
      PostFilterBar = require('./PostFilterBar'),
      PostPreviewList = require('../post/PostPreviewList');

class PostFilterableList extends React.Component {
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
    const itemFilters = {
      numberposts: this.props.itemsPerPage,
      paged: currentPage
    };

    if (this.props.tag) {
      itemFilters.tag_id = this.props.tag;
    }

    if (this.props.user_id) {
      itemFilters.author = this.props.user_id;
    }

    if (this.props.year) {
      itemFilters.year = this.props.year;
    }

    if (this.props.month) {
      itemFilters.monthnum = this.props.month;
    }

    if (this.props.day) {
      itemFilters.day = this.props.day;
    }

    // limit to search term
    if (this.props.searchTerm) {
      itemFilters.s = this.props.searchTerm;
    }

    return itemFilters;
  }

  getItemsCountFilters(filters) {
    const itemFilters = {
      category: filters.category
    };

    if (this.props.tag) {
      itemFilters.tag_id = this.props.tag;
    }

    if (this.props.user_id) {
      itemFilters.author = this.props.user_id;
    }

    if (this.props.year) {
      itemFilters.year = this.props.year;
    }

    if (this.props.month) {
      itemFilters.monthnum = this.props.month;
    }

    if (this.props.day) {
      itemFilters.day = this.props.day;
    }

    // limit to search term
    if (this.props.searchTerm) {
      itemFilters.s = this.props.searchTerm;
    }

    return itemFilters;
  }

  getLoggedInMember(callback = () => {}) {
    WP_Router.getLoggedInMember()
    .done((loggedUser) => {
      // console.log('POST FILTERABLE LIST - LOGGED USER: ', loggedUser);

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
      <FilterableList itemType='post'
                      gridType={this.props.gridType}
                      itemsPerPage={this.props.itemsPerPage}
                      itemPreviewList={PostPreviewList}
                      extraFilters={{category: this.props.category}}
                      filterBar={PostFilterBar}
                      getItems={WP_Router.getPosts}
                      getItemsFilters={this.getItemsFilters}
                      getItemsCount={WP_Router.getPostCount}
                      getItemsCountFilters={this.getItemsCountFilters}
                      getLoggedInMember={this.getLoggedInMember}
                      loggedUser={this.state.loggedUser}
                      loadingUser={this.state.loadingUser}
      />
    );
  }
}

module.exports = PostFilterableList;