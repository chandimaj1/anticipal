const React = require('react');

const ActivityMediaList = require('./ActivityMediaList'),
      ActivityVideoListOptions = require('./ActivityVideoListOptions'),
      VideoItemList = require('../video/VideoItemList');

class ActivityVideoList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ActivityMediaList  activityListOptions={ActivityVideoListOptions}
                          gridModifiers="grid-3-3-3-3"
                          itemPreviewList={VideoItemList}
                          itemPreviewModifiers="video-box-cover-only animate-slide-down"
                          activityGetType='activity_video'
                          activityCreateType='activity_video_upload'
                          sectionTitle={vikinger_translation.videos}
                          noResultsTitle={vikinger_translation.videos_no_results_title}
                          noResultsText={vikinger_translation.videos_no_results_text}
                          {...this.props}
      />
    );
  }
}

module.exports = ActivityVideoList;