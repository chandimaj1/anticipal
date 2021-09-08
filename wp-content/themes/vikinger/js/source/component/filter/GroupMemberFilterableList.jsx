const React = require('react');

const app = require('../../utils/core');

const WP_Router = require('../../router/WP_Router')();

const FilterableList = require('./FilterableList'),
      GroupMemberFilterBar = require('./GroupMemberFilterBar'),
      MemberPreviewList = require('../member/MemberPreviewList');

class GroupMemberFilterableList extends React.Component {
  constructor(props) {
    super(props);

    this.getItems = this.getItems.bind(this);

    this.getItemsFilters = this.getItemsFilters.bind(this);
    this.getItemsCountFilters = this.getItemsCountFilters.bind(this);
  }

  getItems(config) {
    const args = app.deepMerge({data_scope: 'user-preview'}, config);

    return WP_Router.getGroupMembers(args);
  }

  getItemsFilters(currentPage) {
    const itemsFilters = {
      group_id: this.props.groupID,
      exclude_admins: false,
      per_page: this.props.itemsPerPage,
      page: currentPage
    };

    // limit to search term
    if (this.props.searchTerm) {
      itemsFilters.search = this.props.searchTerm;
    }

    return itemsFilters;
  }

  getItemsCountFilters(filters) {
    const itemsCountFilters = {
      group_id: this.props.groupID,
      exclude_admins: false,
      search: filters.search,
      status: filters.status
    };

    // limit to search term
    if (this.props.searchTerm) {
      itemsCountFilters.search = this.props.searchTerm;
    }

    return itemsCountFilters;
  }

  render() {
    // console.log('GROUP MEMBER FILTERABLE LIST - GROUP ID: ', this.props.groupID);

    return(
      <FilterableList itemType='member'
                      gridType={this.props.gridType}
                      themeColor={this.props.themeColor}
                      itemsPerPage={this.props.itemsPerPage}
                      itemPreviewList={MemberPreviewList}
                      filterBar={GroupMemberFilterBar}
                      getItems={this.getItems}
                      getItemsFilters={this.getItemsFilters}
                      getItemsCount={WP_Router.getGroupMembersCount}
                      getItemsCountFilters={this.getItemsCountFilters}
                      searchTerm={this.props.searchTerm}
      />
    );
  }
}

module.exports = GroupMemberFilterableList;