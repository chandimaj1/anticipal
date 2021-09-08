const React = require('react');

const app = require('../../utils/core');

const groupUtils = require('../utils/group');

const Avatar = require('../avatar/Avatar'),
      TagSticker = require('../tag/TagSticker'),
      AvatarSmallerList = require('../avatar/AvatarSmallerList');
      
const JoinGroupButton = require('../button/JoinGroupButton'),
      LeaveGroupButton = require('../button/LeaveGroupButton'),
      RequestGroupMembershipButton = require('../button/RequestGroupMembershipButton'),
      RemoveGroupMembershipButton = require('../button/RemoveGroupMembershipButton');

class GroupPreview extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const groupable = groupUtils(this.props.loggedUser, this.props.data);

    const memberCountText = this.props.data.total_member_count === 1 ? vikinger_translation.member : vikinger_translation.members,
          postCountText = this.props.data.post_count === 1 ? vikinger_translation.post : vikinger_translation.posts;

    return (
      <div className="user-preview small animate-slide-down">
        {/* USER PREVIEW COVER */}
        <div className="user-preview-cover" style={{background: `url(${this.props.data.cover_image_url}) center center / cover no-repeat`}}></div>
        {/* USER PREVIEW COVER */}
    
        {/* USER PREVIEW INFO */}
        <div className="user-preview-info">
          <TagSticker icon={this.props.data.status} />

          <div className="user-short-description small">
            <Avatar modifiers='user-short-description-avatar' data={this.props.data} />
      
            <p className="user-short-description-title"><a href={this.props.data.link}>{app.truncateText(this.props.data.name, 25)}</a></p>
            <p className="user-short-description-text"><a href={this.props.data.link}>&#64;{app.truncateText((app.joinText(this.props.data.name)).toLowerCase(), 35)}</a></p>
          </div>

          <div className="user-stats">
            <div className="user-stat">
              <p className="user-stat-title">{this.props.data.total_member_count}</p>
              <p className="user-stat-text">{memberCountText}</p>
            </div>

            <div className="user-stat">
              <p className="user-stat-title">{this.props.data.post_count}</p>
              <p className="user-stat-text">{postCountText}</p>
            </div>
          </div>

          <AvatarSmallerList data={this.props.data.members} count={this.props.data.total_member_count} limit={6} link={this.props.data.members_link} />
        </div>
        {/* USER PREVIEW INFO */}

        {/* USER PREVIEW FOOTER */}
        <div className="user-preview-footer">
          <div className="user-preview-footer-action full">
          {
            this.props.loggedUser &&
              <React.Fragment>
              {
                groupable.isBannedFromGroup() &&
                  <TagSticker modifiers="button-tag tertiary"
                            title={vikinger_translation.banned}
                            icon="ban"
                            iconModifiers="white"
                  />
              }
              {
                !groupable.isBannedFromGroup() &&
                  <React.Fragment>
                  {
                    groupable.isGroupPublic() && !groupable.isGroupMember() &&
                      <JoinGroupButton  modifiers="void void-secondary"
                                        title={vikinger_translation.join_group}
                                        icon="join-group"
                                        loggedUser={this.props.loggedUser}
                                        group={this.props.data}
                                        onActionComplete={this.props.onActionComplete}
                      />
                  }

                  {
                    groupable.isGroupMember() && !groupable.isGroupAdmin() &&
                      <LeaveGroupButton modifiers="void void-tertiary"
                                        title={vikinger_translation.leave_group}
                                        icon="leave-group"
                                        loggedUser={this.props.loggedUser}
                                        group={this.props.data}
                                        onActionComplete={this.props.onActionComplete}
                      />
                  }

                  {
                    groupable.isGroupPrivate() && !groupable.isGroupMember() && !groupable.groupMembershipRequestSent() &&
                      <RequestGroupMembershipButton modifiers="void void-secondary"
                                                    title={vikinger_translation.send_join_request}
                                                    icon="join-group"
                                                    loggedUser={this.props.loggedUser}
                                                    group={this.props.data}
                                                    onActionComplete={this.props.onActionComplete}
                      />
                  }

                  {
                    groupable.isGroupPrivate() && !groupable.isGroupMember() && groupable.groupMembershipRequestSent() &&
                      <RemoveGroupMembershipButton  modifiers="void void-tertiary"
                                                    title={vikinger_translation.cancel_join_request}
                                                    icon="leave-group"
                                                    loggedUser={this.props.loggedUser}
                                                    group={this.props.data}
                                                    onActionComplete={this.props.onActionComplete}
                      />
                  }
                  </React.Fragment>

              }
              </React.Fragment>
          }
          </div>
        </div>
        {/* USER PREVIEW FOOTER */}
      </div>
    );
  }
}

module.exports = GroupPreview;