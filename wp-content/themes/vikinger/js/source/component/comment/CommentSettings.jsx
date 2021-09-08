const React = require('react');

const plugins = require('../../utils/plugins');

const LoaderSpinnerSmall = require('../loader/LoaderSpinnerSmall'),
      MessageBox = require('../message/MessageBox'),
      IconSVG = require('../icon/IconSVG');

class CommentSettings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      processingDelete: false
    };

    this.settingsDropdownTriggerRef = React.createRef();
    this.settingsDropdownContentRef = React.createRef();

    this.messageBoxRef = React.createRef();
    this.messageBoxTriggerRef = React.createRef();

    this.deleteComment = this.deleteComment.bind(this);
  }

  deleteComment() {
    // return if already processing delete
    if (this.state.processingDelete) {
      return;
    }

    this.setState({
      processingDelete: true
    });

    const commentData = {
      id: this.props.data.id,
      hasChildren: this.props.data.hasChildren
    };

    this.props.deleteComment(commentData, () => {
      this.setState({
        processingDelete: false
      });
    });
  }

  componentDidMount() {
    plugins.createDropdown({
      triggerElement: this.settingsDropdownTriggerRef.current,
      containerElement: this.settingsDropdownContentRef.current,
      offset: {
        bottom: 30,
        left: 0
      },
      animation: {
        type: 'translate-bottom',
        speed: .3,
        translateOffset: {
          vertical: 20
        }
      }
    });

    this.popup = plugins.createPopup({
      triggerElement: this.messageBoxTriggerRef.current,
      premadeContentElement: this.messageBoxRef.current,
      type: 'premade',
      popupSelectors: ['message-box-popup', 'animate-slide-down'],
      onOverlayCreate: function (overlay) {
        overlay.setAttribute('data-simplebar', '');
      }
    });
  }

  render() {
    return (
      <div className="post-settings-wrap">
        <div ref={this.settingsDropdownTriggerRef} className="post-settings">
          <IconSVG  icon="more-dots"
                    modifiers="post-settings-icon small"
          />
        </div>

        <div ref={this.settingsDropdownContentRef} className="simple-dropdown">
          <div ref={this.messageBoxTriggerRef} className="simple-dropdown-link">{vikinger_translation.delete_comment} {this.state.processingDelete && <LoaderSpinnerSmall />}</div>

          <MessageBox ref={this.messageBoxRef}
                      data={{title: vikinger_translation.delete_comment_message_title, text: vikinger_translation.delete_comment_message_text}}
                      error
                      confirm
                      onAccept={() => {this.popup.hide(); this.deleteComment();}}
                      onCancel={() => {this.popup.hide();}}
          />
        </div>
      </div>
    );
  }
}

module.exports = CommentSettings;