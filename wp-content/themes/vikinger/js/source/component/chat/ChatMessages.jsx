const React = require('react');

const ChatMessageList = require('./ChatMessageList'),
      ChatMessageOpen = require('./ChatMessageOpen'),
      ChatMessageNew = require('./ChatMessageNew');

class ChatMessages extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="chat-widget-wrap">
        <ChatMessageList  data={this.props.data}
                          loggedUser={this.props.loggedUser}
                          onSelectMessage={this.props.onSelectMessage}
                          selectedMessage={this.props.selectedMessage}
                          onFiltersChange={this.props.onFiltersChange}
                          loading={this.props.loading}
                          moreItems={this.props.moreItems}
                          onLoadMore={this.props.onLoadMore}
                          loadingMore={this.props.loadingMore}
                          searching={this.props.searching}
                          filters={this.props.filters}
        />

        {
          !this.props.creatingNewMessage && this.props.selectedMessage &&
            <ChatMessageOpen  data={this.props.selectedMessage}
                              loggedUser={this.props.loggedUser}
                              onSendMessage={this.props.onSendMessage}
                              onStarMessage={this.props.onStarMessage}
                              onUnstarMessage={this.props.onUnstarMessage}
                              onDeleteThread={this.props.onDeleteThread}
                              deletingThread={this.props.deletingThread}
                              sendingMessage={this.props.sendingMessage}
            />
        }

        {
          this.props.creatingNewMessage &&
            <ChatMessageNew loggedUser={this.props.loggedUser}
                            userID={this.props.userID}
                            clearSendMessageUser={this.props.clearSendMessageUser}
                            onCreateThread={this.props.onCreateThread}
            />
        }
      </div>
    );
  }
}

module.exports = ChatMessages;