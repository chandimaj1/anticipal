const React = require('react');

const WP_Router = require('../../router/WP_Router')();

const HeaderDropdown = require('./HeaderDropdown'),
      MessageStatus = require('../user-status/MessageStatus'),
      LoaderSpinnerSmall = require('../loader/LoaderSpinnerSmall');

const SimpleBar = require('simplebar-react');

class HeaderMessagesDropdown extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: [],
      loading: true
    };

    this.simplebarStyles = {overflowX: 'hidden', height: '100%'};
  }

  componentDidMount() {
    if (this.props.loggedUser) {
      const getMessagesPromise = WP_Router.getMessages({
        user_id: this.props.loggedUser.id,
        box: 'inbox',
        per_page: 8
      });
  
      getMessagesPromise.then((response) => {
        // console.log('HEADER MESSAGES - MESSAGES RESPONSE: ', response);
  
        this.setState({
          messages: response.data,
          loading: false
        });
      }, (error) => {
        // console.log('HEADER MESSAGES - MESSAGES ERROR: ', error);
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.loggedUser !== this.props.loggedUser) {
      const getMessagesPromise = WP_Router.getMessages({
        user_id: this.props.loggedUser.id,
        box: 'inbox',
        per_page: 8
      });
  
      getMessagesPromise.then((response) => {
        // console.log('HEADER MESSAGES - MESSAGES RESPONSE: ', response);
  
        this.setState({
          messages: response.data,
          loading: false
        });
      }, (error) => {
        // console.log('HEADER MESSAGES - MESSAGES ERROR: ', error);
      });
    }
  }

  render() {
    let unreadMessagesCount = 0;

    for (const thread of this.state.messages) {
      if (thread.unread_count > 0) {
        unreadMessagesCount++;
      }
    }

    return (
      <HeaderDropdown icon="messages" unread={unreadMessagesCount > 0}>
      {
        this.props.loggedUser && !this.state.loading &&
          <React.Fragment>
            <div className="dropdown-box-header">
              <p className="dropdown-box-header-title">{vikinger_translation.inbox} <span className="highlighted">{unreadMessagesCount}</span></p>
            </div>
        
            <div className="dropdown-box-list">
            <SimpleBar style={this.simplebarStyles}>
            {
              (this.state.messages.length > 0) &&
                this.state.messages.map((message) => {
                  return (
                    <a  key={message.id}
                        className={`dropdown-box-list-item ${message.unread_count > 0 ? 'unread' : ''}`}
                        href={`${this.props.loggedUser.messages_link}?message_id=${message.id}`}
                    >
                      <MessageStatus  data={message}
                                      ownLastMessage={message.user.id === this.props.loggedUser.id}
                                      favorite={message.starred}
                      />
                    </a>
                  );
                })
            }

            {
              (this.state.messages.length === 0) &&
                <p className="no-results-text">{vikinger_translation.no_messages_received}</p>
            }
            </SimpleBar>
            </div>
        
            <a className="dropdown-box-button primary" href={this.props.loggedUser.messages_link}>{vikinger_translation.view_all_messages}</a>
          </React.Fragment>
      }
      {
        (!this.props.loggedUser || (this.props.loggedUser && this.state.loading)) &&
          <LoaderSpinnerSmall />
      }
      </HeaderDropdown>
    );
  }
}

module.exports = HeaderMessagesDropdown;