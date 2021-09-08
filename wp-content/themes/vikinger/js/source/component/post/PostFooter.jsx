const React = require('react');

const WP_Router = require('../../router/WP_Router')();

const ContentActions = require('../content-actions/ContentActions'),
      PostReactionOption = require('../post/PostReactionOption'),
      PostShareOption = require('../post/PostShareOption'),
      IconSVG = require('../icon/IconSVG');

class PostFooter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      commentCount: props.commentCount,
      shareCount: props.shareCount
    };

    this.updateCommentCount = this.updateCommentCount.bind(this);
    this.onShare = this.onShare.bind(this);
  }

  onShare(data, callback) {
    // console.log('POST FOOTER - SHARE DATA: ', data);

    const itemID = Number.parseInt(data.postIn, 10);

    // post public by default
    let hideSitewide = false;

    // if posting to a group, get group privacy to set hideSitewide
    if (itemID !== 0) {
      for (const group of this.props.user.groups) {
        // user is a member of the group
        if (group.id === itemID) {
          // hide sitewide if not public group
          hideSitewide = group.status !== 'public';
          break;
        }
      }
    }

    const activityData = {
      creation_config: {
        item_id: itemID,
        secondary_item_id: this.props.shareData.id,
        component: itemID === 0 ? 'activity' : 'groups',
        type: `${this.props.shareType}_share`,
        content: data.text.trim(),
        hide_sitewide: hideSitewide
      },
      share_config: {
        id: this.props.shareData.id,
        type: this.props.shareType,
        count: this.state.shareCount + 1
      }
    };

    // console.log('POST FOOTER - SHARE: ', activityData);

    WP_Router.createActivity(activityData, (response) => {
      // activity created successfully
      if (response) {
        // update feed to show shared activity dynamically on share
        if (this.props.onShare) {
          this.props.onShare(response, itemID, callback);
        } else {
          callback(response);
        }

        // increment share count
        this.setState((state, props) => {
          return {
            shareCount: state.shareCount + 1
          };
        });
      } else {
        callback(response);
      }
    });
  }

  updateCommentCount(value) {
    this.setState((state, props) => {
      return {
        commentCount: state.commentCount + value
      };
    });
  }

  render() {
    return (
      <div className="post-footer">
        <ContentActions commentCount={this.state.commentCount} shareData={this.props.shareData} shareCount={this.state.shareCount} reactionData={this.props.reactionData} />

      {
        !this.props.disableActions && this.props.user &&
          <div className="post-options">
          {
            ((this.props.postType === 'post' && vikinger_constants.plugin_active.vkreact) ||
            (this.props.postType === 'activity' && vikinger_constants.plugin_active.vkreact && vikinger_constants.plugin_active['vkreact-buddypress'])) &&
              <PostReactionOption reactions={this.props.reactions}
                                  userReaction={this.props.userReaction}
                                  createUserReaction={this.props.createUserReaction}
                                  deleteUserReaction={this.props.deleteUserReaction}
                                  simpleOptions={this.props.simpleOptions}
              />
          }

            {/* POST OPTION */}
            <div className={`post-option active ${this.props.simpleOptions ? 'no-text' : ''}`}>
              <IconSVG  icon="comment"
                        modifiers="post-option-icon"
              />
      
            {
              !this.props.simpleOptions &&
                <p className="post-option-text">{vikinger_translation.comment_action}</p>
            }
            </div>
            {/* POST OPTION */}

          {
            this.props.shareData && vikinger_constants.plugin_active.buddypress &&
              <PostShareOption  user={this.props.user}
                                shareData={this.props.shareData}
                                onShare={this.onShare}
                                onPlay={this.props.onPlay}
                                postType={this.props.postType}
                />
          }
          </div>
      }

      {this.props.children(this.updateCommentCount)}
      </div>
    );
  }
}

module.exports = PostFooter;