const React = require('react');

const MessageStatus = require('../user-status/MessageStatus'),
      LoaderSpinner = require('../loader/LoaderSpinner'),
      LoaderSpinnerSmall = require('../loader/LoaderSpinnerSmall'),
      FormInputInteractive = require('../form/FormInputInteractive');

const SimpleBar = require('simplebar-react');

class ChatMessageList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchText: ''
    };

    this.onBoxChange = this.onBoxChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.onSearchInputUpdate = this.onSearchInputUpdate.bind(this);
    this.onSearchInputReset = this.onSearchInputReset.bind(this);

    this.simplebarStyles = {overflowX: 'hidden', height: '100%'};
  }

  onBoxChange(box) {
    this.updateFilters({
      box: box
    });
  }

  onSearchInputUpdate(data) {
    // console.log('CHAT MESSAGE LIST - UPDATE SEARCH INPUT: ', data);

    this.setState({
      searchText: data
    });
  }

  onSearchInputReset(data) {
    // console.log('CHAT MESSAGE LIST - RESET SEARCH INPUT: ', data);
    
    this.updateFilters({
      search: data
    });
  }

  onSearchSubmit(e) {
    e.preventDefault();

    // console.log('CHAT MESSAGE LIST - SEARCH SUBMIT: ', this.state.searchText);

    this.updateFilters({
      search: this.state.searchText
    });
  }

  updateFilters(filters) {
    this.props.onFiltersChange(filters);
  }

  render() {
    return (
      <div className="chat-widget static">
        {/* CHAT WIDGET FILTERS */}
        <div className="chat-widget-filters">
          <p  className={`chat-widget-filter ${this.props.filters.box === 'inbox' ? 'active' : ''}`}
              onClick={() => {this.onBoxChange('inbox');}}
          >
            {vikinger_translation.inbox}
          </p>
          <p  className={`chat-widget-filter ${this.props.filters.box === 'sentbox' ? 'active' : ''}`}
              onClick={() => {this.onBoxChange('sentbox');}}
          >
            {vikinger_translation.sentbox}
          </p>
          <p  className={`chat-widget-filter ${this.props.filters.box === 'starred' ? 'active' : ''}`}
              onClick={() => {this.onBoxChange('starred');}}
          >
            {vikinger_translation.starred}
          </p>
        </div>
        {/* CHAT WIDGET FILTERS */}

        {/* CHAT WIDGET MESSAGES */}
        <div className="chat-widget-messages">
        {
          this.props.loading &&
            <LoaderSpinner />
        }
        {
          (this.props.data.length > 0) && !this.props.loading &&
            <SimpleBar style={this.simplebarStyles}>
            {
              this.props.data.map((message) => {
                return (
                  <div  className={
                          `chat-widget-message
                          ${this.props.selectedMessage === message ? 'active' : ''}
                          ${message.unread_count > 0 ? 'unread' : ''}`
                        }
                        key={message.id}
                        onClick={() => {this.props.onSelectMessage(message);}}
                  >
                    <MessageStatus  data={message}
                                    ownLastMessage={message.user.id === this.props.loggedUser.id}
                                    favorite={message.starred}
                    />
                  </div>
                );
              })
            }
            {
              this.props.moreItems &&
                <div className="load-more-text" onClick={this.props.onLoadMore}>
                {
                  !this.props.loadingMore &&
                    vikinger_translation.load_more_messages
                }
                {
                  this.props.loadingMore &&
                    <LoaderSpinnerSmall />
                }
                </div>
            }
            </SimpleBar>
        }
        {
          (this.props.data.length === 0) && !this.props.loading &&
            <p className="no-results-text">
              {
                this.props.searching &&
                  vikinger_translation.message_search_no_results
              }
              {
                !this.props.searching &&
                  vikinger_translation.no_messages_found
              }
            </p>
        }
        </div>
        {/* CHAT WIDGET MESSAGES */}
    
        {/* CHAT WIDGET FORM */}
        <form className="chat-widget-form" onSubmit={this.onSearchSubmit}>
          <FormInputInteractive name="searchText"
                                value={this.state.searchText}
                                placeholder={vikinger_translation.search_messages}
                                modifiers="small"
                                onChange={this.onSearchInputUpdate}
                                onReset={this.onSearchInputReset}
          />
        </form>
        {/* CHAT WIDGET FORM */}
      </div>
    );
  }
}

module.exports = ChatMessageList;