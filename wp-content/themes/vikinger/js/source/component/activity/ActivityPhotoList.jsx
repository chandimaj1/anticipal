const React = require('react');

const ActivityMediaList = require('./ActivityMediaList'),
      ActivityPhotoListOptions = require('./ActivityPhotoListOptions'),
      PhotoPreviewList = require('../picture/PhotoPreviewList');

class ActivityPhotoList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ActivityMediaList  activityListOptions={ActivityPhotoListOptions}
                          gridModifiers="grid-2-2-2-2-2-2"
                          itemPreviewList={PhotoPreviewList}
                          itemPreviewModifiers="small animate-slide-down"
                          activityGetType='activity_media'
                          activityCreateType='activity_media_upload'
                          sectionTitle={vikinger_translation.photos}
                          noResultsTitle={vikinger_translation.photos_no_results_title}
                          noResultsText={vikinger_translation.photos_no_results_text}
                          {...this.props}
      />
    );
  }
}

module.exports = ActivityPhotoList;