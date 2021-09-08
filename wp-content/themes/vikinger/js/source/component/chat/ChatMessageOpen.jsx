const React = require('react');

const plugins = require('../../utils/plugins');

const WP_Router = require('../../router/WP_Router')();

const AvatarSmall = require('../avatar/AvatarSmall'),
      AvatarTiny = require('../avatar/AvatarTiny'),
      BadgeVerified = require('../badge/BadgeVerified'),
      LoaderSpinnerSmall = require('../loader/LoaderSpinnerSmall'),
      IconSVG = require('../icon/IconSVG');

const SimpleBar = require('simplebar-react');

class ChatMessageOpen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      processingStar: false,
      starred: this.props.data.starred || false,
      send_message_text: ''
    };

    this.sendMessageTextInputRef = React.createRef();
    this.settingsDropdownTriggerRef = React.createRef();
    this.settingsDropdownContentRef = React.createRef();
    this.scrollableNodeRef = React.createRef();

    this.starMessage = this.starMessage.bind(this);
    this.unstarMessage = this.unstarMessage.bind(this);

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.simplebarStyles = {overflowX: 'hidden', height: '100%', padding: '35px 28px'};
  }

  starMessage() {
    // if already processing star, return
    if (this.state.processingStar) {
      return;
    }

    this.setState({
      processingStar: true
    });

    const starMessagePromise = WP_Router.starMessage(this.props.data.messages[0].id);

    starMessagePromise.then((response) => {
      // console.log('CHAT MESSAGE OPEN - STAR MESSAGE RESPONSE: ', response);

      this.setState({
        processingStar: false,
        starred: true
      }, this.props.onStarMessage);
    }, (error) => {
      // console.log('CHAT MESSAGE OPEN - STAR MESSAGE ERROR: ', error);

      this.setState({
        processingStar: false
      });
    });
  }

  unstarMessage() {
    // if already processing star, return
    if (this.state.processingStar) {
      return;
    }

    this.setState({
      processingStar: true
    });

    const unstarMessagePromise = WP_Router.unstarMessage(this.props.data.messages[0].id);

    unstarMessagePromise.then((response) => {
      // console.log('CHAT MESSAGE OPEN - UNSTAR MESSAGE RESPONSE: ', response);

      this.setState({
        processingStar: false,
        starred: false
      }, this.props.onUnstarMessage);
    }, (error) => {
      // console.log('CHAT MESSAGE OPEN - UNSTAR MESSAGE ERROR: ', error);

      this.setState({
        processingStar: false
      });
    });
  }

  onChange(e) {
    // console.log('CHAT MESSAGE OPEN - ON CHANGE: ', e.target.name, e.target.value);

    this.setState({
      [e.target.name]: e.target.value
    });
  }

  onSubmit(e) {
    e.preventDefault();

    // if no message was entered, return
    if (this.state.send_message_text === '') {
      return;
    }

    // console.log('CHAT MESSAGE OPEN - ON SUBMIT: ', this.props.data.id, this.state.send_message_text);

    this.props.onSendMessage(this.props.data.id, this.state.send_message_text, this.props.data.recipients_ids, () => {
      this.setState({
        send_message_text: ''
      });
    });
  }

  componentDidMount() {
    plugins.createDropdown({
      triggerElement: this.settingsDropdownTriggerRef.current,
      containerElement: this.settingsDropdownContentRef.current,
      offset: {
        top: 30,
        right: 9
      },
      animation: {
        type: 'translate-top',
        speed: .3,
        translateOffset: {
          vertical: 20
        }
      }
    });

    // console.log('CHAT MESSAGE OPEN - SIMPLEBAR SCROLLABLE NODE: ', this.scrollableNodeRef.current);
    // console.log('CHAT MESSAGE OPEN - SIMPLEBAR SCROLLABLE NODE HEIGHT: ', this.scrollableNodeRef.current.scrollHeight);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.data !== this.props.data) {
      this.setState({
        starred: this.props.data.starred
      });
    }
  }

  render() {
    // wait for animation frame before scrolling, otherwise element won't be fully rendered and scroll won't work
    window.requestAnimationFrame(() => {
      // scroll to bottom of messages
      this.scrollableNodeRef.current.scrollTo(0, this.scrollableNodeRef.current.scrollHeight);

      // focus send message input
      // this.sendMessageTextInputRef.current.focus();
    });

    const displayVerifiedMemberBadge = vikinger_constants.plugin_active['bp-verified-member'] && this.props.data.recipients[0].user.verified;

    return (
      <div className="chat-widget">
        {/* CHAT WIDGET HEADER */}
        <div className="chat-widget-header">
          {/* CHAT WIDGET SETTINGS */}
          <div className="chat-widget-settings">
            <div className="post-settings-wrap">
              <div ref={this.settingsDropdownTriggerRef} className="post-settings">
                <IconSVG  icon="more-dots"
                          modifiers="post-settings-icon"
                />
              </div>
      
              <div ref={this.settingsDropdownContentRef} className="simple-dropdown">
              {
                !this.state.starred &&
                  <div className="simple-dropdown-link" onClick={this.starMessage}>{vikinger_translation.star_action} {this.state.processingStar && <LoaderSpinnerSmall />}</div>
              }

              {
                this.state.starred &&
                  <div className="simple-dropdown-link" onClick={this.unstarMessage}>{vikinger_translation.unstar} {this.state.processingStar && <LoaderSpinnerSmall />}</div>
              }

                <div className="simple-dropdown-link" onClick={this.props.onDeleteThread}>{vikinger_translation.delete} {this.props.deletingThread && <LoaderSpinnerSmall />}</div>
              </div>
            </div>
          </div>
          {/* CHAT WIDGET SETTINGS */}
          
          {/* USER STATUS */}
          <div className="user-status">
            <AvatarSmall data={this.props.data.recipients[0].user} modifiers="user-status-avatar" noBorder />
            
            <p className="user-status-title">
              <a className="bold" href={this.props.data.recipients[0].user.link}>{this.props.data.recipients[0].user.name}</a>
              {
                displayVerifiedMemberBadge &&
                  <BadgeVerified />
              }
            </p>

            <p className="user-status-timestamp small-space">{`${vikinger_translation.started}: ${this.props.data.messages[0].timestamp}`}</p>
          </div>
          {/* USER STATUS */}
        </div>
        {/* CHAT WIDGET HEADER */}
    
        {/* CHAT WIDGET CONVERSATION */}
        <div className="chat-widget-conversation">
          <SimpleBar scrollableNodeProps={{ ref: this.scrollableNodeRef }} style={this.simplebarStyles}>
          {
            this.props.data.messages.map((message) => {
              return (
                <div className={`chat-widget-speaker animate-slide-down ${(message.user.id !== this.props.loggedUser.id) ? 'left' : 'right'}`} key={message.id}>
                {
                  (message.user.id !== this.props.loggedUser.id) &&
                    <div className="chat-widget-speaker-avatar">
                      <AvatarTiny data={message.user} noBorder noLink />
                    </div>
                }
          
                  <p className="chat-widget-speaker-message">{message.content}</p>
          
                  <p className="chat-widget-speaker-timestamp">{message.timestamp}</p>
                </div>
              );
            })
          }
          </SimpleBar>
        </div>
        {/* CHAT WIDGET CONVERSATION */}
    
        {/* CHAT WIDGET FORM */}
        <form className={`chat-widget-form ${this.props.sendingMessage ? 'disabled' : ''}`} onSubmit={this.onSubmit}>
          <div className="form-row split">
            <div className="form-item">
              <div className="interactive-input small">
                <input  ref={this.sendMessageTextInputRef}
                        type="text"
                        id="send_message_text"
                        name="send_message_text"
                        placeholder={vikinger_translation.write_a_message}
                        value={this.state.send_message_text}
                        onChange={this.onChange}
                        disabled={this.props.sendingMessage}
                />
                {
                  this.props.sendingMessage &&
                    <LoaderSpinnerSmall />
                }
              </div>
            </div>
  
            <div className="form-item auto-width">
              <button className="button primary padded" disabled={this.props.sendingMessage}>
                <IconSVG  icon="send-message"
                          modifiers="button-icon no-space"
                />
              </button>
            </div>
          </div>
        </form>
        {/* CHAT WIDGET FORM */}
      </div>
    );
  }
}

module.exports = ChatMessageOpen;