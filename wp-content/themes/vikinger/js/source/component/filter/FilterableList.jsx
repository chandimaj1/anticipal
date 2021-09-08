const React = require('react');

const WP_Router = require('../../router/WP_Router')();
      
const app = require('../../utils/core');

const Pager = require('../pager/Pager'),
      Loader = require('../loader/Loader');

class FilterableList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      items: [],
      itemCount: 0,
      gridType: props.gridType || 'small',
      loading: false
    };

    this.applyFilters = this.applyFilters.bind(this);
    this.setGrid = this.setGrid.bind(this);
    this.showPage = this.showPage.bind(this);

    this.themeColor = this.props.themeColor || 'primary';
    this.currentPage = 1;
    this.filters = {};
  }

  getItems() {
    const config = this.props.getItemsFilters(this.currentPage);

    app.deepExtend(config, this.filters);
    
    // console.log('FILTERABLE LIST - GET ITEMS CONFIG: ', config);

    return this.props.getItems(config);
  }

  getItemsCount(callback) {
    const config = this.props.getItemsCountFilters(this.filters);

    // console.log('FILTERABLE LIST - GET ITEMS COUNT CONFIG: ', config);

    this.props.getItemsCount(config, callback);
  }

  updateItems() {
    this.setState({
      loading: true
    });

    this.getItems().done((items) => {
      // console.log('FILTERABLE LIST - ITEMS: ', items);

      this.setState({
        items: items,
        loading: false
      });
    });
  }

  updateItemsCount() {
    this.getItemsCount((itemCount) => {
      // console.log('FILTERABLE LIST - ITEM COUNT: ', itemCount);

      this.setState({
        itemCount: itemCount
      });
    });
  }

  applyFilters(filtersData) {
    // console.log('FILTERABLE LIST - APPLY FILTERS: ', filtersData);

    // check if filters changed
    let filtersChanged = false;

    for (const filter in filtersData) {
      if (this.filters[filter] !== filtersData[filter]) {
        filtersChanged = true;
        break;
      }
    }

    // if filters didn't change, don't update
    if (!filtersChanged) {
      return;
    }

    app.deepExtend(this.filters, filtersData);

    // filters changed, update count
    // and reset to first page
    this.currentPage = 1;
    this.updateItemsCount();
    this.updateItems();
  }

  setGrid(gridType) {
    this.setState({
      gridType: gridType
    });

    // only save grid type if there is a user logged in
    if (this.props.loggedUser) {
      const updateLoggedUserGridTypePromise = WP_Router.updateLoggedUserGridType({grid_component: this.props.itemType, grid_type: gridType});

      // console.log('FILTERABLE LIST - UPDATE LOGGED USER GRID TYPE: ', this.props.itemType, gridType);

      updateLoggedUserGridTypePromise
      .done((response) => {
        // console.log('FILTERABLE LIST - UPDATE LOGGED USER GRID TYPE RESPONSE: ', response);
      })
      .fail((error) => {
        // console.log('FILTERABLE LIST - UPDATE LOGGED USER GRID TYPE ERROR: ', error);
      });
    }
  }

  showPage(pageNumber) {
    // if page didn't change, don't update items
    if (this.currentPage === pageNumber) {
      return;
    }

    this.currentPage = pageNumber;
    this.updateItems();
  }

  render() {
    const ItemPreviewList = this.props.itemPreviewList,
          FilterBar = this.props.filterBar;

    const itemTypeText = this.state.itemCount === 1 ? vikinger_translation[this.props.itemType] : vikinger_translation[this.props.itemType + 's'];
    
    return (
      <div>
        <FilterBar  extraFilters={this.props.extraFilters}
                    applyFilters={this.applyFilters}
                    gridType={this.state.gridType}
                    setGrid={this.setGrid}
                    themeColor={this.themeColor}
                    searchTerm={this.props.searchTerm}
        />
        {
          (this.state.loading || this.props.loadingUser) &&
            <Loader />
        }
        {
          !this.state.loading && !this.props.loadingUser &&
            <React.Fragment>
              <ItemPreviewList  gridType={this.state.gridType}
                                data={this.state.items}
                                loggedUser={this.props.loggedUser}
                                onActionComplete={this.props.getLoggedInMember}
              />
            {
              this.state.itemCount !== 0 &&
                <React.Fragment>
                  <Pager  pageCount={Math.ceil(this.state.itemCount / this.props.itemsPerPage)}
                          activePage={this.currentPage}
                          showPage={this.showPage}
                          themeColor={this.themeColor}
                  />
                  <p className="section-results-text">{vikinger_translation.showing_results_text_1} {this.currentPage === 1 ? 1 : (this.props.itemsPerPage * (this.currentPage - 1)) + 1} - {(this.props.itemsPerPage * this.currentPage) > this.state.itemCount ? this.state.itemCount : this.props.itemsPerPage * this.currentPage} {vikinger_translation.showing_results_text_2} {this.state.itemCount} {itemTypeText.toLowerCase()}</p>
                </React.Fragment>
            }
            </React.Fragment>
        }
      </div>
    );
  }
}

module.exports = FilterableList;