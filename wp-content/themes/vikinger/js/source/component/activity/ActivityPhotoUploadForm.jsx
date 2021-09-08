const React = require('react');

const ExpandableTextarea = require('../form/ExpandableTextarea'),
      UploadableMediaList = require('../media/UploadableMediaList');

class ActivityPhotoUploadForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      text: '',
      submitting: false,
      uploadable_media: [],
      uploadable_media_type: 'image',
      errors: []
    };

    this.handleChange = this.handleChange.bind(this);
    this.discardContent = this.discardContent.bind(this);
    this.submitContent = this.submitContent.bind(this);

    this.addUploadableMedia = this.addUploadableMedia.bind(this);
    this.removeUploadableMedia = this.removeUploadableMedia.bind(this);
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
        errors: [{text: vikinger_translation.upload_form_photo_empty_error}]
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

    // only add photos data if user didn't cancel
    if (data.length > 0) {
      const errors = [],
            photosData = [];

      let fileSizeError = false;

      for (const photoData of data) {
        // only add photo if size is not higher than maximum allowed
        const photoSizeInMB = photoData.file.size / (1024 * 1024);

        // only add photo if file extension is allowed
        const extensionAllowed = vikinger_constants.settings.media_photo_allowed_extensions.includes(photoData.extension);

        // if photo extension is not allowed, add error
        if (!extensionAllowed) {
          errors.push({
            text: `"${photoData.file.name}" ${vikinger_translation.file_extension_is_not_allowed}.`
          });
        // if photo size is higher than allowed, add error
        } else if (photoSizeInMB > vikinger_constants.settings.media_photo_upload_maximum_size) {
          fileSizeError = true;

          errors.push({
            text: `"${photoData.file.name}" ${vikinger_translation.size_is_too_big} (${Number.parseFloat(photoSizeInMB).toFixed(2)}MB).`
          });
        } else {
          photosData.push(photoData);
        }
      }

      if ((errors.length > 0) && fileSizeError) {
        errors.push({
          text: `${vikinger_translation.maximum_size_accepted_is} ${vikinger_constants.settings.media_photo_upload_maximum_size}MB.`
        });
      }

      this.setState((state, props) => {
        return {
          uploadable_media: state.uploadable_media.concat(photosData),
          errors: errors
        };
      }, () => {
        // console.log('ACTIVITY MEDIA UPLOAD FORM - UPLOADABLE MEDIA: ', this.state.uploadable_media);
      });
    }
  }

  removeUploadableMedia(id) {
    // console.log('ACTIVITY MEDIA UPLOAD FORM - REMOVE UPLOADABLE MEDIA: ', id);

    this.setState((state, props) => {
      const uploadableMedia = state.uploadable_media.filter((media, i) => {
        if (media.id === id) {
          // release object URL reference
          URL.revokeObjectURL(media.url);
        }

        return media.id !== id;
      });

      // console.log('ACTIVITY MEDIA UPLOAD FORM - UPLOADABLE MEDIA: ', uploadableMedia);

      return {
        uploadable_media: uploadableMedia
      };
    });
  }

  render() {
    return (
      <div ref={this.props.forwardedRef} className={`quick-post ${this.state.submitting ? 'disabled' : ''}`}>
        <div className="quick-post-header">
          <div className="quick-post-header-filters-wrap">
            {/* QUICK POST HEADER TITLE */}
            <p className="quick-post-header-title">{vikinger_translation.upload_photos}</p>
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

          <UploadableMediaList  data={this.state.uploadable_media}
                                onSelect={this.addUploadableMedia}
                                onRemove={this.removeUploadableMedia}
                                disabled={this.state.submitting}
          />
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

const ActivityPhotoUploadFormForwardRef = React.forwardRef((props, ref) => {
  return (
    <ActivityPhotoUploadForm {...props} forwardedRef={ref} />
  )
});

module.exports = ActivityPhotoUploadFormForwardRef;