const React = require('react');

const plugins = require('../../utils/plugins');

const WP_Router = require('../../router/WP_Router')();

const groupUtils = require('../utils/group');

const activityUtils = require('../utils/activity'),
      VideoPreview = require('../video/VideoPreview'),
      Reactionable = require('../reaction/Reactionable'),
      PostFooter = require('../post/PostFooter'),
      ActivityCommentList = require('../comment/ActivityCommentList');

const SimpleBar = require('simplebar-react');

class ActivityMediaPopup extends React.Component {
  constructor(props) {
    super(props);

    this.activityMediaPopupRef = React.createRef();

    // console.log('ACTIVITY MEDIA POPUP - DATA: ', props.data);
    // console.log('ACTIVITY MEDIA POPUP - USER: ', props.user);

    this.simplebarStyles = {overflowX: 'hidden', height: '100%'};
  }

  componentDidMount() {
    this.popup = plugins.createPopup({
      triggerElement: this.props.activityMediaPopupTriggerRef.current,
      premadeContentElement: this.activityMediaPopupRef.current,
      type: 'premade',
      popupSelectors: ['activity-media-popup', 'animate-slide-down']
    });
  }

  render() {
    const ActivityTemplate = activityUtils().getActivityTemplate(this.props.data.type);

    const isGroupActivity = this.props.data.component === 'groups';

    let userCanUseSettings = this.props.user;

    // if this activity belongs to a group
    if (this.props.user && isGroupActivity) {
      const groupable = groupUtils(this.props.user, this.props.data.group);

      userCanUseSettings = !groupable.isBannedFromGroup();
    }

    return (
      <div ref={this.activityMediaPopupRef} className="popup-picture">
        {/* WIDGET BOX */}
        <div className="widget-box no-padding no-settings">
          <SimpleBar style={this.simplebarStyles}>
            <ActivityTemplate data={this.props.data}
                              user={this.props.user}
                              pinned={this.props.pinned}
                              pinActivity={this.props.pinActivity}
                              unpinActivity={this.props.unpinActivity}
                              deleteActivity={this.props.deleteActivity}
                              reactions={this.props.reactions}
            />

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
                                  shareData={false}
                                  simpleOptions={true}
                                  user={this.props.user}
                                  reactions={this.props.reactions}
                                  reactionData={reactionData}
                                  userReaction={userReaction}
                                  createUserReaction={createUserReaction}
                                  deleteUserReaction={deleteUserReaction}
                                  postType='activity'
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
          </SimpleBar>
        </div>
        {/* WIDGET BOX */}

        {/* POPUP PICTURE IMAGE WRAP */}
        <div className="popup-picture-image-wrap">
        {
          (this.props.data.type === 'activity_media') &&
            <img className="popup-picture-image" src={this.props.data.media.link} alt={this.props.data.media.name} />
        }
        {
          (this.props.data.type === 'activity_video') &&
            <VideoPreview src={this.props.data.media.link} />
        }
        </div>
        {/* POPUP PICTURE IMAGE WRAP */}
      </div>
    );
  }
}

module.exports = ActivityMediaPopup;