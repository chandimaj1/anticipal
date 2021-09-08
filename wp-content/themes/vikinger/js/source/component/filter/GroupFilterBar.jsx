const React = require('react');

const plugins = require('../../utils/plugins');

const GridOptions = require('../grid/GridOptions'),
      IconSVG = require('../icon/IconSVG');

class GroupFilterBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      type: 'alphabetical',
      search: props.searchTerm || ''
    };

    props.applyFilters(this.state);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.searchInputRef = React.createRef();
  }

  componentDidMount() {
    if (!this.props.searchTerm) {
      plugins.createFormInput([this.searchInputRef.current]);
    }
  }

  handleSubmit(e) {
    e.preventDefault();

    this.props.applyFilters(this.state);
  }

  handleChange(e) {
    const inputName = e.target.name,
          inputValue = e.target.value;

    this.setState({
      [inputName]: inputValue
    }, () => {
      // console.log('GROUP FILTER BAR - STATE: ', this.state);

      if (inputName === 'type') {
        this.props.applyFilters(this.state);
      }
    });
  }

  render() {
    return (
      <div className="section-filters-bar v2">
        <div className="section-filters-bar-actions full">
          <form className="form" onSubmit={this.handleSubmit}>
            <div className="form-row split">
            {
              !this.props.searchTerm &&
                <div className="form-item">
                  <div ref={this.searchInputRef} className="form-input small with-button">
                    <label htmlFor="group-name">{vikinger_translation.search_groups}</label>
                    <input type="text" id="group-name" name="search" onChange={this.handleChange} />

                    <button type="submit" className={`button ${this.props.themeColor}`}>
                      <IconSVG icon="magnifying-glass" />
                    </button>
                  </div>
                </div>
            }

              <div className="form-item">
                <div className="form-select">
                  <label htmlFor="group-order-by">{vikinger_translation.order_by}</label>
                  <select id="group-order-by" name="type" value={this.state.type} onChange={this.handleChange}>
                    <option value="alphabetical">{vikinger_translation.alphabetical}</option>
                    <option value="newest">{vikinger_translation.newest_groups}</option>
                    <option value="active">{vikinger_translation.recently_active}</option>
                  </select>
                  <IconSVG  icon="small-arrow"
                            modifiers="form-select-icon"
                  />
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className="section-filters-bar-actions">
          <GridOptions gridTypes={['big', 'small', 'list']} activeGrid={this.props.gridType} onGridOptionClick={this.props.setGrid} />
        </div>
      </div>
    );
  }
}

module.exports = GroupFilterBar;