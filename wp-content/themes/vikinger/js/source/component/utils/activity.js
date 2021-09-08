function activityUtils() {
  const me = {};

  const ActivityStatus = require('../activity/ActivityStatus'),
        ActivityFriend = require('../activity/ActivityFriend'),
        ActivityGroup = require('../activity/ActivityGroup'),
        ActivityShare = require('../activity/ActivityShare'),
        PostPreview = require('../post/PostPreview'),
        PostIframePreview = require('../post/PostIframePreview'),
        PostGalleryPreview = require('../post/PostGalleryPreview');

  me.getActivityTemplate = function (type, format = false) {
    if ((type === 'created_group') || (type === 'joined_group')) {
      return ActivityGroup;
    }
    
    if (type === 'friendship_created') {
      return ActivityFriend;
    }
    
    if ((type === 'activity_share') || (type === 'post_share')) {
      return ActivityShare;
    }

    if (type === 'post') {
      if ((format === 'video') || (format === 'audio')) {
        return PostIframePreview;
      }

      if (format === 'gallery') {
        return PostGalleryPreview;
      }

      return PostPreview;
    }

    return ActivityStatus;
  }

  return me; 
};


module.exports = activityUtils;