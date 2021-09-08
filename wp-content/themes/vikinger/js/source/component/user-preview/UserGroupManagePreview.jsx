const React = require('react');

const Avatar = require('../avatar/Avatar'),
      TagSticker = require('../tag/TagSticker'),
      GroupManagePopup = require('../group/GroupManagePopup');

class UserGroupManagePreview extends React.Component {
  constructor(props) {
    super(props);

    this.groupManagePopupTriggerRef = React.createRef();
  }

  render() {
    return (
      <div className="user-preview small fixed-height-medium">
        {/* USER PREVIEW COVER */}
        <div className="user-preview-cover" style={{background: `url('${this.props.data.cover_image_url}') center center /  cover no-repeat`}}></div>
        {/* USER PREVIEW COVER */}
      
        {/* USER PREVIEW INFO */}
        <div className="user-preview-info">
          <TagSticker icon={this.props.data.status} />

          {/* USER SHORT DESCRIPTION */}
          <div className="user-short-description small">
            <Avatar data={this.props.data}
                    modifiers="user-short-description-avatar"
            />

            <p className="user-short-description-title small"><a href={this.props.data.link}>{this.props.data.name}</a></p>
            <p className="user-short-description-text regular">{this.props.descriptionText}</p>
          </div>
          {/* USER SHORT DESCRIPTION */}

          <p ref={this.groupManagePopupTriggerRef} className="button white full">{vikinger_translation.manage_group}</p>
        </div>
        {/* USER PREVIEW INFO */}

        <GroupManagePopup groupManagePopupTriggerRef={this.groupManagePopupTriggerRef}
                          data={this.props.data}
                          loggedUser={this.props.loggedUser}
                          groupPreviewDescription={this.props.descriptionText}
                          forumOptions={this.props.forumOptions}
        />
      </div>
    );
  }
}

module.exports = UserGroupManagePreview;