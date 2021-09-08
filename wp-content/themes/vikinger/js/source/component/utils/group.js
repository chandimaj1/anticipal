const WP_Router = require('../../router/WP_Router')();

const groupUtils = function (loggedUser, group, member = false) {
  const me = {};

  me.isGroupPublic = function () {
    return group.status === 'public';
  };

  me.isGroupPrivate = function () {
    return group.status === 'private';
  };

  me.isGroupCreator = function () {
    return group.creator_id === loggedUser.id;
  };

  me.isGroupAdmin = function () {
    for (const loggedUserGroup of loggedUser.groups) {
      if (loggedUserGroup.id === group.id) {
        return loggedUserGroup.is_admin;
      }
    }

    return false;
  };

  me.isGroupMod = function () {
    for (const loggedUserGroup of loggedUser.groups) {
      if (loggedUserGroup.id === group.id) {
        return loggedUserGroup.is_mod;
      }
    }

    return false;
  };

  me.isBannedFromGroup = function () {
    for (const loggedUserGroup of loggedUser.groups) {
      if (loggedUserGroup.id === group.id) {
        return loggedUserGroup.is_banned;
      }
    }

    return false;
  };

  me.isGroupMember = function () {
    for (const loggedUserGroup of loggedUser.groups) {
      if (loggedUserGroup.id === group.id) {
        return true;
      }
    }

    return false;
  };

  me.groupMembershipRequestSent = function () {
    for (const membershipRequest of loggedUser.group_membership_requests_sent) {
      if (membershipRequest.group.id === group.id) {
        return true;
      }
    }

    return false;
  };

  me.isLastGroupMember = function () {
    return group.total_member_count === 1;
  };

  me.requestGroupMembership = function (callback) {
    WP_Router.requestGroupMembership({
      group_id: group.id,
      user_id: loggedUser.id
    }, callback);
  };

  me.removeGroupMembership = function (callback) {
    let requestID = 0;

    for (const membershipRequest of loggedUser.group_membership_requests_sent) {
      if (membershipRequest.group.id === group.id) {
        requestID = membershipRequest.id;
        break;
      }
    }

    WP_Router.removeGroupMembership(requestID, callback);
  };

  me.joinGroup = function (callback) {
    WP_Router.joinGroup({
      group_id: group.id,
      user_id: loggedUser.id
    }, callback);
  };

  me.leaveGroup = function (callback) {
    WP_Router.leaveGroup({
      group_id: group.id,
      user_id: loggedUser.id
    }, callback);
  };

  me.groupMemberIsCreator = function () {
    return group.creator_id === member.id;
  };

  me.groupMemberIsAdmin = function () {
    return group.admins.some(admin => admin.id === member.id);
  };

  me.groupMemberIsMod = function () {
    return group.mods.some(mod => mod.id === member.id);
  };

  me.groupMemberIsBanned = function () {
    return group.banned.some(bannedMember => bannedMember.id === member.id);
  };

  me.canPromoteMemberToAdmin = function () {
    return me.isGroupAdmin();
  };

  me.canPromoteMemberToMod = function () {
    return me.isGroupAdmin();
  };

  me.canDemoteMemberToMod = function () {
    return me.isGroupAdmin();
  };

  me.canDemoteMemberToMember = function () {
    return me.isGroupAdmin() && !me.groupMemberIsCreator() && !me.groupMemberIsAdmin();
  };

  me.canRemoveGroupMember = function () {
    return me.isGroupAdmin() && !me.groupMemberIsCreator() && !me.groupMemberIsAdmin();
  };

  me.canBanMember = function () {
    return me.isGroupAdmin() && !me.groupMemberIsCreator() && !me.groupMemberIsAdmin();
  };

  me.canUnbanMember = function () {
    return me.isGroupAdmin();
  };

  me.promoteGroupMemberToAdmin = function () {
    return WP_Router.promoteGroupMemberToAdmin({
      group_id: group.id,
      member_id: member.id
    });
  };

  me.promoteGroupMemberToMod = function () {
    return WP_Router.promoteGroupMemberToMod({
      group_id: group.id,
      member_id: member.id
    });
  };

  me.demoteGroupMemberToMod = function () {
    return WP_Router.demoteGroupMemberToMod({
      group_id: group.id,
      member_id: member.id
    });
  };

  me.demoteGroupMemberToMember = function () {
    return WP_Router.demoteGroupMemberToMember({
      group_id: group.id,
      member_id: member.id
    });
  };

  me.removeGroupMember = function () {
    return WP_Router.removeGroupMember({
      group_id: group.id,
      member_id: member.id
    });
  };

  me.banGroupMember = function () {
    return WP_Router.banGroupMember({
      group_id: group.id,
      member_id: member.id
    });
  };

  me.unbanGroupMember = function () {
    return WP_Router.unbanGroupMember({
      group_id: group.id,
      member_id: member.id
    });
  };

  return me;
};

module.exports = groupUtils;