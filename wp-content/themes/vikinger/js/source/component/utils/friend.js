const WP_Router = require('../../router/WP_Router')();

const friendUtils = function (loggedUser, userID) {
  const me = {};

  me.isFriend = function () {
    for (const friend of loggedUser.friends) {
      // if logged user has that friend in their friends list
      if (userID === friend.id) {
        return true;
      }
    }

    return false;
  };

  me.friendRequestSent = function () {
    for (const request of loggedUser.friend_requests_sent) {
      // if logged user sent a request to that user
      if (userID === request.user.id) {
        return true;
      }
    }

    return false;
  };

  me.friendRequestReceived = function () {
    for (const request of loggedUser.friend_requests_received) {
      // if logged user received a request from that user
      if (userID === request.user.id) {
        return true;
      }
    }

    return false;
  };

  me.getReceivedRequestFriendshipID = function () {
    for (const request of loggedUser.friend_requests_received) {
      // if logged user sent a request to that user
      if (userID === request.user.id) {
        return request.id;
      }
    }
  };

  me.getFriendFriendshipID = function () {
    for (const friend of loggedUser.friends) {
      // if logged user has that user as a friend
      if (userID === friend.id) {
        return friend.friendship_id;
      }
    }
  };

  me.addFriend = function (callback) {
    WP_Router.addFriend({
      initiator_userid: loggedUser.id,
      friend_userid: userID
    }, callback);
  };

  me.withdrawFriendRequest = function (callback) {
    WP_Router.withdrawFriendRequest({
      initiator_userid: loggedUser.id,
      friend_userid: userID
    }, callback);
  };

  me.rejectFriendRequest = function (callback) {
    WP_Router.rejectFriendRequest({
      friendship_id: me.getReceivedRequestFriendshipID()
    }, callback);
  };

  me.acceptFriendRequest = function (callback) {
    WP_Router.acceptFriendRequest({
      friendship_id: me.getReceivedRequestFriendshipID()
    }, callback);
  };

  me.removeFriend = function (callback) {
    WP_Router.removeFriend({
      friendship_id: me.getFriendFriendshipID()
    }, callback);
  };

  return me;
};

module.exports = friendUtils;