const React = require('react');

const ExpandableTextarea = require('../form/ExpandableTextarea'),
      VideoPreview = require('../video/VideoPreview'),
      UploadVideoButton = require('../video/UploadVideoButton');

class ActivityVideoUploadForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      text: '',
      submitting: false,
      uploadable_media: [],
      uploadable_media_type: 'video',
      errors: []
    };

    this.handleChange = this.handleChange.bind(this);
    this.discardContent = this.discardContent.bind(this);
    this.submitContent = this.submitContent.bind(this);

    this.addUploadableMedia = this.addUploadableMedia.bind(this);
  }

  discardContent() {
    this.setState({
      text: '',
      uploadable_media: [],
      errors: []
    });

    if (this.props.popup) {
      this.props.popup.hide();
    }
  }

  submitContent() {
    // if didn't select any media, or already submitting form, return
    if ((this.state.uploadable_media.length === 0) || this.state.submitting) {
      this.setState({
        errors: [{text: vikinger_translation.upload_form_video_empty_error}]
      });

      return;
    }

    this.setState({
      submitting: true,
      errors: []
    });

    // console.log('ACTIVITY MEDIA UPLOAD FORM - POST CONTENT: ', this.state);

    this.props.onSubmit(this.state, (response) => {
      // console.log('ACTIVITY MEDIA UPLOAD FORM - CREATED ACTIVITY: ', response);

      if (response) {
        this.discardContent();

        if (this.props.popup) {
          this.props.popup.hide();
        }
      } else {
        // console.log('ACTIVITY MEDIA UPLOAD FORM - ERROR CREATING ACTIVITY');
      }

      this.setState({
        submitting: false
      });
    });
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    }, () => {
      // console.log('ACTIVITY MEDIA UPLOAD FORM - STATE:', this.state);
    });
  }

  addUploadableMedia(data) {
    // console.log('ACTIVITY MEDIA UPLOAD FORM - ADD UPLOADABLE MEDIA: ', data);

    // only add video data if user didn't cancel
    if (data.length > 0) {
      // only add video if size is not higher than maximum allowed
      const videoData = data[0],
            videoSizeInMB = videoData.file.size / (1024 * 1024);

      // only add photo if file extension is allowed
      const extensionAllowed = vikinger_constants.settings.media_video_allowed_extensions.includes(videoData.extension);

      // if photo extension is not allowed, add error
      if (!extensionAllowed) {
        this.setState({
          errors: [
            {
              text: `"${videoData.file.name}" ${vikinger_translation.file_extension_is_not_allowed}.`
            }
          ]
        });
      // if video size is higher than allowed, show error
      } else if (videoSizeInMB > vikinger_constants.settings.media_video_upload_maximum_size) {
        this.setState({
          errors: [
            {
              text: `"${videoData.file.name}" ${vikinger_translation.size_is_too_big} (${Number.parseFloat(videoSizeInMB).toFixed(2)}MB).`
            },
            {
              text: `${vikinger_translation.maximum_size_accepted_is} ${vikinger_constants.settings.media_video_upload_maximum_size}MB.`
            }
          ]
        });
      } else {
        this.setState({
          uploadable_media: data,
          errors: []
        });
      }
    }
  }

  render() {
    return (
      <div ref={this.props.forwardedRef} className={`quick-post ${this.state.submitting ? 'disabled' : ''}`}>
        <div className="quick-post-header">
          <div className="quick-post-header-filters-wrap">
            {/* QUICK POST HEADER TITLE */}
            <p className="quick-post-header-title">{vikinger_translation.upload_video}</p>
            {/* QUICK POST HEADER TITLE */}
          </div>
        </div>
        
        {/* QUICK POST BODY */}
        <div className="quick-post-body">
          <form className={`form ${this.state.submitting ? 'disabled' : ''}`}>
            <div className="form-row">
              <div className="form-item">
                <ExpandableTextarea name='text'
                                    value={this.state.text}
                                    maxLength={vikinger_constants.settings.activity_character_limit}
                                    minHeight={120}
                                    placeholder={`${vikinger_translation.activity_form_placeholder_1} ${this.props.user.name}! ${vikinger_translation.activity_form_placeholder_2}`}
                                    userFriends={this.props.user.friends}
                                    handleChange={this.handleChange}
                                    loading={this.state.submitting}
                                    disabled={this.state.submitting}
                />
              </div>
            </div>
          </form>

          {
            (this.state.uploadable_media.length > 0) &&
              <VideoPreview src={this.state.uploadable_media[0].url} />
          }
        </div>
        {/* QUICK POST BODY */}

        {/* QUICK POST FOOTER WRAP */}
        <div className="quick-post-footer-wrap">
        {
          this.state.errors.length > 0 &&
            <div className="quick-post-footer-errors">
            {
              this.state.errors.map((error, i) => {
                return (
                <p key={i} className="quick-post-footer-error error-field-message">* {error.text}</p>
                );
              })
            }
            </div>
        }
    
          {/* QUICK POST FOOTER */}
          <div className="quick-post-footer">
            {/* QUICK POST FOOTER ACTIONS */}
            <div className="quick-post-footer-actions">
              <UploadVideoButton onSelect={this.addUploadableMedia} />
            </div>
            {/* QUICK POST FOOTER ACTIONS */}

            {/* QUICK POST FOOTER ACTIONS */}
            <div className="quick-post-footer-actions">
              <p className="button small void" onClick={this.discardContent}>{vikinger_translation.discard}</p>
              <p className="button small secondary" onClick={this.submitContent}>{vikinger_translation.post_action}</p>
            </div>
            {/* QUICK POST FOOTER ACTIONS */}
          </div>
          {/* QUICK POST FOOTER */}
        </div>
        {/* QUICK POST FOOTER WRAP */}
      </div>
    );
  }
}

const ActivityVideoUploadFormForwardRef = React.forwardRef((props, ref) => {
  return (
    <ActivityVideoUploadForm {...props} forwardedRef={ref} />
  )
});

module.exports = ActivityVideoUploadFormForwardRef;