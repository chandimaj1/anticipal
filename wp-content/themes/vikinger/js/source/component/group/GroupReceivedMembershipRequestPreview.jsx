const React = require('react');

const Avatar = require('../avatar/Avatar'),
      UserPreviewAuthor = require('../user-preview/UserPreviewAuthor'),
      AcceptGroupMembershipButton = require('../button/AcceptGroupMembershipButton'),
      RejectGroupMembershipButton = require('../button/RejectGroupMembershipButton');

class GroupReceivedMembershipRequestPreview extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const postCountText = this.props.data.user.stats.post_count === 1 ? vikinger_translation.post : vikinger_translation.posts,
          friendCountText = this.props.data.user.stats.friend_count === 1 ? vikinger_translation.friend : vikinger_translation.friends,
          commentCountText = this.props.data.user.stats.comment_count === 1 ? vikinger_translation.comment : vikinger_translation.comments;

    return (
      <div className="user-preview small animate-slide-down">
        {/* USER PREVIEW COVER */}
        <div className="user-preview-cover" style={{background: `url(${this.props.data.user.cover_url}) center center / cover no-repeat`}}></div>
        {/* USER PREVIEW COVER */}
    
        {/* USER PREVIEW INFO */}
        <div className="user-preview-info">
          {/* USER SHORT DESCRIPTION */}
          <div className="user-short-description small">
            <Avatar modifiers='user-short-description-avatar' data={this.props.data.user} />
      
            <p className="user-short-description-title"><a href={this.props.data.user.link}>{this.props.data.user.name}</a></p>
            <p className="user-short-description-text"><a href={this.props.data.user.link}>&#64;{this.props.data.user.mention_name}</a></p>
          </div>
          {/* USER SHORT DESCRIPTION */}

          {/* USER STATS */}
          <div className="user-stats">
            <div className="user-stat">
              <p className="user-stat-title">{this.props.data.user.stats.post_count}</p>
              <p className="user-stat-text">{postCountText}</p>
            </div>

          {
            vikinger_constants.plugin_active.buddypress_friends &&
              <div className="user-stat">
                <p className="user-stat-title">{this.props.data.user.stats.friend_count}</p>
                <p className="user-stat-text">{friendCountText}</p>
              </div>
          }

            <div className="user-stat">
              <p className="user-stat-title">{this.props.data.user.stats.comment_count}</p>
              <p className="user-stat-text">{commentCountText}</p>
            </div>
          </div>
          {/* USER STATS */}

          {/* USER PREVIEW ACTIONS */}
          <div className="user-preview-actions">
            <RejectGroupMembershipButton  data={this.props.data}
                                          modifiers="tertiary"
                                          icon="leave-group"
                                          title={vikinger_translation.reject_join_request}
                                          onActionComplete={this.props.onActionComplete}
            />

            <AcceptGroupMembershipButton  data={this.props.data}
                                          modifiers="secondary"
                                          icon="join-group"
                                          title={vikinger_translation.accept_join_request}
                                          onActionComplete={this.props.onActionComplete}
            />
          </div>
          {/* USER PREVIEW ACTIONS */}
        </div>
        {/* USER PREVIEW INFO */}

        {/* USER PREVIEW FOOTER */}
        <div className="user-preview-footer padded">
          {/* USER PREVIEW AUTHOR */}
          <UserPreviewAuthor  title={vikinger_translation.wants_to_join}
                              data={this.props.data.group}
          />
          {/* USER PREVIEW AUTHOR */}
        </div>
        {/* USER PREVIEW FOOTER */}
      </div>
    );
  }
}

module.exports = GroupReceivedMembershipRequestPreview;