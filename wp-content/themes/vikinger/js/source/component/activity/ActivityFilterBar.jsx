const React = require('react');

const IconSVG = require('../icon/IconSVG');

class ActivityFilterBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      action: 'all',
      filters: {
        scope: false,
        filter: {}
      }
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleScopeChange = this.handleScopeChange.bind(this);
  }

  changeScope(newScope) {
    // if scope didn't change, return
    if (newScope === this.state.filters.scope) {
      return;
    }

    this.setState((state, props) => {
      return {
        filters: {
          scope: newScope,
          filter: state.filters.filter
        }
      }
    }, () => {
      this.props.onFiltersChange(this.state.filters);
    });
  }

  handleChange(e) {
    const name = e.target.name,
          value = e.target.value,
          filter = value === 'all' ? {} : {action: value};

    this.setState((state, props) => {
      return {
        [name]: value,
        filters: {
          scope: state.filters.scope,
          filter: filter
        }
      };
    }, () => {
      // console.log('ACTIVITY FILTER BAR - FILTERS STATE: ', this.state);
      this.props.onFiltersChange(this.state.filters);
    });
  }

  handleScopeChange(e) {
    const value = e.target.value === 'false' ? false : e.target.value;

    // if scope didn't change, return
    if (value === this.state.filters.scope) {
      return;
    }

    this.setState((state, props) => {
      return {
        filters: {
          scope: value,
          filter: state.filters.filter
        }
      }
    }, () => {
      this.props.onFiltersChange(this.state.filters);
    });
  }

  render() {
    return (
      <div className="quick-filters">
        {/* QUICK FILTERS TABS */}
        <div className="quick-filters-tabs">
          <p className={`quick-filters-tab ${!this.state.filters.scope ? 'active' : ''}`} onClick={() => {this.changeScope(false);}}>{vikinger_translation.all_updates}</p>
        {
          !this.props.hideSecondaryFilters &&
            <React.Fragment>
              <p  className={`quick-filters-tab ${this.state.filters.scope === 'mentions' ? 'active' : ''}`}
                  onClick={() => {this.changeScope('mentions');}}>{vikinger_translation.mentions}
              </p>
              <p  className={`quick-filters-tab ${this.state.filters.scope === 'favorites' ? 'active' : ''}`}
                  onClick={() => {this.changeScope('favorites');}}>{vikinger_translation.favorites}
              </p>
            {
              vikinger_constants.plugin_active.buddypress_friends &&
                <p  className={`quick-filters-tab ${this.state.filters.scope === 'friends' ? 'active' : ''}`}
                    onClick={() => {this.changeScope('friends');}}>{vikinger_translation.friends}
                </p>
            }
            {
              vikinger_constants.plugin_active.buddypress_groups && !this.props.hideGroupsFilter &&
                <p  className={`quick-filters-tab ${this.state.filters.scope === 'groups' ? 'active' : ''}`}
                    onClick={() => {this.changeScope('groups');}}>{vikinger_translation.groups}
                </p>
            }
            </React.Fragment>
        }
        </div>
        {/* /QUICK FILTERS TABS */}

        {/* QUICK FILTERS FORM */}
        <form className="quick-filters-form quick-filters-form-mobile">
          <div className="form-row">
            <div className="form-item">
              <div className="form-select">
                <label htmlFor="activity-scope">{vikinger_translation.scope}</label>
                <select id="activity-scope" name="scope" value={this.state.filters.scope} onChange={this.handleScopeChange}>
                  <option value="false">{vikinger_translation.all_updates}</option>
                {
                  !this.props.hideSecondaryFilters &&
                    <React.Fragment>
                      <option value="mentions">{vikinger_translation.mentions}</option>
                      <option value="favorites">{vikinger_translation.favorites}</option>
                    {
                      vikinger_constants.plugin_active.buddypress_friends &&
                        <option value="friends">{vikinger_translation.friends}</option>
                    }
                    {
                      vikinger_constants.plugin_active.buddypress_groups && !this.props.hideGroupsFilter &&
                        <option value="groups">{vikinger_translation.groups}</option>
                    }
                    </React.Fragment>
                }
                </select>
                <IconSVG  icon="small-arrow"
                          modifiers="form-select-icon"
                />
              </div>
            </div>
          </div>
        </form>
        {/* QUICK FILTERS FORM */}

        {/* QUICK FILTERS FORM */}
        <form className="quick-filters-form">
          <div className="form-row">
            <div className="form-item">
              <div className="form-select">
                <label htmlFor="activity-show">{vikinger_translation.show}</label>
                <select id="activity-show" name="action" value={this.state.action} onChange={this.handleChange}>
                  <option value="all">{vikinger_translation.everything}</option>
                  <option value="activity_update">{vikinger_translation.status}</option>
                  <option value="activity_share,post_share">{vikinger_translation.shares}</option>
                {
                  vikinger_constants.plugin_active.vkmedia &&
                    <React.Fragment>
                    {
                      vikinger_constants.settings.media_photo_upload_enabled && vikinger_constants.settings.media_video_upload_enabled &&
                        <option value="activity_media_update,activity_media_upload,activity_video_update,activity_video_upload">{vikinger_translation.media}</option>
                    }
                    {
                      vikinger_constants.settings.media_photo_upload_enabled &&
                        <option value="activity_media_update,activity_media_upload">{vikinger_translation.photos}</option>
                    }
                    {
                      vikinger_constants.settings.media_video_upload_enabled &&
                        <option value="activity_video_update,activity_video_upload">{vikinger_translation.videos}</option>
                    }
                    </React.Fragment>
                }
                {
                  vikinger_constants.plugin_active.buddypress_friends &&
                    <option value="friendship_created">{vikinger_translation.friendships}</option>
                }
                {
                  vikinger_constants.plugin_active.buddypress_groups &&
                    <option value="created_group">{vikinger_translation.new_groups}</option>
                }
                {
                  vikinger_constants.plugin_active.bbpress &&
                    <React.Fragment>
                      <option value="bbp_topic_create">{vikinger_translation.forum_topics}</option>
                      <option value="bbp_reply_create">{vikinger_translation.forum_replies}</option>
                    </React.Fragment>
                }
                </select>
                <IconSVG  icon="small-arrow"
                          modifiers="form-select-icon"
                />
              </div>
            </div>
          </div>
        </form>
        {/* QUICK FILTERS FORM */}
      </div>
    );
  }
}

module.exports = ActivityFilterBar;