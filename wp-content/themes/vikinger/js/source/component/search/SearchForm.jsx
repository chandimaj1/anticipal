const React = require('react');

const WP_Router = require('../../router/WP_Router')();

const plugins = require('../../utils/plugins');

const IconSVG = require('../icon/IconSVG'),
      SearchStatus = require('../user-status/SearchStatus'),
      LoaderSpinnerSmall = require('../loader/LoaderSpinnerSmall');

const SimpleBar = require('simplebar-react');

class SearchForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      s: '',
      members: [],
      groups: [],
      posts: [],
      loadingMembers: false,
      loadingGroups: false,
      loadingPosts: false
    };

    this.searchPostsTimeoutID = 0;
    this.searchMembersTimeoutID = 0;
    this.searchGroupsTimeoutID = 0;

    this.handleChange = this.handleChange.bind(this);
    this.clearSearch = this.clearSearch.bind(this);

    this.searchDropdownRef = React.createRef();

    this.simplebarStyles = {overflowX: 'hidden', maxHeight: '420px', paddingBottom: '14px'};

    this.searchPlaceholderText = vikinger_translation.search_placeholder;

    const searchPlaceholderItems = [];

    if (vikinger_constants.plugin_active.buddypress) {
      if (vikinger_constants.settings.search_members_enabled) {
        searchPlaceholderItems.push(vikinger_translation.members.toLowerCase());
      }

      if (vikinger_constants.plugin_active.buddypress_groups && vikinger_constants.settings.search_groups_enabled) {
        searchPlaceholderItems.push(vikinger_translation.groups.toLowerCase());
      }
    }

    if (vikinger_constants.settings.search_blog_enabled) {
      searchPlaceholderItems.push(vikinger_translation.posts.toLowerCase());
    }

    for (let i = 0; i < searchPlaceholderItems.length; i++) {
      const searchPlaceholderItem = searchPlaceholderItems[i];

      if (i === 0) {
        this.searchPlaceholderText = `${this.searchPlaceholderText} ${searchPlaceholderItem}`;
      } else if (i < (searchPlaceholderItems.length - 1)) {
        this.searchPlaceholderText = `${this.searchPlaceholderText}, ${searchPlaceholderItem}`;
      } else {
        this.searchPlaceholderText = `${this.searchPlaceholderText} ${vikinger_translation.and} ${searchPlaceholderItem}`;
      }
    }
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    }, () => {
      if (this.state.s !== '') {
        this.setState({
          loadingMembers: true,
          loadingGroups: true,
          loadingPosts: true
        });

        this.searchDropdown.showDropdowns();

        // only do member and group search if the BuddyPress plugin is active
        if (vikinger_constants.plugin_active.buddypress) {
          if (vikinger_constants.settings.search_members_enabled) {
            // cancel previous search
            if (this.searchMembersTimeoutID) {
              window.clearTimeout(this.searchMembersTimeoutID);
            }

            this.searchMembersTimeoutID = window.setTimeout(this.searchMembers.bind(this), 500);
          }

          if (vikinger_constants.plugin_active.buddypress_groups && vikinger_constants.settings.search_groups_enabled) {
            // cancel previous search
            if (this.searchGroupsTimeoutID) {
              window.clearTimeout(this.searchGroupsTimeoutID);
            }

            this.searchGroupsTimeoutID = window.setTimeout(this.searchGroups.bind(this), 500);
          }
        }

        if (vikinger_constants.settings.search_blog_enabled) {
          // cancel previous search
          if (this.searchPostsTimeoutID) {
            window.clearTimeout(this.searchPostsTimeoutID);
          }

          this.searchPostsTimeoutID = window.setTimeout(this.searchPosts.bind(this), 500);
        }
      } else {
        this.searchDropdown.hideDropdowns();

        // cancel previous search
        if (this.searchMembersTimeoutID) {
          window.clearTimeout(this.searchMembersTimeoutID);
        }

        // cancel previous search
        if (this.searchGroupsTimeoutID) {
          window.clearTimeout(this.searchGroupsTimeoutID);
        }

        // cancel previous search
        if (this.searchPostsTimeoutID) {
          window.clearTimeout(this.searchPostsTimeoutID);
        }

        this.setState({
          members: [],
          groups: [],
          posts: [],
          loadingMembers: false,
          loadingGroups: false,
          loadingPosts: false
        });
      }
    });
  }

  clearSearch() {
    this.searchDropdown.hideDropdowns();

    this.setState({
      s: '',
      members: [],
      loadingMembers: false,
      groups: [],
      loadingGroups: false,
      posts: [],
      loadingPosts: false
    });
  }

  searchMembers() {
    this.setState({
      loadingMembers: true
    });

    const searchMembersFilters = {
      per_page: 4,
      search: this.state.s
    };

    // exclude provided user id (logged user)
    if (this.props.userID) {
      searchMembersFilters.exclude = this.props.userID;
    }

    const searchMembersPromise = WP_Router.getMembers(searchMembersFilters),
          currentSearch = this.state.s;

    searchMembersPromise
    .done((response) => {
      // console.log('SEARCH FORM - SEARCH MEMBERS RESPONSE: ', response);

      // cancel search if there was a new one made after this one
      if (this.state.s !== currentSearch) {
        return;
      } else {
        this.setState({
          members: response,
          loadingMembers: false
        });
      }
    })
    .fail((error) => {
      // console.log('SEARCH FORM - SEARCH MEMBERS ERROR: ', error);

      this.setState({
        loadingMembers: false
      });
    });
  }

  searchGroups() {
    this.setState({
      loadingGroups: true
    });

    const searchGroupsFilters = {
      per_page: 4,
      search: this.state.s
      // search_columns: ['name']
    };

    const searchGroupsPromise = WP_Router.getGroups(searchGroupsFilters),
          currentSearch = this.state.s;

    searchGroupsPromise
    .done((response) => {
      // console.log('SEARCH FORM - SEARCH GROUPS RESPONSE: ', response);

      // cancel search if there was a new one made after this one
      if (this.state.s !== currentSearch) {
        return;
      } else {
        this.setState({
          groups: response,
          loadingGroups: false
        });
      }
    })
    .fail((error) => {
      // console.log('SEARCH FORM - SEARCH GROUPS ERROR: ', error);

      this.setState({
        loadingGroups: false
      });
    });
  }

  searchPosts() {
    this.setState({
      loadingPosts: true
    });

    const searchPostsFilters = {
      per_page: 4,
      s: this.state.s
    };

    const searchPostsPromise = WP_Router.getPosts(searchPostsFilters),
          currentSearch = this.state.s;

    searchPostsPromise
    .done((response) => {
      // console.log('SEARCH FORM - SEARCH POSTS RESPONSE: ', response);

      // cancel search if there was a new one made after this one
      if (this.state.s !== currentSearch) {
        return;
      } else {
        this.setState({
          posts: response,
          loadingPosts: false
        });
      }
    })
    .fail((error) => {
      // console.log('SEARCH FORM - SEARCH POSTS ERROR: ', error);

      this.setState({
        loadingPosts: false
      });
    });
  }

  componentDidMount() {
    this.searchDropdown = plugins.createDropdown({
      containerElement: this.searchDropdownRef.current,
      offset: {
        top: 57,
        left: 0
      },
      animation: {
        type: 'translate-top'
      },
      controlToggle: true,
      closeOnWindowClick: false
    });
  }

  render() {
    return (
      <div className="search-form-wrap">
        {/* INTERACTIVE INPUT */}
        <div className="interactive-input dark">
          <form className="form" method="get" action={vikinger_constants.home_url}>
            <input  type="text"
                    name="s"
                    value={this.state.s}
                    placeholder={this.searchPlaceholderText}
                    onChange={this.handleChange}
            />
            <button style={{display: 'none'}}></button>
          </form>

          {
            (this.state.s === '') &&
              <div className="interactive-input-icon-wrap">
                <IconSVG  icon="magnifying-glass"
                          modifiers="interactive-input-icon"
                />
              </div>
          }

          {
            (this.state.s !== '') &&
              <div className="interactive-input-action" onClick={this.clearSearch}>
                <IconSVG  icon="cross-thin"
                          modifiers="interactive-input-action-icon"
                />
              </div>
          }
        </div>
        {/* INTERACTIVE INPUT */}

        {/* DROPDOWN BOX */}
        <div ref={this.searchDropdownRef} className="dropdown-box padding-bottom-small">
          <SimpleBar style={this.simplebarStyles}>
          {
            vikinger_constants.plugin_active.buddypress &&
              <React.Fragment>
              {
                vikinger_constants.settings.search_members_enabled &&
                  <React.Fragment>
                    {/* DROPDOWN BOX CATEGORY */}
                    <div className="dropdown-box-category">
                      <p className="dropdown-box-category-title">{vikinger_translation.members}</p>
                    </div>
                    {/* DROPDOWN BOX CATEGORY */}

                  {
                    this.state.loadingMembers &&
                      <LoaderSpinnerSmall />
                  }
                  {
                    !this.state.loadingMembers &&
                      <React.Fragment>
                      {
                        (this.state.members.length === 0) &&
                          <p className="no-results-text">{vikinger_translation.no_members_found}</p>
                      }
                      {
                        (this.state.members.length > 0) &&
                          <div className="dropdown-box-list small no-scroll">
                          {
                            this.state.members.map((member) => {
                              return (
                                <a key={member.id} className="dropdown-box-list-item" href={member.link}>
                                  <SearchStatus type="user"
                                                data={member}
                                  />
                                </a>
                              );
                            }) 
                          }
                          </div>
                      }
                      </React.Fragment>
                  }
                  </React.Fragment>
              }
              {
                vikinger_constants.plugin_active.buddypress_groups && vikinger_constants.settings.search_groups_enabled &&
                  <React.Fragment>
                    {/* DROPDOWN BOX CATEGORY */}
                    <div className="dropdown-box-category">
                      <p className="dropdown-box-category-title">{vikinger_translation.groups}</p>
                    </div>
                    {/* DROPDOWN BOX CATEGORY */}

                  {
                    this.state.loadingGroups &&
                      <LoaderSpinnerSmall />
                  }
                  {
                    !this.state.loadingGroups &&
                      <React.Fragment>
                      {
                        (this.state.groups.length === 0) &&
                          <p className="no-results-text">{vikinger_translation.no_groups_found}</p>
                      }
                      {
                        (this.state.groups.length > 0) &&
                          <div className="dropdown-box-list small no-scroll">
                          {
                            this.state.groups.map((group) => {
                              return (
                                <a key={group.id} className="dropdown-box-list-item" href={group.link}>
                                  <SearchStatus type="group"
                                                data={group}
                                  />
                                </a>
                              );
                            }) 
                          }
                          </div>
                      }
                      </React.Fragment>
                    }
                  </React.Fragment>
              }
              </React.Fragment>
          }
            
          {
            vikinger_constants.settings.search_blog_enabled &&
              <React.Fragment>
                {/* DROPDOWN BOX CATEGORY */}
                <div className="dropdown-box-category">
                  <p className="dropdown-box-category-title">{vikinger_translation.posts}</p>
                </div>
                {/* DROPDOWN BOX CATEGORY */}

              {
                this.state.loadingPosts &&
                  <LoaderSpinnerSmall />
              }
              {
                !this.state.loadingPosts &&
                  <React.Fragment>
                  {
                    (this.state.posts.length === 0) &&
                      <p className="no-results-text">{vikinger_translation.no_posts_found}</p>
                  }
                  {
                    (this.state.posts.length > 0) &&
                      <div className="dropdown-box-list small no-scroll">
                      {
                        this.state.posts.map((post) => {
                          return (
                            <a key={post.id} className="dropdown-box-list-item" href={post.permalink}>
                              <SearchStatus type="post"
                                            data={post}
                              />
                            </a>
                          );
                        }) 
                      }
                      </div>
                  }
                  </React.Fragment>
              }
              </React.Fragment>
          }
          </SimpleBar>
        </div>
        {/* DROPDOWN BOX */}
      </div>
    );
  }
}

module.exports = SearchForm;