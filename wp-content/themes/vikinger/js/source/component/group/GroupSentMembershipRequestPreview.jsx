const React = require('react');

const app = require('../../utils/core');

const Avatar = require('../avatar/Avatar'),
      TagSticker = require('../tag/TagSticker'),
      CancelGroupMembershipButton = require('../button/CancelGroupMembershipButton');

class GroupSentMembershipRequestPreview extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const membersText = this.props.data.group.total_member_count === 1 ? vikinger_translation.member : vikinger_translation.members,
          postsText = this.props.data.group.post_count === 1 ? vikinger_translation.post : vikinger_translation.posts;

    return (
      <div className="user-preview small animate-slide-down">
        {/* USER PREVIEW COVER */}
        <div className="user-preview-cover" style={{background: `url(${this.props.data.group.cover_image_url}) center center / cover no-repeat`}}></div>
        {/* USER PREVIEW COVER */}
    
        {/* USER PREVIEW INFO */}
        <div className="user-preview-info">
          <TagSticker icon={this.props.data.group.status} />

          {/* USER SHORT DESCRIPTION */}
          <div className="user-short-description small">
            <Avatar modifiers='user-short-description-avatar' data={this.props.data.group} />
      
            <p className="user-short-description-title"><a href={this.props.data.group.link}>{app.truncateText(this.props.data.group.name, 25)}</a></p>
            <p className="user-short-description-text"><a href={this.props.data.group.link}>&#64;{app.truncateText((app.joinText(this.props.data.group.name)).toLowerCase(), 35)}</a></p>
          </div>
          {/* USER SHORT DESCRIPTION */}

          {/* USER STATS */}
          <div className="user-stats">
            <div className="user-stat">
              <p className="user-stat-title">{this.props.data.group.total_member_count}</p>
              <p className="user-stat-text">{membersText}</p>
            </div>

            <div className="user-stat">
              <p className="user-stat-title">{this.props.data.group.post_count}</p>
              <p className="user-stat-text">{postsText}</p>
            </div>
          </div>
          {/* USER STATS */}

          {/* USER PREVIEW ACTIONS */}
          <div className="user-preview-actions">
            <CancelGroupMembershipButton  data={this.props.data}
                                          modifiers="tertiary"
                                          icon="leave-group"
                                          title={vikinger_translation.cancel_join_request}
                                          onActionComplete={this.props.onActionComplete}
            />
          </div>
          {/* USER PREVIEW ACTIONS */}
        </div>
        {/* USER PREVIEW INFO */}
      </div>
    );
  }
}

module.exports = GroupSentMembershipRequestPreview;