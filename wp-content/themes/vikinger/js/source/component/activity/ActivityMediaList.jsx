const React = require('react');

const app = require('../../utils/core');

const WP_Router = require('../../router/WP_Router')();

const Notification = require('../notification/Notification'),
      SectionHeader = require('../section/SectionHeader'),
      Loader = require('../loader/Loader');
  
const Paginator = require('../utils/Paginator');

const ScrollPager = require('../pager/ScrollPager');

class ActivityMediaList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activities: [],
      activitiesCount: 0,
      selectedActivities: [],
      selectedAll: false,
      reactions: [],
      user: false,
      loggedUser: false,
      moreItems: true,
      initialFetch: true,
      loading: true
    };

    this.currentPage = 1;
    this.createCount = 0;
    this.deleteCount = 0;

    this.filters = {
      per_page: this.props.perPage,
      sort: this.props.order,
      show_hidden: props.groupID ? true : false,
      filter: {
        object: props.userID ? 'activity' : 'groups',
        action: props.activityGetType,
        primary_id: props.userID ? props.userID : props.groupID
      }
    };

    this.getActivitiesPage = this.getActivitiesPage.bind(this);

    this.toggleAllSelectable = this.toggleAllSelectable.bind(this);
    this.toggleSelectableActive = this.toggleSelectableActive.bind(this);
    this.activitiesSelected = this.activitiesSelected.bind(this);
    this.deleteSelected = this.deleteSelected.bind(this);
    this.onUpload = this.onUpload.bind(this);
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

    // console.log('ACTIVITY MEDIA LIST - ACTIVITY FILTERS: ', config);

    WP_Router.getActivities(config, callback);
  }

  reloadActivities() {
    this.currentPage = 1;

    // reset counts
    this.createCount = 0;
    this.deleteCount = 0;

    this.setState({
      activities: [],
      selectedActivities: [],
      moreItems: true,
      initialFetch: true
    }, this.getActivitiesPage);
  }

  activitiesSelected() {
    for (const item of this.state.selectedActivities) {
      if (item) {
        return true;
      }
    }

    return false;
  }

  deleteSelected(callback) {
    const activityMediaToDelete = [];

    for (let i = 0; i < this.state.activities.length; i++) {
      const activity = this.state.activities[i];

      // if the activity is selected
      if (this.state.selectedActivities[i]) {
        activityMediaToDelete.push({
          activity_id: activity.id,
          media: activity.media,
          component: {
            id: activity.item_id,
            type: activity.component === 'activity' ? 'member' : 'group'
          }
        });
      }
    }

    // console.log('ACTIVITY MEDIA LIST - DELETE SELECTED: ', activityMediaToDelete);

    WP_Router.deleteActivityMedia(activityMediaToDelete, (response) => {
      // console.log('ACTIVITY MEDIA LIST - DELETED RESPONSE: ', response);

      callback();

      // if deleted successfully, response is array of deleted activity media IDs
      if (response) {
        this.deleteCount += response.length;

        // refresh activity count
        this.getActivitiesCount();

        // remove from state activities
        this.setState((state, props) => {
          const newActivities = state.activities.filter((item) => {
            return !response.some((activity_id) => {
              return activity_id == item.id;
            });
          });
    
          // console.log('ACTIVITY MEDIA LIST - ACTIVITIES AFTER DELETE: ', newActivities);
    
          return {
            activities: newActivities,
            selectedActivities: (new Array(newActivities.length)).fill(false),
            selectedAll: false
          };
        });
      } else {
        // console.log('ACTIVITY MEDIA LIST - DELETE ERROR');
      }
    });
  }

  toggleSelectableActive(i) {
    this.setState((state, props) => {
      const newSelectedActivities = state.selectedActivities.slice();
      newSelectedActivities[i] = !newSelectedActivities[i];

      // console.log('ACTIVITY MEDIA LIST - SELECTED ACTIVITIES: ', newSelectedActivities);

      return {
        selectedActivities: newSelectedActivities
      };
    });
  }

  toggleAllSelectable() {
    if (!this.state.selectedAll) {
      this.selectAll();
    } else {
      this.unselectAll();
    }
  }

  selectAll() {
    this.setState((state, props) => {
      return {
        selectedActivities: (new Array(state.activities.length)).fill(true),
        selectedAll: true
      };
    });
  }

  unselectAll() {
    this.setState((state, props) => {
      return {
        selectedActivities: (new Array(state.activities.length)).fill(false),
        selectedAll: false
      };
    });
  }

  getActivitiesPage(callback = () => {}) {
    this.getActivities((response) => {
      // console.log('ACTIVITY MEDIA LIST - ACTIVITY DATA: ', response);

      this.currentPage++;

      this.setState((state, props) => {
        const activitiesWithoutDuplicates = Paginator.removeDuplicates(state.activities, response.activities, 'id'),
              newSelectedActivities = (new Array(activitiesWithoutDuplicates.length)).fill(false);

        return {
          activities: state.activities.concat(activitiesWithoutDuplicates),
          selectedActivities: state.selectedActivities.concat(newSelectedActivities),
          moreItems: response.has_more_items,
          initialFetch: false
        };
      }, () => {
        callback(response.has_more_items);
      });
    });
  }

  onUpload(data, callback) {
    // console.log('ACTIVITY MEDIA LIST - CREATE ACTIVITY WITH DATA: ', data);

    // post to own profile or group and hide sitewide according to group status
    const itemID = this.props.groupID ? this.props.groupID : 0,
          hideSitewide = this.props.groupID ? this.state.user.status !== 'public' : false;

    const component = itemID === 0 ? 'member' : 'group',
          componentID = component === 'member' ? this.state.loggedUser.id : itemID,
          files = [];

    for (const media of data.uploadable_media) {
      files.push(media.file);
    }

    const uploadable_media = {
      files: files,
      component: {
        type: component,
        id: componentID,
        uploader_id: this.state.loggedUser.id
      }
    };

    const activityData = {
      creation_config: {
        item_id: itemID,
        user_id: this.state.loggedUser.id,
        component: itemID === 0 ? 'activity' : 'groups',
        type: this.props.activityCreateType,
        content: data.text.trim(),
        hide_sitewide: hideSitewide
      },
      uploadable_media: uploadable_media,
      uploadable_media_type: data.uploadable_media_type
    };

    // console.log('ACTIVITY MEDIA LIST - CREATE ACTIVITY: ', activityData);

    WP_Router.createActivity(activityData, (response) => {
      // console.log('ACTIVITY MEDIA LIST - CREATE ACTIVITY RESPONSE: ', response);

      callback(response);

      // if activity created successfully
      if (response) {
        // refresh activity count
        this.getActivitiesCount();
        // reload activities to show newly created ones
        this.reloadActivities();
      }
    });
  }

  getLoggedUser() {
    WP_Router.getLoggedInMember('user-activity')
    .done((loggedUser) => {
      // console.log('ACTIVITY MEDIA LIST - LOGGED IN USER: ', loggedUser);

      this.setState({
        loggedUser: loggedUser
      });
    });
  }

  getActivityMediaListUser() {
    if (this.props.userID) {
      WP_Router.getMembers({include: [this.props.userID]})
      .done((user) => {
        // console.log('ACTIVITY MEDIA LIST - ACTIVITY USER: ', user[0]);
  
        this.setState({
          user: user[0],
          loading: false
        });
      });
    } else if (this.props.groupID) {
      WP_Router.getGroups({include: [this.props.groupID]})
      .done((group) => {
        // console.log('ACTIVITY MEDIA LIST - ACTIVITY GROUP: ', group[0]);
  
        this.setState({
          user: group[0],
          loading: false
        });
      });
    }
  }

  getActivitiesCount() {
    const config = {
      show_hidden: this.props.groupID ? true : false,
      filter: this.filters.filter
    };

    // console.log('ACTIVITY MEDIA LIST - ACTIVITY COUNT FILTERS: ', config);

    WP_Router.getActivities(config, (response) => {
      // console.log('ACTIVITY MEDIA LIST - ACTIVITY TOTAL COUNT: ', response.activities.length);

      this.setState({
        activitiesCount: response.activities.length
      });
    });
  }

  componentDidMount() {
    this.getLoggedUser();
    
    this.getActivityMediaListUser();

    this.getActivitiesCount();

    this.getActivitiesPage();

    WP_Router.getReactions()
    .done((response) => {
      // console.log('ACTIVITY MEDIA LIST - REACTIONS: ', response);

      this.setState({
        reactions: response
      });
    });
  }

  render() {
    const ItemPreviewList = this.props.itemPreviewList,
          ActivityListOptions = this.props.activityListOptions;

    const loggedUser = this.state.loggedUser,
          inLoggedUserProfile = loggedUser && (loggedUser.id === this.props.userID);

    // check if the logged user is a member of the group he is seeing
    let inLoggedUserGroup = false;

    if (loggedUser && this.props.groupID) {
      for (const group of loggedUser.groups) {
        // if logged user is a member of this group and is not banned
        if ((group.id === this.props.groupID) && !group.is_banned) {
          inLoggedUserGroup = true;
          break;
        }
      }
    }

    // check if logged user is group admin or mod
    let loggedUserIsGroupAdmin = false,
        loggedUserIsGroupMod = false;

    if (inLoggedUserGroup) {
      for (const group of loggedUser.groups) {
        if (group.id === this.props.groupID) {
          loggedUserIsGroupAdmin = group.is_admin;
          loggedUserIsGroupMod = group.is_mod;
          break;
        }
      }
    }

    // allow logged user to delete items if viewing it's own profile, or a group he is an admin or mod of
    const allowDelete = inLoggedUserProfile || (inLoggedUserGroup && (loggedUserIsGroupAdmin || loggedUserIsGroupMod));

    return (
      <React.Fragment>
      {
        this.state.loading &&
          <Loader />
      }
      {
        !this.state.loading &&
          <React.Fragment>
            <SectionHeader  pretitle={`${vikinger_translation.browse} ${this.state.user.name}`}
                            title={this.props.sectionTitle}
                            titleCount={this.state.activitiesCount}
            >
              {
                (inLoggedUserProfile || inLoggedUserGroup) &&
                  <ActivityListOptions  user={loggedUser}
                                        onUpload={this.onUpload}
                                        allowDelete={allowDelete}
                                        deleteSelected={this.deleteSelected}
                                        toggleAllSelectable={this.toggleAllSelectable}
                                        selectedAll={this.state.selectedAll}
                                        activities={this.state.activities}
                                        activitiesSelected={this.activitiesSelected}
                  />
              }
            </SectionHeader>

            <ScrollPager loadMoreItems={this.getActivitiesPage} moreItems={this.state.moreItems} initialFetch={this.state.initialFetch}>
              <React.Fragment>
                {
                  (this.state.activities.length === 0) && !this.state.moreItems &&
                    <Notification title={this.props.noResultsTitle}
                                  text={this.props.noResultsText}
                    />
                }
                {
                  (this.state.activities.length > 0) &&
                    <div className={`grid ${this.props.gridModifiers} centered-on-mobile`}>
                      <ItemPreviewList  data={this.state.activities}
                                        user={loggedUser}
                                        reactions={this.state.reactions}
                                        modifiers={this.props.itemPreviewModifiers}
                                        selectable={allowDelete}
                                        selectedItems={this.state.selectedActivities}
                                        toggleSelectableActive={this.toggleSelectableActive}
                      />
                    </div>
                }
              </React.Fragment>
            </ScrollPager>
          </React.Fragment>
      }
      </React.Fragment>
    );
  }
}

module.exports = ActivityMediaList;