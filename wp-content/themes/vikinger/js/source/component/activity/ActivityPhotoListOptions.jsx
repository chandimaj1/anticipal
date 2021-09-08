const React = require('react');

const ActivityMediaListOptions = require('./ActivityMediaListOptions'),
      ActivityPhotoUploadForm = require('./ActivityPhotoUploadForm');

class ActivityPhotoListOptions extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ActivityMediaListOptions uploadButtonText={vikinger_translation.upload_photos}
                                activityUploadForm={ActivityPhotoUploadForm}
                                {...this.props}
      />
    );
  }
}

module.exports = ActivityPhotoListOptions;