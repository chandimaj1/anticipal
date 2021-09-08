const React = require('react');

const ActivityMediaListOptions = require('./ActivityMediaListOptions'),
      ActivityVideoUploadForm = require('./ActivityVideoUploadForm');

class ActivityVideoListOptions extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ActivityMediaListOptions uploadButtonText={vikinger_translation.upload_video}
                                activityUploadForm={ActivityVideoUploadForm}
                                {...this.props}
      />
    );
  }
}

module.exports = ActivityVideoListOptions;