const React = require('react');

const IconSVG = require('../icon/IconSVG'),
      GroupManagePopup = require('../group/GroupManagePopup'),
      HexagonBorder_100_110 = require('../hexagon/HexagonBorder_100_110');

class ActionBox extends React.Component {
  constructor(props) {
    super(props);

    this.groupManagePopupTriggerRef = React.createRef();
  }

  render() {
    return (
      <div className="create-entity-box">
        <div className="create-entity-box-cover"></div>
    
        <div className="create-entity-box-avatar">
          <HexagonBorder_100_110 />
          <IconSVG icon="group" modifiers="create-entity-box-avatar-icon" />
        </div>
    
        <div className="create-entity-box-info">
          <p className="create-entity-box-title">{this.props.title}</p>
    
          <p className="create-entity-box-text">{this.props.text}</p>
    
          <p ref={this.groupManagePopupTriggerRef} className="button secondary full">{this.props.actionText}</p>
        </div>

        <GroupManagePopup groupManagePopupTriggerRef={this.groupManagePopupTriggerRef}
                          loggedUser={this.props.loggedUser}
                          groupPreviewDescription={this.props.text}
        />
      </div>
    );
  }
}

module.exports = ActionBox;