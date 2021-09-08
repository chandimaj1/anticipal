const React = require('react');

const app = require('../../utils/core'),
      plugins = require('../../utils/plugins');

const activityUtils = require('../utils/activity'),
      AvatarSmall = require('../avatar/AvatarSmall'),
      BadgeVerified = require('../badge/BadgeVerified'),
      ExpandableTextarea = require('../form/ExpandableTextarea'),
      MediaLinkPreview = require('../media/MediaLinkPreview'),
      UploadableMediaList = require('../media/UploadableMediaList'),
      IconSVG = require('../icon/IconSVG');

const UploadVideoButton = require('../video/UploadVideoButton'),
      VideoPreview = require('../video/VideoPreview');

class ActivityForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      text: '',
      postIn: props.postIn ? props.postIn : '0',
      submitting: false,
      attached_media: false,
      uploadable_media_type: false,
      uploadable_media: false,
      errors: []
    };

    this.photoTooltipRef = React.createRef();

    this.handleChange = this.handleChange.bind(this);
    this.discardContent = this.discardContent.bind(this);
    this.resetAttachedMedia = this.resetAttachedMedia.bind(this);
    this.submitContent = this.submitContent.bind(this);

    this.addUploadableMedia = this.addUploadableMedia.bind(this);
    this.removeUploadableMedia = this.removeUploadableMedia.bind(this);

    this.addUploadableVideo = this.addUploadableVideo.bind(this);

    this.toggleUploadablePhotosBar = this.toggleUploadablePhotosBar.bind(this);
  }

  discardContent() {
    this.setState({
      text: '',
      attached_media: false,
      uploadable_media_type: false,
      uploadable_media: false,
      errors: []
    });

    if (this.props.popup) {
      this.props.popup.hide();
    }
  }

  toggleUploadablePhotosBar() {
    this.setState((state, props) => {
      if (state.uploadable_media && (state.uploadable_media_type === 'image')) {
        return {
          uploadable_media: false,
          uploadable_media_type: false,
          errors: []
        };
      }

      return {
        uploadable_media: [],
        uploadable_media_type: 'image',
        errors: []
      };
    });
  }

  submitContent() {
    // if already submitting form or not sharing post and no message entered, return
    if (this.state.submitting || (!this.props.shareData && (this.state.text === '') && !this.state.uploadable_media || (this.state.uploadable_media && this.state.uploadable_media.length === 0))) {
      this.setState({
        errors: [{text: vikinger_translation.activity_form_empty_error}]
      });

      return;
    }

    this.setState({
      submitting: true,
      errors: []
    });

    // console.log('ACTIVITY FORM - POST CONTENT: ', this.state);

    this.props.onSubmit(this.state, (response) => {
      // console.log('ACTIVITY FORM - CREATED ACTIVITY: ', response);

      if (response) {
        this.discardContent();

        this.setState({
          submitting: false
        });

        if (this.props.popup) {
          this.props.popup.hide();
        }
      } else {
        // console.log('ACTIVITY FORM - ERROR CREATING ACTIVITY');

        this.setState({
          submitting: false
        });
      }
    });
  }

  resetAttachedMedia() {
    this.setState({
      attached_media: false
    });
  }
  
  handleChange(e) {
    // text change
    if (e.target.name === 'text') {
      // check if there is a media link in the text content
      const attached_media = app.extractAttachedMedia(e.target.value);
      // console.log('ACTIVITY FORM - EXTRACTED ATTACHED MEDIA: ', attached_media);

      this.setState({
        attached_media: attached_media
      });
    }

    this.setState({
      [e.target.name]: e.target.value
    }, () => {
      // console.log('ACTIVITY FORM - STATE:', this.state);
    });
  }

  componentDidMount() {
    if (!this.props.shareData && vikinger_constants.plugin_active.vkmedia && vikinger_constants.settings.media_photo_upload_enabled) {
      plugins.createTooltip({
        containerElement: this.photoTooltipRef.current,
        offset: 8,
        direction: 'top',
        animation: {
          type: 'translate-out-fade'
        }
      });
    }
  }

  addUploadableVideo(data) {
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
          uploadable_media_type: 'video',
          errors: []
        });
      }
    }
  }

  addUploadableMedia(data) {
    // console.log('ACTIVITY FORM - ADD UPLOADABLE MEDIA: ', data);

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
        // console.log('ACTIVITY FORM - UPLOADABLE MEDIA: ', this.state.uploadable_media);
      });
    }
  }

  removeUploadableMedia(id) {
    // console.log('ACTIVITY FORM - REMOVE UPLOADABLE MEDIA: ', id);

    this.setState((state, props) => {
      const uploadableMedia = state.uploadable_media.filter((media, i) => {
        if (media.id === id) {
          // release object URL reference
          URL.revokeObjectURL(media.url);
        }

        return media.id !== id;
      });

      // console.log('ACTIVITY FORM - UPLOADABLE MEDIA: ', uploadableMedia);

      return {
        uploadable_media: uploadableMedia
      };
    });
  }

  render() {
    let ActivityFormat = false;

    if (this.props.shareData) {
      if (this.props.shareData.format) {
        ActivityFormat = this.props.shareData.format;
      }
    }

    const ActivityTemplate = this.props.shareData ? activityUtils().getActivityTemplate(this.props.shareData.type, ActivityFormat) : '';

    const displayVerifiedMemberBadge = vikinger_constants.plugin_active['bp-verified-member'] && vikinger_constants.settings.bp_verified_member_display_badge_in_activity_stream && this.props.user.verified;

    const userGroups = this.props.user.groups.filter(group => !group.is_banned);

    return (
      <div ref={this.props.forwardedRef} className={`quick-post ${this.state.submitting ? 'disabled' : ''}`}>
        <div className="quick-post-header">
          <div className="quick-post-header-filters-wrap">
            {/* USER STATUS */}
            <div className="user-status">
              <div className="user-status-avatar">
                <AvatarSmall data={this.props.user} noBorder noLink />
              </div>
          
              <p className="user-status-title medium">
                <span className="bold">{this.props.user.name}</span>
                {
                  displayVerifiedMemberBadge &&
                    <BadgeVerified />
                }
              </p>
              <p className="user-status-text small">{vikinger_translation.status_update}</p>
            </div>  
            {/* USER STATUS */}

            {/* QUICK POST HEADER FILTERS */}
            <form className="quick-post-header-filters">
              <div className="form-row split">
                <div className="form-item">
                  <div className="form-select">
                    <label htmlFor="post-in">{vikinger_translation.post_in}</label>
                    <select id="post-in" name="postIn" value={this.state.postIn} onChange={this.handleChange}>
                      <option value="0">{vikinger_translation.my_profile}</option>
                      {
                        vikinger_constants.plugin_active.buddypress_groups &&
                          userGroups.map((group) => {
                            return (
                              <option key={group.id} value={group.id}>{group.name}</option>
                            );
                          })
                      }
                    </select>
                    <IconSVG  icon="small-arrow"
                              modifiers="form-select-icon"
                    />
                  </div>
                </div>
              </div>
            </form>
            {/* QUICK POST HEADER FILTERS */}
          </div>
        </div>
        
        {/* QUICK POST BODY */}
        <div className={`quick-post-body ${this.props.shareData ? 'with-share-data' : ''}`}>
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
            this.state.attached_media &&
              <MediaLinkPreview iframeSrc={this.state.attached_media.link}
                                onCloseButtonClick={this.resetAttachedMedia}
                                disabled={this.state.submitting}
              />
          }

          {
            !this.props.shareData && this.state.uploadable_media &&
              <React.Fragment>
              {
                (this.state.uploadable_media_type === 'video') &&
                  <VideoPreview src={this.state.uploadable_media[0].url} />
              }
              {
                (this.state.uploadable_media_type === 'image') &&
                  <UploadableMediaList  data={this.state.uploadable_media}
                                        onSelect={this.addUploadableMedia}
                                        onRemove={this.removeUploadableMedia}
                                        disabled={this.state.submitting}
                  />
              }
              </React.Fragment>
          }

          {
            this.props.shareData &&
            (
              <div className="widget-box no-padding">
                <ActivityTemplate data={this.props.shareData}
                                  simpleActivity
                                  sharePopupActivity
                                  user={this.props.user}
                />
              </div>
            )
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
              {
                !this.props.shareData && vikinger_constants.plugin_active.vkmedia &&
                  <React.Fragment>
                  {
                    vikinger_constants.settings.media_photo_upload_enabled && 
                      <div className="quick-post-footer-action" ref={this.photoTooltipRef} data-title={vikinger_translation.add_photo} onClick={this.toggleUploadablePhotosBar}>
                        <IconSVG  icon="camera"
                                  modifiers="quick-post-footer-action-icon"
                        />
                      </div>
                  }
                  {
                    vikinger_constants.settings.media_video_upload_enabled &&
                      <UploadVideoButton onSelect={this.addUploadableVideo} />
                  }
                  </React.Fragment>
              }
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

const ActivityFormForwardRef = React.forwardRef((props, ref) => {
  return (
    <ActivityForm {...props} forwardedRef={ref} />
  )
});

module.exports = ActivityFormForwardRef;