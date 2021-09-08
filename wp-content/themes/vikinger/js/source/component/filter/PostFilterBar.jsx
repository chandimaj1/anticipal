const React = require('react');

const WP_Router = require('../../router/WP_Router')();

const GridOptions = require('../grid/GridOptions'),
      IconSVG = require('../icon/IconSVG');

class PostFilterBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      categories: [],
      category: props.extraFilters.category || 0,
      orderby: 'date',
      order: 'DESC'
    };

    props.applyFilters(this.state);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();

    this.props.applyFilters(this.state);
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    }, () => {
      // console.log('POST FILTER BAR - STATE: ', this.state);
    });
  }

  componentDidMount() {
    if (!this.props.hideCategories) {
      WP_Router.getCategories((categories) => {
        // console.log('POST FILTER BAR - CATEGORIES: ', categories);
  
        this.setState({
          categories: categories
        });
      });
    }
  }

  render() {
    const showCategoryFilter = !this.props.extraFilters.category;

    return (
      <div className="section-filters-bar v2">
        <div className="section-filters-bar-actions full">
          <form className="form">
            <div className="form-row split">
              {
                showCategoryFilter &&
                (
                  <div className="form-item">
                    <div className="form-select">
                      <label htmlFor="post-filter-category">{vikinger_translation.category}</label>
                      <select id="post-filter-category" name="category" value={this.state.category} onChange={this.handleChange}>
                        <option value="0">{vikinger_translation.all_categories}</option>
                        {
                          this.state.categories.map((category) => {
                            return (
                              <option key={category.id} value={category.id}>{category.name}</option>
                            );
                          })
                        }
                      </select>
                      <IconSVG  icon="small-arrow"
                                modifiers="form-select-icon"
                      />
                    </div>
                  </div>
                )
              }
              <div className="form-item">
                <div className="form-select">
                  <label htmlFor="post-filter-by">{vikinger_translation.filter_by}</label>
                  <select id="post-filter-by" name="orderby" value={this.state.orderby} onChange={this.handleChange}>
                    <option value="date">{vikinger_translation.date}</option>
                    <option value="comment_count">{vikinger_translation.popularity}</option>
                  </select>
                  <IconSVG  icon="small-arrow"
                            modifiers="form-select-icon"
                  />
                </div>
              </div>
        
              <div className="form-item">
                <div className="form-select">
                  <label htmlFor="post-filter-order">{vikinger_translation.order_by}</label>
                  <select id="post-filter-order" name="order" value={this.state.order} onChange={this.handleChange}>
                    <option value="DESC">{vikinger_translation.descending}</option>
                    <option value="ASC">{vikinger_translation.ascending}</option>
                  </select>
                  <IconSVG  icon="small-arrow"
                            modifiers="form-select-icon"
                  />
                </div>
              </div>

              <div className="form-item small">
                <button type="submit" className="button primary" onClick={this.handleSubmit}>{vikinger_translation.filter_action}</button>
              </div>
            </div>
          </form>
        </div>

        <div className="section-filters-bar-actions">
          <GridOptions  gridTypes={['big', 'small', 'list']}
                        activeGrid={this.props.gridType}
                        onGridOptionClick={this.props.setGrid}
          />
        </div>
      </div>
    );
  }
}

module.exports = PostFilterBar;