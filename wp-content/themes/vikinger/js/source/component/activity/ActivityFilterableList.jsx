const React = require('react');

const app = require('../../utils/core');

const WP_Router = require('../../router/WP_Router')();

const ActivityForm = require('./ActivityForm'),
      ActivityFilterBar = require('./ActivityFilterBar'),
      ActivityList = require('./ActivityList'),
      Notification = require('../notification/Notification'),
      Loader = require('../loader/Loader');

const Paginator = require('../utils/Paginator');

const ScrollPager = require('../pager/ScrollPager');

class ActivityFilterableList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activities: [],
      pinnedActivityID: false,
      initialFetch: true,
      fetchingUser: false,
      loggedUser: false,
      moreItems: true
    };

    this.currentPage = 1;
    this.createCount = 0;
    this.deleteCount = 0;

    this.filters = {
      per_page: this.props.perPage,
      sort: this.props.order,
      show_hidden: this.props.groupID ? true : false,
      filter: {}
    };

    if (!this.props.noFilter) {
      this.filters.filter.object = [
        'activity',
        'profile',
        'gamipress'
      ];

      this.filters.filter.action = [
        'activity_update',
        'activity_share',
        'post_share',
        'new_avatar',
        'new_member'
      ];

      // add group activity object and actions if the BuddyPress groups component is active
      if (vikinger_constants.plugin_active.buddypress_groups) {
        this.filters.filter.object.push('groups');
        this.filters.filter.action.push('created_group', 'joined_group');
      }

      // add friend activity object and actions if the BuddyPress friends component is active
      if (vikinger_constants.plugin_active.buddypress_friends) {
        this.filters.filter.object.push('friends');
        this.filters.filter.action.push('friendship_created');
      }

      // add vkmedia activity actions if the plugin is active
      if (vikinger_constants.plugin_active.vkmedia) {
        this.filters.filter.action.push('activity_media_update', 'activity_media_upload');
        this.filters.filter.action.push('activity_video_update', 'activity_video_upload');
      }

      // add bbpress activity object and actions if the plugin is active
      if (vikinger_constants.plugin_active.bbpress) {
        this.filters.filter.object.push('bbpress');
        this.filters.filter.action.push('bbp_topic_create', 'bbp_reply_create');
      }
    }

    if (this.props.activityID) {
      this.filters.in = this.props.activityID;
    }

    this.getActivitiesPage = this.getActivitiesPage.bind(this);
    this.onFiltersChange = this.onFiltersChange.bind(this);

    this.createActivity = this.createActivity.bind(this);
    this.deleteActivity = this.deleteActivity.bind(this);

    this.pinActivity = this.pinActivity.bind(this);
    this.unpinActivity = this.unpinActivity.bind(this);

    this.onCreatedActivity = this.onCreatedActivity.bind(this);

    this.onPlay = this.onPlay.bind(this);
  }

  onFiltersChange(filters) {
    app.deepExtend(this.filters, filters);

    if (typeof this.filters.filter.action === 'undefined') {
      this.filters.filter.action = [
        'activity_update',
        'activity_share',
        'post_share',
        'new_avatar',
        'new_member'
      ];

      // add group activity actions if the BuddyPress groups component is active
      if (vikinger_constants.plugin_active.buddypress_groups) {
        this.filters.filter.action.push('created_group', 'joined_group');
      }

      // add friend activity actions if the BuddyPress friends component is active
      if (vikinger_constants.plugin_active.buddypress_friends) {
        this.filters.filter.action.push('friendship_created');
      }

      // add vkmedia activity actions if the plugin is active
      if (vikinger_constants.plugin_active.vkmedia) {
        this.filters.filter.action.push('activity_media_update', 'activity_media_upload');
        this.filters.filter.action.push('activity_video_update', 'activity_video_upload');
      }

      // add bbpress activity actions if the plugin is active
      if (vikinger_constants.plugin_active.bbpress) {
        this.filters.filter.action.push('bbp_topic_create', 'bbp_reply_create');
      }
    }

    this.filters.filter.object = [
      'activity',
      'profile',
      'gamipress'
    ];

    // add group activity object if the BuddyPress groups component is active
    if (vikinger_constants.plugin_active.buddypress_groups) {
      this.filters.filter.object.push('groups');
    }

    // add friend activity object if the BuddyPress friends component is active
    if (vikinger_constants.plugin_active.buddypress_friends) {
      this.filters.filter.object.push('friends');
    }

    // add bbpress activity object if the plugin is active
    if (vikinger_constants.plugin_active.bbpress) {
      this.filters.filter.object.push('bbpress');
    }

    // console.log('ACTIVITY FILTERABLE LIST - ON FILTERS CHANGE: ', this.filters);

    this.reloadActivities();
  }

  getPinnedActivity(callback) {
    WP_Router.getPinnedActivity({userID: this.props.userID}, (response) => {
      // console.log('ACTIVITY FILTERABLE LIST - PINNED ACTIVITY: ', response);

      if (response) {
        const config = {
          filter: {
            user_id: this.props.userID
          },
          in: response
        };
    
        app.deepExtend(config.filter, this.filters.filter);

        if (this.filters.scope) {
          config.scope = this.filters.scope;
        }
        
        // console.log('ACTIVITY FILTERABLE LIST - GET PINNED ACTIVITY FILTERS: ', config);

        WP_Router.getActivities(config, callback);
      } else {
        // console.log('ACTIVITY FILTERABLE LIST - NO PINNED ACTIVITY FOR USER: ', this.props.userID);
        callback(false);
      }
    });
  }

  getActivities(callback, options = {}) {
    // get next page to fetch based on create and delete counts
    this.currentPage = Paginator.getNextPageToFetch({
      page: this.currentPage,
      per_page: this.props.perPage,
      createCount: this.createCount,
      deleteCount: this.deleteCount
    });

    // reset counts
    this.createCount = 0;
    this.deleteCount = 0;

    const config = {
      page: this.currentPage
    };

    app.deepExtend(config, this.filters);
    app.deepExtend(config, options);

    // get activities of this user only
    if (this.props.userID) {
      config.filter.user_id = this.props.userID;
    }

    // get activities of this group only
    if (this.props.groupID) {
      config.filter.primary_id = this.props.groupID;
      config.filter.object = 'groups';
    }

    // console.log('ACTIVITY FILTERABLE LIST - ACTIVITY FILTERS: ', config);

    WP_Router.getActivities(config, callback);
  }

  reloadActivities() {
    this.currentPage = 1;

    // reset counts
    this.createCount = 0;
    this.deleteCount = 0;

    this.setState({
      activities: [],
      moreItems: true,
      initialFetch: true,
    }, this.getActivitiesPage);
  }

  preloadActivities(options, scope) {
    const preloadedActivities = jQuery.Deferred();

    this.getActivities((response) => {
      // console.log('ACTIVITY FILTERABLE LIST - PRELOADED ACTIVITY DATA: ', response);

      // cancel if scope changed
      const newScope = this.filters.scope;

      if (newScope !== scope) {
        preloadedActivities.resolve([], false);
        return;
      }

      this.currentPage++;

      const activitiesWithoutDuplicates = Paginator.removeDuplicates(this.state.activities, response.activities, 'id');

      preloadedActivities.resolve(activitiesWithoutDuplicates, response.has_more_items);
    }, options);

    return preloadedActivities.promise();
  }

  getActivitiesNextPage(options, scope, callback) {
    if (this.currentPage === 1) {
      this.getActivities((response) => {
        // console.log('ACTIVITY FILTERABLE LIST - ACTIVITY DATA: ', response);
  
        // cancel if scope changed
        const newScope = this.filters.scope;
  
        if (newScope !== scope) {
          callback(false);
          return;
        }
  
        this.currentPage++;
        
        this.setState((state, props) => {
          const activitiesWithoutDuplicates = Paginator.removeDuplicates(state.activities, response.activities, 'id');
  
          return {
            activities: state.activities.concat(activitiesWithoutDuplicates),
            moreItems: response.has_more_items,
            initialFetch: false
          };
        }, () => {
          callback(response.has_more_items);
        });

        // preload next page activities
        this.preloadedActivities = this.preloadActivities(options, this.filters.scope);
      }, options);
    } else {
      // dump preloaded activities and preload next page if has more items
      this.preloadedActivities
      .done((activities, hasMoreItems) => {
        this.setState({
          activities: this.state.activities.concat(activities),
          moreItems: hasMoreItems
        }, () => {
          callback(hasMoreItems);
        });

        // preload next page if has more items
        if (hasMoreItems) {
          // preload next page activities
          this.preloadedActivities = this.preloadActivities(options, this.filters.scope);
        }
      });
    }
  }

  getActivitiesPage(callback = () => {}) {
    const startingScope = this.filters.scope;

    // if viewing first page of logged user profile, check if there is a pinned activity to get
    if (this.props.userID && (this.currentPage === 1)) {
      this.getPinnedActivity((response) => {
        // console.log('ACTIVITY FILTERABLE LIST - PINNED ACTIVITY DATA: ', response);

        let options = {};
        
        if (response && response.activities && response.activities.length > 0) {
          // exclude pinned activity
          options = {exclude: response.activities[0].id};

          this.setState({
            activities: response.activities,
            pinnedActivityID: response.activities[0].id
          });
        }

        this.getActivitiesNextPage(options, startingScope, callback);
      });
    } else {
      // exclude pinned activity if exists
      const options = this.state.pinnedActivityID ? {exclude: this.state.pinnedActivityID} : {};

      this.getActivitiesNextPage(options, startingScope, callback);
    }
  }

  createActivity(data, callback) {
    // console.log('ACTIVITY FILTERABLE LIST - CREATE ACTIVITY WITH DATA: ', data);

    const itemID = Number.parseInt(data.postIn, 10);

    // post public by default
    let hideSitewide = false;

    // if posting to a group, get group privacy to set hideSitewide
    if (itemID !== 0) {
      for (const group of this.state.loggedUser.groups) {
        // user is a member of the group
        if (group.id === itemID) {
          // hide sitewide if not public group
          hideSitewide = group.status !== 'public';
          break;
        }
      }
    }

    let uploadable_media = false;

    if (data.uploadable_media) {
      const component = itemID === 0 ? 'member' : 'group',
            componentID = component === 'member' ? this.state.loggedUser.id : itemID,
            files = [];

      for (const media of data.uploadable_media) {
        files.push(media.file);
      }

      uploadable_media = {
        files: files,
        component: {
          type: component,
          id: componentID,
          uploader_id: this.state.loggedUser.id
        }
      };
    }

    let activityType = 'activity_update';

    if (uploadable_media) {
      if (data.uploadable_media_type === 'image') {
        activityType = 'activity_media_update';
      } else if (data.uploadable_media_type === 'video') {
        activityType = 'activity_video_update';
      }
    }

    const activityData = {
      creation_config: {
        item_id: itemID,
        user_id: this.state.loggedUser.id,
        component: itemID === 0 ? 'activity' : 'groups',
        type: activityType,
        content: data.text.trim(),
        hide_sitewide: hideSitewide
      },
      attached_media: data.attached_media,
      uploadable_media: uploadable_media,
      uploadable_media_type: data.uploadable_media_type
    };

    // console.log('ACTIVITY FILTERABLE LIST - CREATE ACTIVITY: ', activityData);

    WP_Router.createActivity(activityData, (response) => {
      // console.log('ACTIVITY FILTERABLE LIST - CREATE ACTIVITY RESPONSE: ', response);

      // activity created
      if (response) {
        this.onCreatedActivity(response, itemID, callback);
      } else {
        callback(response);
      }
    });
  }

  onCreatedActivity(activityID, itemID, callback) {
    this.createCount++;

    const postedInMyProfile = this.state.loggedUser.id === this.props.userID,
          postedInMyGroup = itemID === this.props.groupID,
          postedInNewsfeed = !this.props.userID;

    // if activity created and logged user is viewing newsfeed, it's own profile or the group where he is posting
    // get created activity for display
    if (postedInNewsfeed || postedInMyProfile || postedInMyGroup) {
      // get created activity using current filters, if the created activity returns then prepend it
      // otherwise it shouldn't be displayed with current filters
      const getCreatedActivityFilters = app.deepMerge(this.filters);
      // limit to created activity id
      getCreatedActivityFilters.in = activityID;

      WP_Router.getActivities(getCreatedActivityFilters, (createdActivityResponse) => {
        // console.log('ACTIVITY FILTERABLE LIST - CREATED ACTIVITY GET: ', createdActivityResponse);

        if (createdActivityResponse.activities.length) {
          const createdActivity = createdActivityResponse.activities[0];

          this.setState((state, props) => {
            const newActivities = state.activities.slice();

            newActivities.unshift(createdActivity);

            return {
              activities: newActivities
            };
          });
        }

        callback(activityID);
      });
    }
  }

  deleteActivity(activity_id, callback) {
    // console.log('ACTIVITY FILTERABLE LIST - DELETE ACTIVITY: ', activity_id);

    WP_Router.deleteActivity(activity_id, (response) => {
      // console.log('ACTIVITY FILTERABLE LIST - DELETE ACTIVITY RESPONSE: ', response);

      callback(response);

      // activity deleted
      if (response) {
        this.deleteCount++;

        // remove from state activities
        this.setState((state, props) => {
          const newActivities = state.activities.filter((activity) => {
            return activity.id !== activity_id;
          });

          return {
            activities: newActivities
          };
        });
      }
    });
  }

  pinActivity(activityID, callback) {
    // console.log('ACTIVITY FILTERABLE LIST - PIN ACTIVITY ID: ', activityID, 'FROM USER: ', this.state.loggedUser.id);

    const config = {
      userID: this.state.loggedUser.id,
      activityID: activityID
    };

    WP_Router.pinActivity(config, (response) => {
      // console.log('ACTIVITY FILTERABLE LIST - PIN RESPONSE: ', response);

      if (response) {
        this.setState({
          pinnedActivityID: activityID
        });
      }

      callback();
    });
  }

  unpinActivity(callback) {
    // console.log('ACTIVITY FILTERABLE LIST - UNPIN ACTIVITY FROM USER: ', this.state.loggedUser.id);

    const config = {
      userID: this.state.loggedUser.id
    };

    WP_Router.unpinActivity(config, (response) => {
      // console.log('ACTIVITY FILTERABLE LIST - UNPIN RESPONSE: ', response);

      if (response) {
        this.setState({
          pinnedActivityID: false
        });
      }

      callback();
    });
  }

  getLoggedUser() {
    this.setState({
      fetchingUser: true
    });

    WP_Router.getLoggedInMember('user-activity')
    .done((loggedUser) => {
      // console.log('ACTIVITY FILTERABLE LIST - LOGGED IN USER: ', loggedUser);

      this.setState({
        loggedUser: loggedUser,
        fetchingUser: false
      });
    });
  }

  onPlay(activityID = false) {
    this.setState((state, props) => {
      const activities = state.activities.slice();

      // console.log('ACTIVITY FILTERABLE LIST - ON PLAY ACTIVITY ID: ', activityID);

      for (const activity of activities) {
        if (activity.meta && activity.meta.attached_media_type && (activity.meta.attached_media_type[0] === 'youtube')) {
          // stop all videos if activityID is not set
          if (!activityID) {
            activity.meta.attached_media_stop = !activity.meta.attached_media_stop;
          // stop all other videos if activityID is set
          } else if (activity.id !== activityID) {
            activity.meta.attached_media_stop = !activity.meta.attached_media_stop;
          }
        }
      }

      // console.log('ACTIVITY FILTERABLE LIST - ON PLAY NEW ACTIVITIES: ', activities);

      return {
        activities: activities
      };
    });
  }

  componentDidMount() {
    this.getLoggedUser();

    this.getActivitiesPage();
  }

  render() {
    let postInDefault = '0';

    // if user is logged in and viewing a group activity feed
    if (this.state.loggedUser && this.props.groupID) {
      // check if the user is a member of the group and set the default post option to that group
      for (const group of this.state.loggedUser.groups) {
        // user is a member of the group
        if (group.id === this.props.groupID) {
          postInDefault = group.id + '';
          break;
        }
      }
    }

    const onNewsfeed = this.state.loggedUser && !this.props.userID && !this.props.groupID && !this.props.activityID,
          ownProfile = this.state.loggedUser && (this.state.loggedUser.id === this.props.userID),
          onGroupNewsfeed = this.state.loggedUser && this.props.groupID,
          ownGroup = onGroupNewsfeed && this.state.loggedUser.groups.some((group) => !group.is_banned && (group.id === this.props.groupID));

    return (
      <div className="grid">
        {
          this.state.fetchingUser &&
            <Loader />
        }
        {
          !this.state.fetchingUser &&
            <React.Fragment>
              {
                (onNewsfeed || ownProfile || ownGroup) &&
                  <ActivityForm user={this.state.loggedUser}
                                postIn={postInDefault}
                                onSubmit={this.createActivity}
                  />
              }
              {
                !this.props.activityID &&
                  <ActivityFilterBar  onFiltersChange={this.onFiltersChange}
                                      hideGroupsFilter={Boolean(this.props.groupID)}
                                      hideSecondaryFilters={!this.state.loggedUser && !this.props.userID && !this.props.groupID}
                  />
              }

              <ScrollPager modifiers="grid" loadMoreItems={this.getActivitiesPage} moreItems={this.state.moreItems} initialFetch={this.state.initialFetch}>
              {
                (this.state.activities.length === 0) && !this.state.moreItems &&
                  <Notification title={vikinger_translation.activity_no_results_title}
                                text={vikinger_translation.activity_no_results_text}
                  />
              }
              {
                (this.state.activities.length > 0) &&
                  <ActivityList data={this.state.activities}
                                user={this.state.loggedUser}
                                profileUserID={this.props.userID}
                                pinnedActivityID={this.state.pinnedActivityID}
                                pinActivity={this.pinActivity}
                                unpinActivity={this.unpinActivity}
                                deleteActivity={this.deleteActivity}
                                onShare={this.onCreatedActivity}
                                onPlay={this.onPlay}
                  />
              }
              </ScrollPager>
            </React.Fragment>
        }
      </div>
    );
  }
}

module.exports = ActivityFilterableList;