const React = require('react');

const WP_Router = require('../../router/WP_Router')();

const groupUtils = require('../utils/group');

const activityUtils = require('../utils/activity'),
      TagSticker = require('../tag/TagSticker'),
      ActivitySettings = require('./ActivitySettings'),
      Reactionable = require('../reaction/Reactionable'),
      PostFooter = require('../post/PostFooter'),
      ActivityCommentList = require('../comment/ActivityCommentList');

class Activity extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      favorite: props.data.favorite,
      showMore: false,
      showingMore: false,
      deleting: false
    };

    this.showMoreSettingIsEnabled = vikinger_constants.settings.activity_show_more_status === 'enabled';

    this.widgetBoxStatusRef = React.createRef();

    this.showMore = this.showMore.bind(this);
    this.showLess = this.showLess.bind(this);

    this.pinActivity = this.pinActivity.bind(this);
    this.unpinActivity = this.unpinActivity.bind(this);
    this.deleteActivity = this.deleteActivity.bind(this);
    this.addFavorite = this.addFavorite.bind(this);
    this.removeFavorite = this.removeFavorite.bind(this);
  }

  deleteActivity(callback) {
    this.setState({
      deleting: true
    });

    // console.log('ACTIVITY - DELETE ACTIVITY ID: ', this.props.data.id, 'FROM USER: ', this.props.user.id);
    this.props.deleteActivity(this.props.data.id, (response) => {
      if (!response) {
        this.setState({
          deleting: false
        });
      }
      
      callback(response);
    });
  }

  pinActivity(callback) {
    // console.log('ACTIVITY - PIN ACTIVITY ID: ', this.props.data.id, 'FROM USER: ', this.props.user.id);
    this.props.pinActivity(this.props.data.id, callback);
  }

  unpinActivity(callback) {
    // console.log('ACTIVITY - UNPIN ACTIVITY');
    this.props.unpinActivity(callback);
  }

  addFavorite(callback) {
    // console.log('ACTIVITY - ADD FAVORITE ACTIVITY ID: ', this.props.data.id, 'FROM USER: ', this.props.user.id);

    const config = {
      userID: this.props.user.id,
      activityID: this.props.data.id
    };

    WP_Router.addActivityFavorite(config, (response) => {
      // console.log('ACTIVITY - FAVORITE ADD RESPONSE: ', response);

      callback();

      if (response) {
        this.setState({
          favorite: true
        });
      }
    });
  }

  removeFavorite(callback) {
    // console.log('ACTIVITY - REMOVE FAVORITE ACTIVITY ID: ', this.props.data.id, 'FROM USER: ', this.props.user.id);

    const config = {
      userID: this.props.user.id,
      activityID: this.props.data.id
    };
    
    WP_Router.removeActivityFavorite(config, (response) => {
      // console.log('ACTIVITY - FAVORITE REMOVE RESPONSE: ', response);

      callback();

      if (response) {
        this.setState({
          favorite: false
        });
      }
    });
  }

  showMore() {
    this.setState({
      showingMore: true
    });

    this.widgetBoxStatusRef.current.classList.remove('widget-box-status-limited');
    this.widgetBoxStatusRef.current.style.maxHeight = '100%';
  }

  showLess() {
    this.setState({
      showingMore: false
    });

    this.widgetBoxStatusRef.current.classList.add('widget-box-status-limited');
    this.widgetBoxStatusRef.current.style.maxHeight = `${vikinger_constants.settings.activity_show_more_height}px`;
  }

  attachShowMoreElement() {
    this.setState({
      showMore: true
    });
    
    this.showLess();
  }

  componentDidMount() {
    if (this.showMoreSettingIsEnabled && this.widgetBoxStatusRef.current && this.widgetBoxStatusRef.current.offsetHeight > vikinger_constants.settings.activity_show_more_height) {
      this.attachShowMoreElement();
    }
  }

  render() {
    const ActivityTemplate = activityUtils().getActivityTemplate(this.props.data.type);

    const isActivityAuthor = this.props.user && (this.props.data.author.id === this.props.user.id),
          userCanPinActivity = isActivityAuthor && this.props.user.id === this.props.profileUserID;

    // let userCanUseSettings = this.props.user,
    let userCanUseSettings = true,
        userCanDeleteActivity = isActivityAuthor;

    const isGroupActivity = this.props.data.component === 'groups';

    // if this activity belongs to a group
    if (this.props.user && isGroupActivity) {
      const groupable = groupUtils(this.props.user, this.props.data.group);

      userCanUseSettings = !groupable.isBannedFromGroup();
      userCanDeleteActivity = groupable.isGroupAdmin() || groupable.isGroupMod() || (isActivityAuthor && groupable.isGroupMember());
    }

    const activityIsPinned = this.props.pinnedActivityID && (this.props.pinnedActivityID === this.props.data.id);

    return (
      <div className={`widget-box no-padding animate-slide-down ${this.state.deleting ? 'widget-box-deleted' : ''}`}>
        {/* TAG STICKERS */}
        <div className="tag-stickers">
        {
          this.state.favorite &&
            <TagSticker icon='favorite' iconModifiers='tertiary' modifiers='small animate-slide-down' />
        }
        {
          (this.props.data.hide_sitewide === 1) &&
            <TagSticker icon='private' iconModifiers='secondary' modifiers='small animate-slide-down' />
        }
        {
          activityIsPinned &&
            <TagSticker icon='pinned' iconModifiers='primary' modifiers='small animate-slide-down' />
        }
        </div>
        {/* TAG STICKERS */}

      {
        this.props.user && userCanUseSettings &&
          <ActivitySettings userCanDeleteActivity={userCanDeleteActivity}
                            userCanPinActivity={userCanPinActivity}
                            favorite={this.state.favorite}
                            pinned={activityIsPinned}
                            addFavorite={this.addFavorite}
                            removeFavorite={this.removeFavorite}
                            pinActivity={this.pinActivity}
                            unpinActivity={this.unpinActivity}
                            deleteActivity={this.deleteActivity}
          />
      }

        <ActivityTemplate data={this.props.data}
                          user={this.props.user}
                          reactions={this.props.reactions}
                          onPlay={this.props.onPlay}
                          widgetBoxStatusRef={this.widgetBoxStatusRef}
        />

      {
        this.showMoreSettingIsEnabled && this.state.showMore && !this.state.showingMore &&
          <p className="button-show-more" onClick={this.showMore}>{vikinger_translation.show_more}</p>
      }

      {
        userCanUseSettings &&
          <Reactionable entityData={{activity_id: this.props.data.id}}
                        user={this.props.user}
                        reactions={this.props.reactions}
                        reactionData={this.props.data.reactions}
                        createUserReaction={WP_Router.createActivityUserReaction}
                        deleteUserReaction={WP_Router.deleteActivityUserReaction}
          >
            {
              (reactionData, userReaction, createUserReaction, deleteUserReaction) => {
                return (
                  <PostFooter commentCount={this.props.data.comment_count}
                              shareType='activity'
                              shareData={this.props.data}
                              shareCount={Number.parseInt(this.props.data.meta.share_count, 10) || 0}
                              onShare={this.props.onShare}
                              user={this.props.user}
                              reactions={this.props.reactions}
                              reactionData={reactionData}
                              userReaction={userReaction}
                              createUserReaction={createUserReaction}
                              deleteUserReaction={deleteUserReaction}
                              postType='activity'
                              onPlay={this.props.onPlay}
                  >
                  {
                    (updateCommentCount) => {
                      return (
                        <ActivityCommentList  activityID={this.props.data.id}
                                              comments={this.props.data.comments}
                                              updateCommentCount={updateCommentCount}
                                              user={this.props.user}
                                              reactions={this.props.reactions}
                                              perPage={2}
                                              order='DESC'
                                              replyType='quick'
                                              formPosition='top'
                        />
                      );
                    }
                  }
                  </PostFooter>
                );
              }
            }
          </Reactionable>
      }
      </div>
    );
  }
}

module.exports = Activity;