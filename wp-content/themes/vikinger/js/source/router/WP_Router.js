const WP_Router = function () {
  const me = {};

  /**
   * Upload member avatar
   * @param {*} callback
   */
  me.uploadMemberAvatar = function (config) {
    const formData = new FormData();

    formData.set('context', 'edit');
    formData.set('action', 'bp_avatar_upload');
    formData.set('file', config.file);

    const uploadMemberAvatarPromise = jQuery.ajax({
      url: `${vikinger_constants.rest_root}buddypress/v1/members/${config.user_id}/avatar`,
      method: 'POST',
      beforeSend: function(xhr) {
        xhr.setRequestHeader('X-WP-Nonce', vikinger_constants.wp_rest_nonce);
      },
      data: formData,
      contentType: false,
      processData: false
    });

    uploadMemberAvatarPromise
    .done((response) => {
      const data = {
        action: 'vikinger_member_avatar_upload_triggers_call_ajax',
        user_id: config.user_id,
        _ajax_nonce: vikinger_constants.vikinger_ajax_nonce
      };
  
      jQuery.post(vikinger_constants.ajax_url, data);
    });

    return uploadMemberAvatarPromise;
  };

  me.deleteMemberAvatar = function (config) {
    const data = {
      action: 'vikinger_member_avatar_delete_ajax',
      user_id: config.user_id,
      _ajax_nonce: vikinger_constants.vikinger_ajax_nonce
    };

    return jQuery.post(vikinger_constants.ajax_url, data);
  };

  /**
   * Upload member cover
   * @param {*} callback
   */
  me.uploadMemberCover = function (config) {
    const formData = new FormData();

    formData.set('context', 'edit');
    formData.set('action', 'bp_cover_image_upload');
    formData.set('file', config.file);

    const uploadMemberCoverPromise = jQuery.ajax({
      url: `${vikinger_constants.rest_root}buddypress/v1/members/${config.user_id}/cover`,
      method: 'POST',
      beforeSend: function(xhr) {
        xhr.setRequestHeader('X-WP-Nonce', vikinger_constants.wp_rest_nonce);
      },
      data: formData,
      contentType: false,
      processData: false
    });

    uploadMemberCoverPromise
    .done((response) => {
      const data = {
        action: 'vikinger_member_cover_upload_triggers_call_ajax',
        user_id: config.user_id,
        _ajax_nonce: vikinger_constants.vikinger_ajax_nonce
      };
  
      jQuery.post(vikinger_constants.ajax_url, data);
    });

    return uploadMemberCoverPromise;
  };

  me.deleteMemberCover = function (config) {
    const data = {
      action: 'vikinger_member_cover_delete_ajax',
      user_id: config.user_id,
      _ajax_nonce: vikinger_constants.vikinger_ajax_nonce
    };

    return jQuery.post(vikinger_constants.ajax_url, data);
  };

  /**
   * Upload group avatar
   * @param {*} callback
   */
  me.uploadGroupAvatar = function (config) {
    const formData = new FormData();

    formData.set('context', 'edit');
    formData.set('action', 'bp_avatar_upload');
    formData.set('file', config.file);

    return jQuery.ajax({
      url: `${vikinger_constants.rest_root}buddypress/v1/groups/${config.group_id}/avatar`,
      method: 'POST',
      beforeSend: function(xhr) {
        xhr.setRequestHeader('X-WP-Nonce', vikinger_constants.wp_rest_nonce);
      },
      data: formData,
      contentType: false,
      processData: false
    });
  };

  /**
   * Upload group cover
   * @param {*} callback
   */
  me.uploadGroupCover = function (config) {
    const formData = new FormData();

    formData.set('context', 'edit');
    formData.set('action', 'bp_cover_image_upload');
    formData.set('file', config.file);

    return jQuery.ajax({
      url: `${vikinger_constants.rest_root}buddypress/v1/groups/${config.group_id}/cover`,
      method: 'POST',
      beforeSend: function(xhr) {
        xhr.setRequestHeader('X-WP-Nonce', vikinger_constants.wp_rest_nonce);
      },
      data: formData,
      contentType: false,
      processData: false
    });
  };

  /**
   * NOTIFICATION AJAX
   */
  me.getNotifications = function (config = {}) {
    const data = {
      action: 'vikinger_get_notifications_ajax',
      args: config,
      _ajax_nonce: vikinger_constants.vikinger_ajax_nonce
    };

    return jQuery.post(vikinger_constants.ajax_url, data);
  };

  me.getUnreadNotificationsCount = function (config = {}) {
    const data = {
      action: 'vikinger_get_unread_notifications_count_ajax',
      args: config,
      _ajax_nonce: vikinger_constants.vikinger_ajax_nonce
    };

    return jQuery.post(vikinger_constants.ajax_url, data);
  };

  me.markNotificationAsRead = function (config) {
    const data = {
      action: 'vikinger_mark_notification_as_read_ajax',
      args: config,
      _ajax_nonce: vikinger_constants.vikinger_ajax_nonce
    };

    return jQuery.post(vikinger_constants.ajax_url, data);
  };

  me.markNotificationsAsRead = function (config) {
    const data = {
      action: 'vikinger_mark_notifications_as_read_ajax',
      args: config,
      _ajax_nonce: vikinger_constants.vikinger_ajax_nonce
    };

    return jQuery.post(vikinger_constants.ajax_url, data);
  };

  me.deleteNotifications = function (config) {
    const data = {
      action: 'vikinger_delete_notifications_ajax',
      args: config,
      _ajax_nonce: vikinger_constants.vikinger_ajax_nonce
    };

    return jQuery.post(vikinger_constants.ajax_url, data);
  };

  /**
   * MESSAGES AJAX
   */

  me.getMessages = function (config) {
    const data = {
      action: 'vikinger_get_messages_ajax',
      args: config,
      _ajax_nonce: vikinger_constants.vikinger_ajax_nonce
    };

    return jQuery.post(vikinger_constants.ajax_url, data);
  };

  me.getMessage = function (config) {
    const data = {
      action: 'vikinger_get_message_ajax',
      args: config,
      _ajax_nonce: vikinger_constants.vikinger_ajax_nonce
    };

    return jQuery.post(vikinger_constants.ajax_url, data);
  };

  me.sendMessage = function (config) {
    const data = {
      action: 'vikinger_send_message_ajax',
      args: config,
      _ajax_nonce: vikinger_constants.vikinger_ajax_nonce
    };

    return jQuery.post(vikinger_constants.ajax_url, data);
  };

  me.starMessage = function (config) {
    const data = {
      action: 'vikinger_star_message_ajax',
      args: config,
      _ajax_nonce: vikinger_constants.vikinger_ajax_nonce
    };

    return jQuery.post(vikinger_constants.ajax_url, data);
  };

  me.unstarMessage = function (config) {
    const data = {
      action: 'vikinger_unstar_message_ajax',
      args: config,
      _ajax_nonce: vikinger_constants.vikinger_ajax_nonce
    };

    return jQuery.post(vikinger_constants.ajax_url, data);
  };

  me.markMessageThreadAsRead = function (config) {
    const data = {
      action: 'vikinger_message_mark_thread_as_read_ajax',
      args: config,
      _ajax_nonce: vikinger_constants.vikinger_ajax_nonce
    };

    return jQuery.post(vikinger_constants.ajax_url, data);
  };

  me.deleteMessageThread = function (config) {
    const data = {
      action: 'vikinger_delete_message_thread_ajax',
      args: config,
      _ajax_nonce: vikinger_constants.vikinger_ajax_nonce
    };

    return jQuery.post(vikinger_constants.ajax_url, data);
  };

  /**
   * LOGIN AJAX
   */

  /**
   * Check if a password is the users password
   * @param {*} callback
   */
  me.checkPassword = function (config) {
    const data = {
      action: 'vikinger_check_password_ajax',
      args: config,
      _ajax_nonce: vikinger_constants.vikinger_ajax_nonce
    };

    return jQuery.post(vikinger_constants.ajax_url, data);
  };

   /**
   * Update a users password
   * @param {*} callback
   */
  me.updatePassword = function (config) {
    const data = {
      action: 'vikinger_update_password_ajax',
      args: config,
      _ajax_nonce: vikinger_constants.vikinger_ajax_nonce
    };

    return jQuery.post(vikinger_constants.ajax_url, data);
  };

  /**
   * USER AJAX
   */

  /**
   * Get logged in user member data
   * @param {*} callback
   */
  me.getLoggedInMember = function (config) {
    const data = {
      action: 'vikinger_get_logged_user_member_data_ajax',
      data_scope: config,
      _ajax_nonce: vikinger_constants.vikinger_ajax_nonce
    };

    return jQuery.post(vikinger_constants.ajax_url, data);
  };

  /**
   * Delete logged user account
   * @param {*} callback
   */
  me.deleteLoggedUser = function () {
    const data = {
      action: 'vikinger_logged_user_delete_account_ajax',
      _ajax_nonce: vikinger_constants.vikinger_ajax_nonce
    };

    return jQuery.post(vikinger_constants.ajax_url, data);
  };

  /**
   * Update user metadata
   * @param {*} callback
   */
  me.updateUserMetadata = function (config) {
    const data = {
      action: 'vikinger_user_meta_update_ajax',
      args: config,
      _ajax_nonce: vikinger_constants.vikinger_ajax_nonce
    };

    return jQuery.post(vikinger_constants.ajax_url, data);
  };

  /**
   * Update logged user grid type
   * @param {*} callback
   */
   me.updateLoggedUserGridType = function (config) {
    const data = {
      action: 'vikinger_logged_user_grid_type_update_ajax',
      args: config,
      _ajax_nonce: vikinger_constants.vikinger_ajax_nonce
    };

    return jQuery.post(vikinger_constants.ajax_url, data);
  };

  /**
   * Update logged user sidemenu status
   * @param {*} callback
   */
   me.updateLoggedUserSidemenuStatus = function (config) {
    const data = {
      action: 'vikinger_logged_user_sidemenu_status_update_ajax',
      args: config,
      _ajax_nonce: vikinger_constants.vikinger_ajax_nonce
    };

    return jQuery.post(vikinger_constants.ajax_url, data);
  };

  /**
   * BLOG AJAX
   */

  /**
   * Get posts
   * @param {*} postData 
   * @param {*} callback 
   */
  me.getPosts = function (postData) {
    const data = {
      action: 'vikinger_get_posts_ajax',
      post_data: postData,
      _ajax_nonce: vikinger_constants.vikinger_ajax_nonce
    };

    return jQuery.post(vikinger_constants.ajax_url, data);
  };

  /**
   * Delete post comment
   * @param {*} activityID
   * @param {*} callback
   */
  me.deletePostComment = function (config) {
    const data = {
      action: 'vikinger_post_comment_delete_ajax',
      args: config,
      _ajax_nonce: vikinger_constants.vikinger_ajax_nonce
    };

    return jQuery.post(vikinger_constants.ajax_url, data);
  };

  /**
   * Get pages
   * @param {*} postData 
   * @param {*} callback 
   */
  me.getPages = function (args) {
    const data = {
      action: 'vikinger_get_pages_ajax',
      args: args,
      _ajax_nonce: vikinger_constants.vikinger_ajax_nonce
    };

    return jQuery.post(vikinger_constants.ajax_url, data);
  };

  /**
   * Get post count
   * @param {*} postData 
   * @param {*} callback 
   */
  me.getPostCount = function (postData, callback) {
    const data = {
      action: 'vikinger_get_post_count_ajax',
      post_data: postData,
      _ajax_nonce: vikinger_constants.vikinger_ajax_nonce
    };

    // fetch all
    data.post_data.numberposts = -1;

    jQuery.post(vikinger_constants.ajax_url, data, callback);
  };

  /**
   * Get categories
   * @param {*} callback 
   */
  me.getCategories = function (callback) {
    const data = {
      action: 'vikinger_get_categories_ajax',
      _ajax_nonce: vikinger_constants.vikinger_ajax_nonce
    };

    jQuery.post(vikinger_constants.ajax_url, data, callback);
  };

  /**
   * COMMENT AJAX
   */

  /**
   * Create post comment
   * @param {*} commentData 
   * @param {*} callback 
   */
  me.createComment = function (commentData, callback) {
    const data = {
      action: 'vikinger_create_comment_ajax',
      comment_data: {
        comment_post_ID: commentData.postID,
        comment_parent: commentData.parentID,
        comment_author: commentData.author,
        comment_content: commentData.content
      },
      _ajax_nonce: vikinger_constants.vikinger_ajax_nonce
    };

    // optional parameters
    if (typeof commentData.userID !== 'undefined') {
      data.comment_data.user_id = commentData.userID;
    }

    if (typeof commentData.email !== 'undefined') {
      data.comment_data.comment_author_email = commentData.email;
    }

    jQuery.post(vikinger_constants.ajax_url, data, callback);
  };

  /**
   * Get post comments
   * @param {*} filters 
   * @param {*} callback 
   */
  me.getComments = function (filters, callback) {
    const data = {
      action: 'vikinger_get_comments_ajax',
      args: filters,
      _ajax_nonce: vikinger_constants.vikinger_ajax_nonce
    };

    jQuery.post(vikinger_constants.ajax_url, data, callback);
  };

  /**
   * Get post top level comment count
   * @param {*} postID 
   * @param {*} callback 
   */
  me.getPostTopLevelCommentCount = function (postID, callback) {
    const data = {
      action: 'vikinger_get_post_top_level_comment_count_ajax',
      postID: postID,
      _ajax_nonce: vikinger_constants.vikinger_ajax_nonce
    };

    jQuery.post(vikinger_constants.ajax_url, data, callback);
  };

  /**
   * FRIEND AJAX
   */

  /**
   * Add friend
   * @param {*} config
   * @param {*} callback
   */
  me.addFriend = function (config, callback) {
    const data = {
      action: 'vikinger_friend_add_ajax',
      args: config,
      _ajax_nonce: vikinger_constants.vikinger_ajax_nonce
    };

    jQuery.post(vikinger_constants.ajax_url, data, callback);
  };

  /**
   * Reject a friend request
   * @param {*} config
   * @param {*} callback
   */
  me.rejectFriendRequest = function (config, callback) {
    const data = {
      action: 'vikinger_friend_reject_ajax',
      args: config,
      _ajax_nonce: vikinger_constants.vikinger_ajax_nonce
    };

    jQuery.post(vikinger_constants.ajax_url, data, callback);
  };

  /**
   * Withdraw a friend request
   * @param {*} config
   * @param {*} callback
   */
  me.withdrawFriendRequest = function (config, callback) {
    const data = {
      action: 'vikinger_friend_withdraw_ajax',
      args: config,
      _ajax_nonce: vikinger_constants.vikinger_ajax_nonce
    };

    jQuery.post(vikinger_constants.ajax_url, data, callback);
  };

  /**
   * Accept a friend request
   * @param {*} config
   * @param {*} callback
   */
  me.acceptFriendRequest = function (config, callback) {
    const data = {
      action: 'vikinger_friend_accept_ajax',
      args: config,
      _ajax_nonce: vikinger_constants.vikinger_ajax_nonce
    };

    jQuery.post(vikinger_constants.ajax_url, data, callback);
  };

  /**
   * Remove a friend
   * @param {*} config
   * @param {*} callback
   */
  me.removeFriend = function (config, callback) {
    const data = {
      action: 'vikinger_friend_remove_ajax',
      args: config,
      _ajax_nonce: vikinger_constants.vikinger_ajax_nonce
    };

    jQuery.post(vikinger_constants.ajax_url, data, callback);
  };

  /**
   * MEMBER AJAX
   */
  
  /**
   * Get members
   * @param {*} config 
   * @param {*} callback 
   */
  me.getMembers = function (config) {
    const data = {
      action: 'vikinger_members_get_ajax',
      filters: config,
      _ajax_nonce: vikinger_constants.vikinger_ajax_nonce
    };

    return jQuery.post(vikinger_constants.ajax_url, data);
  };

  /**
   * Get members count
   * @param {*} config 
   * @param {*} callback 
   */
  me.getMembersCount = function (config, callback) {
    const data = {
      action: 'vikinger_members_get_count_ajax',
      filters: config,
      _ajax_nonce: vikinger_constants.vikinger_ajax_nonce
    };

    jQuery.post(vikinger_constants.ajax_url, data, callback);
  };

  /**
   * Update member xprofile data
   * @param {*} config 
   * @param {*} callback 
   */
  me.updateMemberXProfileData = function (config) {
    const data = {
      action: 'vikinger_member_update_xprofile_data_ajax',
      args: config,
      _ajax_nonce: vikinger_constants.vikinger_ajax_nonce
    };

    return jQuery.post(vikinger_constants.ajax_url, data);
  };

  /**
   * ACTIVITY AJAX
   */

  /**
   * Get activities
   * @param {*} config 
   * @param {*} callback 
   */
  me.getActivities = function (config, callback) {
    const data = {
      action: 'vikinger_get_activities_ajax',
      filters: config,
      _ajax_nonce: vikinger_constants.vikinger_ajax_nonce
    };

    jQuery.post(vikinger_constants.ajax_url, data, callback);
  };

  /**
   * Create activity
   * @param {*} activityData
   * @param {*} callback
   */
  me.createActivity = function (activityData, callback) {
    const formData = new FormData();

    // send creation config
    for (const key in activityData.creation_config) {
      formData.set(`creation_config[${key}]`, activityData.creation_config[key]);
    }

    // send share config if any
    if (activityData.share_config) {
      for (const key in activityData.share_config) {
        formData.set(`share_config[${key}]`, activityData.share_config[key]);
      }
    }

    // send attached media if any
    if (activityData.attached_media) {
      for (const key in activityData.attached_media) {
        formData.set(`attached_media[${key}]`, activityData.attached_media[key]);
      }
    }

    // send uploadable media if any
    if (activityData.uploadable_media) {
      // send files
      for (const file of activityData.uploadable_media.files) {
        formData.append(`uploadable_media[]`, file);
      }

      // send component
      for (const key in activityData.uploadable_media.component) {
        formData.set(`uploadable_media[component][${key}]`, activityData.uploadable_media.component[key]);
      }
    }

    // send uploadable media type if any
    if (activityData.uploadable_media_type) {
      formData.set('uploadable_media_type', activityData.uploadable_media_type);
    }

    formData.set('action', 'vikinger_create_activity_ajax');
    formData.set('_ajax_nonce', vikinger_constants.vikinger_ajax_nonce);

    jQuery.ajax({
      url: vikinger_constants.ajax_url,
      method: 'POST',
      data: formData,
      processData: false,
      contentType: false,
      success: callback
    });
  };

  /**
   * Delete activity
   * @param {*} activityID
   * @param {*} callback
   */
  me.deleteActivity = function (activityID, callback) {
    const data = {
      action: 'vikinger_delete_activity_ajax',
      activity_id: activityID,
      _ajax_nonce: vikinger_constants.vikinger_ajax_nonce
    };

    jQuery.post(vikinger_constants.ajax_url, data, callback);
  };

  /**
   * Delete activity comment
   * @param {*} activityID
   * @param {*} callback
   */
  me.deleteActivityComment = function (config) {
    const data = {
      action: 'vikinger_activity_comment_delete_ajax',
      args: config,
      _ajax_nonce: vikinger_constants.vikinger_ajax_nonce
    };

    return jQuery.post(vikinger_constants.ajax_url, data);
  };

  /**
   * Delete activity media
   * @param {*} activityID
   * @param {*} callback
   */
  me.deleteActivityMedia = function (config, callback) {
    const data = {
      action: 'vikinger_delete_activity_media_ajax',
      args: config,
      _ajax_nonce: vikinger_constants.vikinger_ajax_nonce
    };

    jQuery.post(vikinger_constants.ajax_url, data, callback);
  };

  /**
   * Create activity comment
   * @param {*} commentData 
   * @param {*} callback 
   */
  me.createActivityComment = function (commentData, callback) {
    const data = {
      action: 'vikinger_create_activity_comment',
      args: {},
      _ajax_nonce: vikinger_constants.vikinger_ajax_nonce
    };

    // args parameters
    if (typeof commentData.activityID !== 'undefined') {
      data.args.activity_id = commentData.activityID;
    }

    if (typeof commentData.parentID !== 'undefined') {
      data.args.parent_id = commentData.parentID;
    }

    if (typeof commentData.content !== 'undefined') {
      data.args.content = commentData.content;
    }

    jQuery.post(vikinger_constants.ajax_url, data, callback);
  };

  /**
   * Add activity to user favorites
   * @param {*} config 
   * @param {*} callback 
   */
  me.addActivityFavorite = function(config, callback) {
    const data = {
      action: 'vikinger_add_favorite_activity_ajax',
      userID: config.userID,
      activityID: config.activityID,
      _ajax_nonce: vikinger_constants.vikinger_ajax_nonce
    };

    jQuery.post(vikinger_constants.ajax_url, data, callback);
  }

  /**
   * Remove activity from user favorites
   * @param {*} config 
   * @param {*} callback 
   */
  me.removeActivityFavorite = function(config, callback) {
    const data = {
      action: 'vikinger_remove_favorite_activity_ajax',
      userID: config.userID,
      activityID: config.activityID,
      _ajax_nonce: vikinger_constants.vikinger_ajax_nonce
    };

    jQuery.post(vikinger_constants.ajax_url, data, callback);
  }

  /**
   * Pin user activity
   * @param {*} config 
   * @param {*} callback 
   */
  me.pinActivity = function(config, callback) {
    const data = {
      action: 'vikinger_pin_activity_ajax',
      userID: config.userID,
      activityID: config.activityID,
      _ajax_nonce: vikinger_constants.vikinger_ajax_nonce
    };

    jQuery.post(vikinger_constants.ajax_url, data, callback);
  }

  /**
   * Unpin user activity
   * @param {*} config 
   * @param {*} callback 
   */
  me.unpinActivity = function(config, callback) {
    const data = {
      action: 'vikinger_unpin_activity_ajax',
      userID: config.userID,
      _ajax_nonce: vikinger_constants.vikinger_ajax_nonce
    };

    jQuery.post(vikinger_constants.ajax_url, data, callback);
  }

  /**
   * Get user pinned activity
   * @param {*} config 
   * @param {*} callback 
   */
  me.getPinnedActivity = function(config, callback) {
    const data = {
      action: 'vikinger_get_pinned_activity_ajax',
      userID: config.userID,
      _ajax_nonce: vikinger_constants.vikinger_ajax_nonce
    };

    jQuery.post(vikinger_constants.ajax_url, data, callback);
  }

  /**
   * GROUP AJAX
   */

  /**
   * Get groups
   * @param {*} config 
   * @param {*} callback 
   */
  me.getGroups = function (config) {
    const data = {
      action: 'vikinger_groups_get_ajax',
      args: config,
      _ajax_nonce: vikinger_constants.vikinger_ajax_nonce
    };

    return jQuery.post(vikinger_constants.ajax_url, data);
  };

  /**
   * Get groups count
   * @param {*} config 
   * @param {*} callback
   */
  me.getGroupsCount = function (config, callback) {
    const data = {
      action: 'vikinger_groups_get_count_ajax',
      args: config,
      _ajax_nonce: vikinger_constants.vikinger_ajax_nonce
    };

    jQuery.post(vikinger_constants.ajax_url, data, callback);
  };

  /**
   * Get group members
   * @param {*} config 
   * @param {*} callback
   */
  me.getGroupMembers = function (config) {
    const data = {
      action: 'vikinger_groups_get_members_ajax',
      args: config,
      _ajax_nonce: vikinger_constants.vikinger_ajax_nonce
    };

    return jQuery.post(vikinger_constants.ajax_url, data);
  };

  /**
   * Get group members  count
   * @param {*} config 
   * @param {*} callback
   */
  me.getGroupMembersCount = function (config, callback) {
    const data = {
      action: 'vikinger_groups_get_members_count_ajax',
      args: config,
      _ajax_nonce: vikinger_constants.vikinger_ajax_nonce
    };

    jQuery.post(vikinger_constants.ajax_url, data, callback);
  };

  /**
   * Create a group
   */
  me.createGroup = function (config) {
    const data = {
      action: 'vikinger_group_create_ajax',
      args: config,
      _ajax_nonce: vikinger_constants.vikinger_ajax_nonce
    };

    return jQuery.post(vikinger_constants.ajax_url, data);
  };

  /**
   * Update a group
   */
  me.updateGroup = function (config) {
    const data = {
      action: 'vikinger_group_update_ajax',
      args: config,
      _ajax_nonce: vikinger_constants.vikinger_ajax_nonce
    };

    return jQuery.post(vikinger_constants.ajax_url, data);
  };

  /**
   * Delete a group
   */
  me.deleteGroup = function (config) {
    const data = {
      action: 'vikinger_group_delete_ajax',
      args: config,
      _ajax_nonce: vikinger_constants.vikinger_ajax_nonce
    };

    return jQuery.post(vikinger_constants.ajax_url, data);
  };

  /**
   * Request to join a group
   * @param {*} config 
   * @param {*} callback 
   */
  me.requestGroupMembership = function (config, callback) {
    const data = {
      action: 'vikinger_group_membership_requests_send_ajax',
      args: config,
      _ajax_nonce: vikinger_constants.vikinger_ajax_nonce
    };

    jQuery.post(vikinger_constants.ajax_url, data, callback);
  };

  /**
   * Accept a group membership request
   * @param {*} config 
   * @param {*} callback 
   */
  me.acceptGroupMembership = function (config, callback) {
    const data = {
      action: 'vikinger_group_membership_requests_accept_ajax',
      args: config,
      _ajax_nonce: vikinger_constants.vikinger_ajax_nonce
    };

    jQuery.post(vikinger_constants.ajax_url, data, callback);
  };

  /**
   * Cancel or reject a group membership request
   * @param {*} config 
   * @param {*} callback 
   */
  me.removeGroupMembership = function (config, callback) {
    const data = {
      action: 'vikinger_group_membership_requests_remove_ajax',
      args: config,
      _ajax_nonce: vikinger_constants.vikinger_ajax_nonce
    };

    jQuery.post(vikinger_constants.ajax_url, data, callback);
  };

  /**
   * Join a group
   * @param {*} config 
   * @param {*} callback 
   */
  me.joinGroup = function (config, callback) {
    const data = {
      action: 'vikinger_group_join_ajax',
      args: config,
      _ajax_nonce: vikinger_constants.vikinger_ajax_nonce
    };

    jQuery.post(vikinger_constants.ajax_url, data, callback);
  };

  /**
   * Leave a group
   * @param {*} config 
   * @param {*} callback 
   */
  me.leaveGroup = function (config, callback) {
    const data = {
      action: 'vikinger_group_leave_ajax',
      args: config,
      _ajax_nonce: vikinger_constants.vikinger_ajax_nonce
    };

    jQuery.post(vikinger_constants.ajax_url, data, callback);
  };

  /**
   * Removes a group member
   */
  me.removeGroupMember = function (config) {
    const data = {
      action: 'vikinger_group_member_remove_ajax',
      args: config,
      _ajax_nonce: vikinger_constants.vikinger_ajax_nonce
    };

    return jQuery.post(vikinger_constants.ajax_url, data);
  };

  /**
   * Send a group invitation
   */
  me.sendGroupInvitation = function (config) {
    const data = {
      action: 'vikinger_group_send_invite_ajax',
      args: config,
      _ajax_nonce: vikinger_constants.vikinger_ajax_nonce
    };

    return jQuery.post(vikinger_constants.ajax_url, data);
  };

  /**
   * Remove or reject a group invitation
   */
  me.acceptGroupInvitation = function (config) {
    const data = {
      action: 'vikinger_group_accept_invite_ajax',
      args: config,
      _ajax_nonce: vikinger_constants.vikinger_ajax_nonce
    };

    return jQuery.post(vikinger_constants.ajax_url, data);
  };

  /**
   * Remove or reject a group invitation
   */
  me.removeGroupInvitation = function (config) {
    const data = {
      action: 'vikinger_group_remove_invite_ajax',
      args: config,
      _ajax_nonce: vikinger_constants.vikinger_ajax_nonce
    };

    return jQuery.post(vikinger_constants.ajax_url, data);
  };

  /**
   * Promote a group member to admin
   */
  me.promoteGroupMemberToAdmin = function (config) {
    const data = {
      action: 'vikinger_group_member_promote_to_admin_ajax',
      args: config,
      _ajax_nonce: vikinger_constants.vikinger_ajax_nonce
    };

    return jQuery.post(vikinger_constants.ajax_url, data);
  };

  /**
   * Promote a group member to mod
   */
  me.promoteGroupMemberToMod = function (config) {
    const data = {
      action: 'vikinger_group_member_promote_to_mod_ajax',
      args: config,
      _ajax_nonce: vikinger_constants.vikinger_ajax_nonce
    };

    return jQuery.post(vikinger_constants.ajax_url, data);
  };

  /**
   * Demote a group member to member
   */
  me.demoteGroupMemberToMember = function (config) {
    const data = {
      action: 'vikinger_group_member_demote_to_member_ajax',
      args: config,
      _ajax_nonce: vikinger_constants.vikinger_ajax_nonce
    };

    return jQuery.post(vikinger_constants.ajax_url, data);
  };

  /**
   * Demote a group member to mod
   */
  me.demoteGroupMemberToMod = function (config) {
    const data = {
      action: 'vikinger_group_member_demote_to_mod_ajax',
      args: config,
      _ajax_nonce: vikinger_constants.vikinger_ajax_nonce
    };

    return jQuery.post(vikinger_constants.ajax_url, data);
  };

  /**
   * Ban a group member
   */
  me.banGroupMember = function (config) {
    const data = {
      action: 'vikinger_group_member_ban_ajax',
      args: config,
      _ajax_nonce: vikinger_constants.vikinger_ajax_nonce
    };

    return jQuery.post(vikinger_constants.ajax_url, data);
  };

  /**
   * Unban a group member
   */
  me.unbanGroupMember = function (config) {
    const data = {
      action: 'vikinger_group_member_unban_ajax',
      args: config,
      _ajax_nonce: vikinger_constants.vikinger_ajax_nonce
    };

    return jQuery.post(vikinger_constants.ajax_url, data);
  };

  /**
   * Update group metadata fields
   */
  me.updateGroupMetaFields = function (config) {
    const data = {
      action: 'vikinger_group_update_meta_fields_ajax',
      args: config,
      _ajax_nonce: vikinger_constants.vikinger_ajax_nonce
    };

    return jQuery.post(vikinger_constants.ajax_url, data);
  };

  /**
   * Delete group metadata fields
   */
  me.deleteGroupMetaFields = function (config) {
    const data = {
      action: 'vikinger_group_delete_meta_fields_ajax',
      args: config,
      _ajax_nonce: vikinger_constants.vikinger_ajax_nonce
    };

    return jQuery.post(vikinger_constants.ajax_url, data);
  };

  /**
   * REACTION AJAX
   */

  /**
   * Get all reactions
   * @param {*} config 
   * @param {*} callback
   */
  me.getReactions = function () {
    const data = {
      action: 'vkreact_get_reactions_ajax',
      _ajax_nonce: vikinger_constants.vikinger_ajax_nonce
    };

    return jQuery.post(vikinger_constants.ajax_url, data);
  };

  /**
   * Create a user reaction for an activity
   * @param {*} config 
   * @param {*} callback
   */
  me.createActivityUserReaction = function (config, callback) {
    const data = {
      action: 'vkreact_bp_create_activity_user_reaction_ajax',
      args: config,
      _ajax_nonce: vikinger_constants.vikinger_ajax_nonce
    };

    jQuery.post(vikinger_constants.ajax_url, data, callback);
  };

  /**
   * Delete a user reaction for an activity
   * @param {*} config 
   * @param {*} callback
   */
  me.deleteActivityUserReaction = function (config, callback) {
    const data = {
      action: 'vkreact_bp_delete_activity_user_reaction_ajax',
      args: config,
      _ajax_nonce: vikinger_constants.vikinger_ajax_nonce
    };

    jQuery.post(vikinger_constants.ajax_url, data, callback);
  };

  /**
   * Create a user reaction for a post comment
   * @param {*} config 
   * @param {*} callback
   */
  me.createPostCommentUserReaction = function (config, callback) {
    const data = {
      action: 'vkreact_create_postcomment_user_reaction_ajax',
      args: config,
      _ajax_nonce: vikinger_constants.vikinger_ajax_nonce
    };

    jQuery.post(vikinger_constants.ajax_url, data, callback);
  };

  /**
   * Delete a user reaction for a post comment
   * @param {*} config 
   * @param {*} callback
   */
  me.deletePostCommentUserReaction = function (config, callback) {
    const data = {
      action: 'vkreact_delete_postcomment_user_reaction_ajax',
      args: config,
      _ajax_nonce: vikinger_constants.vikinger_ajax_nonce
    };

    jQuery.post(vikinger_constants.ajax_url, data, callback);
  };

  /**
   * Create a user reaction for a post
   * @param {*} config 
   * @param {*} callback
   */
  me.createPostUserReaction = function (config, callback) {
    const data = {
      action: 'vkreact_create_post_user_reaction_ajax',
      args: config,
      _ajax_nonce: vikinger_constants.vikinger_ajax_nonce
    };

    jQuery.post(vikinger_constants.ajax_url, data, callback);
  };

  /**
   * Delete a user reaction for a post
   * @param {*} config 
   * @param {*} callback
   */
  me.deletePostUserReaction = function (config, callback) {
    const data = {
      action: 'vkreact_delete_post_user_reaction_ajax',
      args: config,
      _ajax_nonce: vikinger_constants.vikinger_ajax_nonce
    };

    jQuery.post(vikinger_constants.ajax_url, data, callback);
  };

  /**
   * FORUM AJAX
   */

  /**
   * Create forum
   */
  me.createGroupForum = function (config, group_id) {
    const data = {
      action: 'vikinger_bbpress_group_forum_create_ajax',
      args: config,
      group_id: group_id,
      _ajax_nonce: vikinger_constants.vikinger_ajax_nonce
    };

    return jQuery.post(vikinger_constants.ajax_url, data);
  };

  /**
   * Deletes forum
   */
  me.deleteGroupForum = function (config) {
    const data = {
      action: 'vikinger_bbpress_group_forum_delete_ajax',
      args: config,
      _ajax_nonce: vikinger_constants.vikinger_ajax_nonce
    };

    return jQuery.post(vikinger_constants.ajax_url, data);
  };

  /**
   * Get group associated forum
   */
  me.getGroupAssociatedForum = function (config) {
    const data = {
      action: 'vikinger_bbpress_group_forum_associate_get_ajax',
      args: config,
      _ajax_nonce: vikinger_constants.vikinger_ajax_nonce
    };

    return jQuery.post(vikinger_constants.ajax_url, data);
  };

  /**
   * COLOR THEME AJAX
   */

  /**
   * Toggle logged in user color theme
   */
  me.toggleLoggedUserColorTheme = function () {
    const data = {
      action: 'vikinger_logged_user_color_theme_toggle_ajax',
      _ajax_nonce: vikinger_constants.vikinger_ajax_nonce
    };

    return jQuery.post(vikinger_constants.ajax_url, data);
  };

  return me;
};

module.exports = WP_Router;