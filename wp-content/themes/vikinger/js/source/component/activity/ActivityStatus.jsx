const React = require('react');

const app = require('../../utils/core');

const AvatarSmall = require('../avatar/AvatarSmall'),
      BadgeVerified = require('../badge/BadgeVerified'),
      AvatarMicro = require('../avatar/AvatarMicro'),
      PictureCollage = require('../picture/PictureCollage'),
      ActivityMediaPopup = require('./ActivityMediaPopup');

const YTPlayer = require('../iframe/YTPlayer');

const VideoPreview = require('../video/VideoPreview');

class ActivityStatus extends React.Component {
  constructor(props) {
    super(props);

    this.activityMediaPopupTriggerRef = React.createRef();

    this.onPlay = this.onPlay.bind(this);
  }

  onPlay() {
    this.props.onPlay(this.props.data.id);
  }

  render() {
    const displayVerifiedMemberBadge = vikinger_constants.plugin_active['bp-verified-member'] && vikinger_constants.settings.bp_verified_member_display_badge_in_activity_stream && this.props.data.author.verified;

    const bbPressActivity = (this.props.data.component === 'bbpress') || (this.props.data.type === 'bbp_topic_create') || (this.props.data.type === 'bbp_reply_create');

    return (
      <div ref={this.props.widgetBoxStatusRef} className="widget-box-status">
        <div className="widget-box-status-content">
          <div className="user-status">
            <div className="user-status-avatar">
              <AvatarSmall noBorder data={this.props.data.author} />
            </div>
        
            <div className="user-status-title medium">
              <a href={this.props.data.author.link}>{this.props.data.author.name}</a>
              {
                displayVerifiedMemberBadge &&
                  <BadgeVerified />
              }
              <span dangerouslySetInnerHTML={{__html: ` ${this.props.data.action}`}}></span>
              {
                (this.props.data.component === 'groups') && (this.props.data.type !== 'bbp_topic_create') && (this.props.data.type !== 'bbp_reply_create') &&
                  <React.Fragment>
                    <AvatarMicro data={this.props.data.group} noBorder />
                    <a href={this.props.data.group.link}>{this.props.data.group.name}</a>
                  </React.Fragment>
              }
            </div>

            <p className="user-status-text small">{this.props.data.timestamp}</p>
          </div>

          {
            (this.props.data.content !== '') &&
              <React.Fragment>
               {
                bbPressActivity &&
                  <div className="widget-box-status-html-content" dangerouslySetInnerHTML={{__html: app.replaceEnterWithBr(app.wrapLinks(this.props.data.content))}}></div>
              }

              {
                !bbPressActivity &&
                  <p className="widget-box-status-text" dangerouslySetInnerHTML={{__html: app.replaceEnterWithBr(app.wrapLinks(this.props.data.content))}}></p>
              }
              </React.Fragment>
          }

          {
            this.props.data.uploaded_media && (this.props.data.uploaded_media.data.length > 1) &&
              <PictureCollage data={this.props.data.uploaded_media.data}
                              metadata={this.props.data.uploaded_media.metadata}
                              user={this.props.user}
                              reactions={this.props.reactions}
                              noPopup={this.props.simpleActivity}
              />
          }
        </div>

        {
          this.props.data.uploaded_media && (this.props.data.uploaded_media.data.length === 1) &&
            <React.Fragment>
            {
              ((this.props.data.type === 'activity_video_update') || (this.props.data.type === 'activity_video_upload')) &&
                <VideoPreview src={this.props.data.uploaded_media.data[0].media.link} />
            }
            {
              ((this.props.data.type === 'activity_media_update') || (this.props.data.type === 'activity_media_upload')) &&
                <React.Fragment>
                  <figure ref={this.activityMediaPopupTriggerRef} className="widget-box-picture">
                    <img src={this.props.data.uploaded_media.data[0].media.link} alt={this.props.data.uploaded_media.data[0].media.name} />
                  </figure>

                {
                  !this.props.simpleActivity &&
                    <ActivityMediaPopup data={this.props.data.uploaded_media.data[0]}
                                        user={this.props.user}
                                        reactions={this.props.reactions}
                                        activityMediaPopupTriggerRef={this.activityMediaPopupTriggerRef}
                    />
                }
                </React.Fragment>
            }
            </React.Fragment>
        }

        {
          this.props.data.meta.attached_media_type && this.props.data.meta.attached_media_id &&
            <div className="iframe-wrap">
            {
              (this.props.data.meta.attached_media_type[0] === 'youtube') &&
                <React.Fragment>
                {
                  (vikinger_constants.settings.newsfeed_yt_playback_limit === 'yes') && !this.props.sharePopupActivity &&
                    <YTPlayer videoID={this.props.data.meta.attached_media_id[0]}
                              stop={this.props.data.meta.attached_media_stop}
                              onPlay={this.onPlay}
                    />
                }
                {
                  ((vikinger_constants.settings.newsfeed_yt_playback_limit === 'no') || this.props.sharePopupActivity) &&
                    <iframe src={app.getMediaLink(this.props.data.meta.attached_media_type[0], this.props.data.meta.attached_media_id[0])} allowFullScreen></iframe>
                }
                </React.Fragment>
            }
            
            {
              (this.props.data.meta.attached_media_type[0] !== 'youtube') &&
                <iframe src={app.getMediaLink(this.props.data.meta.attached_media_type[0], this.props.data.meta.attached_media_id[0])} allowFullScreen></iframe>
            }
            </div>
        }
      </div>
    );
  }
}

module.exports = ActivityStatus;