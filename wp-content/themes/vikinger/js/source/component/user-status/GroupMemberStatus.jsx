const React = require('react');

const groupUtils = require('../utils/group');

const AvatarSmall = require('../avatar/AvatarSmall'),
      BadgeVerified = require('../badge/BadgeVerified');

const RemoveGroupMemberActionRequest = require('../action/RemoveGroupMemberActionRequest'),
      PromoteGroupMemberToAdminActionRequest = require('../action/PromoteGroupMemberToAdminActionRequest'),
      PromoteGroupMemberToModActionRequest = require('../action/PromoteGroupMemberToModActionRequest'),
      DemoteGroupMemberToModActionRequest = require('../action/DemoteGroupMemberToModActionRequest'),
      DemoteGroupMemberToMemberActionRequest = require('../action/DemoteGroupMemberToMemberActionRequest'),
      BanGroupMemberActionRequest = require('../action/BanGroupMemberActionRequest'),
      UnbanGroupMemberActionRequest = require('../action/UnbanGroupMemberActionRequest');

class GroupMemberStatus extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const groupable = groupUtils(this.props.loggedUser, this.props.group, this.props.data);

    const displayVerifiedMemberBadge = vikinger_constants.plugin_active['bp-verified-member'] && this.props.data.verified;

    return (
      <div className={`user-status ${this.props.modifiers || ''}`}>
        <AvatarSmall modifiers='user-status-avatar' noBorder data={this.props.data} />
          
        <p className="user-status-title">
          <a className="bold" href={this.props.data.link}>{this.props.data.name}</a>
          {
            displayVerifiedMemberBadge && vikinger_constants.settings.bp_verified_member_display_badge_in_profile_fullname &&
              <BadgeVerified />
          }
        </p>
        <p className="user-status-text small">&#64;{this.props.data.mention_name}
        {
          displayVerifiedMemberBadge && vikinger_constants.settings.bp_verified_member_display_badge_in_profile_username &&
            <BadgeVerified />
        }
        </p>

        <div className="action-request-list">
        {
          this.props.loggedUser && (this.props.loggedUser.id !== this.props.data.id) && groupable.groupMemberIsBanned() && groupable.canUnbanMember() &&
            <UnbanGroupMemberActionRequest  member={this.props.data}
                                            group={this.props.group}
                                            loggedUser={this.props.loggedUser}
                                            onActionComplete={this.props.onActionComplete}
            />
        }

        {
          this.props.loggedUser && (this.props.loggedUser.id !== this.props.data.id) && !groupable.groupMemberIsBanned() && !groupable.groupMemberIsAdmin() && groupable.canBanMember() &&
            <BanGroupMemberActionRequest  member={this.props.data}
                                          group={this.props.group}
                                          loggedUser={this.props.loggedUser}
                                          onActionComplete={this.props.onActionComplete}
            />
        }

        {
          this.props.loggedUser && (this.props.loggedUser.id !== this.props.data.id) && !groupable.groupMemberIsBanned() && !groupable.groupMemberIsAdmin() && groupable.canPromoteMemberToAdmin() &&
            <PromoteGroupMemberToAdminActionRequest member={this.props.data}
                                                    group={this.props.group}
                                                    loggedUser={this.props.loggedUser}
                                                    onActionComplete={this.props.onActionComplete}
            />
        }

        {
          this.props.loggedUser && (this.props.loggedUser.id !== this.props.data.id) && !groupable.groupMemberIsBanned() && !groupable.groupMemberIsAdmin() && !groupable.groupMemberIsMod() && groupable.canPromoteMemberToMod() &&
            <PromoteGroupMemberToModActionRequest member={this.props.data}
                                                  group={this.props.group}
                                                  loggedUser={this.props.loggedUser}
                                                  onActionComplete={this.props.onActionComplete}
            />
        }

        {
          this.props.loggedUser && (this.props.loggedUser.id !== this.props.data.id) && !groupable.groupMemberIsBanned() && groupable.groupMemberIsAdmin() && groupable.canDemoteMemberToMod() &&
            <DemoteGroupMemberToModActionRequest  member={this.props.data}
                                                  group={this.props.group}
                                                  loggedUser={this.props.loggedUser}
                                                  onActionComplete={this.props.onActionComplete}
            />
        }

        {
          this.props.loggedUser && (this.props.loggedUser.id !== this.props.data.id) && !groupable.groupMemberIsBanned() && (groupable.groupMemberIsAdmin() || groupable.groupMemberIsMod()) && groupable.canDemoteMemberToMember() &&
            <DemoteGroupMemberToMemberActionRequest member={this.props.data}
                                                    group={this.props.group}
                                                    loggedUser={this.props.loggedUser}
                                                    onActionComplete={this.props.onActionComplete}
            />
        }

        {
          this.props.loggedUser && (this.props.loggedUser.id !== this.props.data.id) && !groupable.groupMemberIsBanned() && groupable.canRemoveGroupMember() &&
            <RemoveGroupMemberActionRequest member={this.props.data}
                                            group={this.props.group}
                                            loggedUser={this.props.loggedUser}
                                            onActionComplete={this.props.onActionComplete}
            />
        }
        </div>
      </div>
    );
  }
}

module.exports = GroupMemberStatus;