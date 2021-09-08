const React = require('react');

const app = require('../../utils/core'),
      plugins = require('../../utils/plugins');

const WP_Router = require('../../router/WP_Router')();

const SectionHeader = require('../section/SectionHeader'),
      MessageBox = require('../message/MessageBox'),
      Loader = require('../loader/Loader');

const ChatMessages = require('../chat/ChatMessages');

class MessagesSettingsScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loggedUser: false,
      userID: props.userID,
      messageID: props.messageID,
      messages: [],
      moreItems: true,
      initialFetch: true,
      loading: true,
      loadingMore: false,
      creatingNewMessage: true,
      filters: {
        page: 1,
        per_page: 100,
        box: 'inbox'
      },
      selectedMessage: false,
      sendingMessage: false,
      deletingThread: false
    };

    this.replaceMessages = false;

    this.messageBoxRef = React.createRef();

    this.getMessagesPage = this.getMessagesPage.bind(this);
    this.updateFiltersRefresh = this.updateFiltersRefresh.bind(this);
    this.createNewMessage = this.createNewMessage.bind(this);
    this.onStarMessage = this.onStarMessage.bind(this);
    this.onUnstarMessage = this.onUnstarMessage.bind(this);
    this.selectMessage = this.selectMessage.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.createThread = this.createThread.bind(this);

    this.clearSendMessageUser = this.clearSendMessageUser.bind(this);
  }

  getLoggedInMember(callback = () => {}) {
    WP_Router.getLoggedInMember('user-friends')
    .done((response) => {
      // console.log('MESSAGES SETTINGS SCREEN - LOGGED IN USER: ', response);

      this.setState((state, props) => {
        return {
          loggedUser: response,
          filters: this.mergeFilters(state.filters, {user_id: response.id})
        };
      }, callback);
    });
  }

  mergeFilters(oldFilters, newFilters) {
    const mergedFilters = app.deepMerge(oldFilters, newFilters);

    // remove search filter if it is empty
    if ((typeof mergedFilters.search !== 'undefined') && (mergedFilters.search === '')) {
      delete mergedFilters.search;
    }

    return mergedFilters;
  }

  refreshMessages(selectFirst = false) {
    // console.log('MESSAGES SETTINGS SCREEN - REFRESH MESSAGES');

    this.replaceMessages = true;

    this.setState((state, props) => {
      return {
        loading: true,
        filters: this.mergeFilters(state.filters, {page: 1})
      }; 
    }, () => {
      this.getMessagesPage(selectFirst);
    });
  }

  updateFiltersRefresh(filters) {
    // console.log('MESSAGES SETTINGS SCREEN - UPDATE FILTERS REFRESH: ', filters);

    this.setState((state, props) => {
      return {
        filters: this.mergeFilters(state.filters, filters)
      };
    }, this.refreshMessages);
  }

  getMessagesPage(selectFirst = false) {
    this.setState({
      loadingMore: true
    });

    const getMessagesPromise = WP_Router.getMessages(this.state.filters);

    getMessagesPromise.then((response) => {
      // console.log('MESSAGES SETTINGS SCREEN - GET MESSAGES PAGE ', this.state.filters.page, ' RESPONSE: ', response);

      this.setState((state, props) => {
        const newMessages = this.replaceMessages ? response.data : state.messages.concat(response.data),
              moreItems = response.headers['X-WP-TotalPages'] > state.filters.page;

        let selectedMessage = (typeof selectFirst === 'boolean') && selectFirst && newMessages.length > 0 ? newMessages[0] : state.selectedMessage;

        // pre selected message
        if (state.messageID) {
          for (const message of newMessages) {
            if (message.id === state.messageID) {
              selectedMessage = message;

              // if selected message thread is unread, mark it as read
              if (message.unread_count > 0) {
                this.markMessageThreadAsRead(message);
              }

              break;
            }
          }
        }

        this.replaceMessages = false;

        // console.log('MESSAGES SETTINGS SCREEN - MORE ITEMS ', moreItems);

        return {
          messages: newMessages,
          initialFetch: false,
          selectedMessage: selectedMessage,
          creatingNewMessage: !selectedMessage,
          loading: false,
          loadingMore: false,
          moreItems: moreItems,
          filters: this.mergeFilters(state.filters, {page: state.filters.page + 1}),
          messageID: false
        };
      }, () => {
        // console.log('MESSAGE SETTINGS SCREEN - FILTERS: ', this.state.filters);
      });
    }, (error) => {
      // console.log('MESSAGES SETTINGS SCREEN - GET MESSAGES PAGE ', this.state.filters.page, ' ERROR: ', error);
    });
  }

  markMessageThreadAsRead(message) {
    const markMessageThreadAsReadPromise = WP_Router.markMessageThreadAsRead(message.id);

    markMessageThreadAsReadPromise.then((response) => {
      // console.log('MESSAGE SETTINGS SCREEN - MARK THREAD AS READ RESPONSE: ', response);
    }, (error) => {
      // console.log('MESSAGE SETTINGS SCREEN - MARK THREAD AS READ ERROR: ', error);
    });

    // optimistic mark as read
    message.unread_count = 0;
  }

  selectMessage(message) {
     // if message already selected, return
     if (this.state.selectedMessage === message) {
      return;
    }

    // console.log('MESSAGE SETTINGS SCREEN - SELECTED MESSAGE: ', message);

    // if selected message thread is unread, mark it as read
    if (message.unread_count > 0) {
      this.markMessageThreadAsRead(message);
    }

    this.setState({
      selectedMessage: message,
      creatingNewMessage: false
    });
  }

  createNewMessage() {
    this.setState({
      creatingNewMessage: true,
      selectedMessage: false
    });
  }

  onStarMessage() {
    const messageInBox = this.state.messages.some(message => message.id === this.state.selectedMessage.id);

    // if message is not on the currently selected box, return
    // this can happen due to the previous selected message display function, that displays previous selected message
    // even when changing boxes and the message is in another box
    if (!messageInBox) {
      return;
    }

    // optimistic star update
    this.setState((state, props) => {
      const newMessages = state.messages.slice();

      let newSelectedMessage;

      for (const message of newMessages) {
        if (message.id === state.selectedMessage.id) {
          newSelectedMessage = message;
          message.starred = true;
          break;
        }
      }

      // console.log('MESSAGE SETTINGS SCREEN - NEW MESSAGES: ', newMessages);
      // console.log('MESSAGE SETTINGS SCREEN - NEW SELECTED MESSAGE: ', newSelectedMessage);

      return {
        messages: newMessages,
        selectedMessage: newSelectedMessage
      };
    });
  }

  onUnstarMessage() {
    const messageInBox = this.state.messages.some(message => message.id === this.state.selectedMessage.id);

    // if message is not on the currently selected box, return
    // this can happen due to the previous selected message display function, that displays previous selected message
    // even when changing boxes and the message is in another box
    if (!messageInBox) {
      return;
    }

    // optimistic unstar update
    this.setState((state, props) => {
      const newMessages = state.messages.slice();

      let newSelectedMessage;

      for (const message of newMessages) {
        if (message.id === state.selectedMessage.id) {
          newSelectedMessage = message;
          message.starred = false;
          break;
        }
      }

      // console.log('MESSAGE SETTINGS SCREEN - NEW MESSAGES: ', newMessages);
      // console.log('MESSAGE SETTINGS SCREEN - NEW SELECTED MESSAGE: ', newSelectedMessage);

      return {
        messages: newMessages,
        selectedMessage: newSelectedMessage
      };
    });
  }

  deleteThread() {
    // if already deleting thread, return
    if (this.state.deletingThread) {
      return;
    }

    const threadID = this.state.selectedMessage.id;

    this.setState({
      deletingThread: true
    });

    const deleteMessagePromise = WP_Router.deleteMessageThread({
      thread_id: threadID,
      user_id: this.state.loggedUser.id
    });

    deleteMessagePromise.then((response) => {
      // console.log('CHAT MESSAGE OPEN - DELETE MESSAGE RESPONSE: ', response);
    }, (error) => {
      // console.log('CHAT MESSAGE OPEN - DELETE MESSAGE ERROR: ', error);
    });

    // check if user wants to delete message while being on another box
    // i.e. selected a message, changed box, and trying to delete message (last selected message feature)
    const messageInThisBox = this.state.messages.some(thread => thread.id === threadID);

    // if message is in this box, delete it
    if (messageInThisBox) {
      // optimistic delete
      this.setState((state, props) => {
        // get selected message index
        let selectedMessageIndex;

        for (let i = 0; i < state.messages.length; i++) {
          const thread = state.messages[i];

          if (thread.id === threadID) {
            selectedMessageIndex = i;
            break;
          }
        }

        const messages = state.messages.slice(),
              newMessages = messages.filter(thread => thread.id !== threadID);

        let newSelectedMessage = newMessages.length > 0;

        if (newSelectedMessage) {
          if (typeof newMessages[selectedMessageIndex] !== 'undefined') {
            newSelectedMessage = newMessages[selectedMessageIndex];
          } else {
            newSelectedMessage = newMessages[selectedMessageIndex - 1];
          }
        }

        // console.log('MESSAGE SETTINGS SCREEN - MESSAGES AFTER DELETION: ', newMessages);
        // console.log('MESSAGE SETTINGS SCREEN - SELECTED MESSAGE INDEX: ', selectedMessageIndex);
        // console.log('MESSAGE SETTINGS SCREEN - NEW SELECTED MESSAGE: ', newSelectedMessage);

        return {
          messages: newMessages,
          selectedMessage: newSelectedMessage,
          creatingNewMessage: typeof newSelectedMessage === 'boolean',
          deletingThread: false
        };
      });
    } else {
      // show new message screen
      this.setState({
        selectedMessage: false,
        creatingNewMessage: true,
        deletingThread: false
      });
    }
  }

  createThread(messageContent, recipients) {
    // console.log('MESSAGE SETTINGS SCREEN - CREATE THREAD: ', messageContent, recipients);

    const createThreadPromise = WP_Router.sendMessage({
      message: messageContent,
      recipients: recipients,
      sender_id: this.state.loggedUser.id
    });

    createThreadPromise.then((response) => {
      // console.log('MESSAGE SETTINGS SCREEN - CREATE THREAD RESPONSE: ', response);

      this.setState((state, props) => {
        return {
          filters: this.mergeFilters(state.filters, {box: 'sentbox'})
        };
      }, () => {
        this.refreshMessages(true);
      });
    }, (error) => {
      // console.log('MESSAGE SETTINGS SCREEN - CREATE THREAD ERROR: ', error);
    });
  }

  sendMessage(threadID, messageContent, recipients, callback = () => {}) {
    // if already sending a message, return
    if (this.state.sendingMessage) {
      return;
    }

    this.setState({
      sendingMessage: true
    });

    const sendMessageConfig = {
            id: threadID,
            message: messageContent,
            recipients: recipients,
            sender_id: this.state.loggedUser.id
          },
          sendMessagePromise = WP_Router.sendMessage(sendMessageConfig);

    // console.log('MESSAGE SETTINGS SCREEN - SEND MESSAGE: ', sendMessageConfig);

    sendMessagePromise.then((response) => {
      // console.log('MESSAGE SETTINGS SCREEN - SEND MESSAGE RESPONSE: ', response);

      const getSentMessagePromise = WP_Router.getMessage(threadID);

      getSentMessagePromise.then((response) => {
        // console.log('MESSAGE SETTINGS SCREEN - GET SENT MESSAGE RESPONSE: ', response);

        callback();

        this.setState((state, props) => {
          const newMessages = state.messages.slice();

          // console.log('MESSAGE SETTINGS SCREEN - NEW MESSAGES TO SHOW: ', newMessages);

          for (const message of newMessages) {
            if (message.id === threadID) {
              message.messages = response.messages;
            }
          }

          return {
            messages: newMessages,
            sendingMessage: false
          };
        });
      }, (error) => {
        // console.log('MESSAGE SETTINGS SCREEN - GET SENT MESSAGE ERROR: ', error);

        this.setState({
          sendingMessage: false
        });
      });

    }, (error) => {
      // console.log('MESSAGE SETTINGS SCREEN - SEND MESSAGE ERROR: ', error);

      this.setState({
        sendingMessage: false
      });
    });
  }

  clearSendMessageUser() {
    this.setState({
      userID: false
    });
  }

  componentDidMount() {
    this.getLoggedInMember(this.getMessagesPage);

    this.popup = plugins.createPopup({
      premadeContentElement: this.messageBoxRef.current,
      type: 'premade',
      popupSelectors: ['message-box-popup', 'animate-slide-down'],
      onOverlayCreate: function (overlay) {
        overlay.setAttribute('data-simplebar', '');
      }
    });
  }

  render() {
    const searching = typeof this.state.filters.search !== 'undefined';

    return (
      <div className="account-hub-content">
        <SectionHeader pretitle={vikinger_translation.my_profile} title={vikinger_translation.messages}>
          <div className="section-header-actions">
            <p className="section-header-action" onClick={this.createNewMessage}>{vikinger_translation.new_message}</p>
          </div>
        </SectionHeader>

        {/* MESSAGE BOX */}
        <MessageBox ref={this.messageBoxRef}
                    data={{title: vikinger_translation.delete, text: vikinger_translation.delete_item_message}}
                    error
                    confirm
                    onAccept={() => {this.deleteThread(); this.popup.hide();}}
                    onCancel={() => {this.popup.hide();}}
        />
        {/* MESSAGE BOX */}

        {
          !this.state.loggedUser && this.state.initialFetch &&
            <Loader />
        }

        {
          this.state.loggedUser &&
            <ChatMessages data={this.state.messages}
                          loggedUser={this.state.loggedUser}
                          userID={this.state.userID}
                          clearSendMessageUser={this.clearSendMessageUser}
                          onFiltersChange={this.updateFiltersRefresh}
                          loading={this.state.loading}
                          onLoadMore={this.getMessagesPage}
                          loadingMore={this.state.loadingMore}
                          moreItems={this.state.moreItems}
                          searching={searching}
                          onSelectMessage={this.selectMessage}
                          selectedMessage={this.state.selectedMessage}
                          creatingNewMessage={this.state.creatingNewMessage}
                          onStarMessage={this.onStarMessage}
                          onUnstarMessage={this.onUnstarMessage}
                          onSendMessage={this.sendMessage}
                          sendingMessage={this.state.sendingMessage}
                          onCreateThread={this.createThread}
                          onDeleteThread={() => {this.popup.show();}}
                          deletingThread={this.state.deletingThread}
                          filters={this.state.filters}
            />
        }
      </div>
    );
  }
}

module.exports = MessagesSettingsScreen;