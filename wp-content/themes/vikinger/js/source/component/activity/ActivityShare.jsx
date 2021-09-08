const React = require('react');

const app = require('../../utils/core');

const activityUtils = require('../utils/activity'),
      AvatarMicro = require('../avatar/AvatarMicro'),
      AvatarSmall = require('../avatar/AvatarSmall'),
      BadgeVerified = require('../badge/BadgeVerified'),
      AlertLine = require('../alert/AlertLine');

class ActivityShare extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let ActivityFormat, ActivityTemplate;

    if (this.props.data.shared_item) {
      ActivityFormat = this.props.data.shared_item.format ? this.props.data.shared_item.format : false,
      ActivityTemplate = activityUtils().getActivityTemplate(this.props.data.shared_item.type, ActivityFormat);
    }

    const displayVerifiedMemberBadge = vikinger_constants.plugin_active['bp-verified-member'] && vikinger_constants.settings.bp_verified_member_display_badge_in_activity_stream && this.props.data.author.verified;

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
                (this.props.data.component === 'groups') &&
                  <React.Fragment>
                    <AvatarMicro data={this.props.data.group} noBorder />
                    <a href={this.props.data.group.link}>{this.props.data.group.name}</a>
                  </React.Fragment>
              }
            </div>

            <p className="user-status-text small">{this.props.data.timestamp}</p>
          </div>
  
          <p className="widget-box-status-text" dangerouslySetInnerHTML={{__html: app.replaceEnterWithBr(app.wrapLinks(this.props.data.content))}}></p>
          {
            !this.props.data.shared_item &&
              <AlertLine  type="info"
                          title={vikinger_translation.shared_content_deleted_title}
                          text={vikinger_translation.shared_content_deleted_text}
              /> 
          }
          {
            this.props.data.shared_item &&
              <div className="widget-box no-padding">
                  <ActivityTemplate data={this.props.data.shared_item}
                                    updateSlider={this.props.updateSlider}
                                    loggedUser={this.props.user}
                                    simpleActivity
                                    sharePopupActivity={this.props.sharePopupActivity}
                  />
              </div>
          }
        </div>
      </div>
    );
  }
}

module.exports = ActivityShare;