const React = require('react');

const ExpandableTextarea = require('../form/ExpandableTextarea'),
      MentionBlock = require('../mention/MentionBlock'),
      LoaderSpinnerSmall = require('../loader/LoaderSpinnerSmall'),
      IconSVG = require('../icon/IconSVG');

class ChatMessageNew extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      send_message_text: '',
      recipients_text: '',
      recipients: [],
      creatingThread: false
    };

    this.sendMessageTextInputRef = React.createRef();

    this.onChange = this.onChange.bind(this);
    this.onRecipientsChange = this.onRecipientsChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.deleteRecipients = this.deleteRecipients.bind(this);
  }

  onChange(e) {
    // console.log('CHAT MESSAGE NEW - ON CHANGE: ', e.target.name, e.target.value);

    this.setState({
      [e.target.name]: e.target.value
    });
  }

  onRecipientsChange(e) {
    // console.log('CHAT MESSAGE NEW - ON RECIPIENTS CHANGE: ', e.target);

    if (e.target.user) {
      this.sendMessageTextInputRef.current.focus();
    }

    this.setState({
      [e.target.name]: e.target.value,
      recipients: e.target.user ? [e.target.user] : []
    });
  }

  deleteRecipients() {
    this.setState({
      recipients_text: '',
      recipients: []
    });
  }

  onSubmit(e) {
    e.preventDefault();

    // if already submitting or no recipient or no message was entered, return
    if ((this.state.creatingThread) || (this.state.recipients.length === 0) || (this.state.send_message_text === '')) {
      return;
    }

    this.setState({
      creatingThread: true
    });

    // console.log('CHAT MESSAGE NEW - ON SUBMIT: ', this.state);

    const recipients_ids = [];

    for (const recipient of this.state.recipients) {
      recipients_ids.push(recipient.id);
    }

    this.props.onCreateThread(this.state.send_message_text, recipients_ids);
  }

  componentDidMount() {
    // start sending to a user
    if (this.props.userID) {
      const friend = this.props.loggedUser.friends.filter(friend => friend.id === this.props.userID)[0];

      this.setState({
        recipients_text: friend.mention_name,
        recipients: [friend]
      });

      this.props.clearSendMessageUser();
    }
  }
  
  render() {
    return (
      <div className="chat-widget">
        {/* CHAT WIDGET HEADER */}
        <div className="chat-widget-header no-padding">
          <p className="chat-widget-header-title">{vikinger_translation.new_message}</p>

          <div className="chat-widget-header-form">
          {
            (this.state.recipients.length > 0) &&
              <div className="chat-widget-header-recipient">
                <MentionBlock data={this.state.recipients[0]} onActionClick={this.deleteRecipients} />
              </div>
          }
          {
            (this.state.recipients.length === 0) &&
              <ExpandableTextarea name='recipients_text'
                                  modifiers='small'
                                  value={this.state.recipients_text}
                                  minHeight={50}
                                  placeholder={vikinger_translation.add_friend_placeholder}
                                  userFriends={this.props.loggedUser.friends}
                                  handleChange={this.onRecipientsChange}
                                  disabled={this.state.creatingThread}
                                  hideLimit
                                  disableEnter
              />
          }
          </div>
        </div>
        {/* CHAT WIDGET HEADER */}
    
        {/* CHAT WIDGET CONVERSATION */}
        <div className="chat-widget-conversation with-recipient">
        </div>
        {/* CHAT WIDGET CONVERSATION */}
    
        {/* CHAT WIDGET FORM */}
        <form className={`chat-widget-form ${this.state.creatingThread ? 'disabled' : ''}`} onSubmit={this.onSubmit}>
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
                        disabled={this.state.creatingThread}
                />
                {
                  this.state.creatingThread &&
                    <LoaderSpinnerSmall />
                }
              </div>
            </div>
  
            <div className="form-item auto-width">
              <button className="button primary padded" disabled={this.state.creatingThread}>
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

module.exports = ChatMessageNew;