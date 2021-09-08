const React = require('react');

const HeaderDropdown = require('./HeaderDropdown'),
      FriendStatus = require('../user-status/FriendStatus'),
      LoaderSpinnerSmall = require('../loader/LoaderSpinnerSmall');

class HeaderFriendRequestsDropdown extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentTabItem: 'received'
    };

    this.setTabItem = this.setTabItem.bind(this);
  }

  setTabItem(item) {
    this.setState({
      currentTabItem: item
    });
  }

  render() {
    const newFriendRequestsReceived = this.props.loggedUser && (this.props.loggedUser.friend_requests_received.length > 0),
          newFriendRequestsSent = this.props.loggedUser && (this.props.loggedUser.friend_requests_sent.length > 0);

    let sentFriendRequestsCount = 0,
        receivedFriendRequestsCount = 0;

    if (this.props.loggedUser) {
      sentFriendRequestsCount = this.props.loggedUser.friend_requests_sent.length;
      receivedFriendRequestsCount = this.props.loggedUser.friend_requests_received.length;
    }

    const maxResults = 5,
          sentFriendRequestsShowCount = Math.min(maxResults, sentFriendRequestsCount),
          receivedFriendRequestsShowCount = Math.min(maxResults, receivedFriendRequestsCount),
          sentFriendRequestsToShow = this.props.loggedUser ? this.props.loggedUser.friend_requests_sent.slice(0, sentFriendRequestsShowCount) : [],
          receivedFriendRequestsToShow = this.props.loggedUser ? this.props.loggedUser.friend_requests_received.slice(0, receivedFriendRequestsShowCount) : [];

    return (
      <HeaderDropdown icon="friend" unread={newFriendRequestsReceived || newFriendRequestsSent}>
      {
        this.props.loggedUser &&
          <React.Fragment>
            {/* DROPDOWN BOX HEADER */}
            <div className="dropdown-box-header">
              <p className="dropdown-box-header-title">{vikinger_translation.friend_requests}</p>
        
              <div className="dropdown-box-header-actions">
                <p className={`dropdown-box-header-action dropdown-box-header-action-tab ${this.state.currentTabItem === 'received' ? 'active' : ''}`} onClick={() => {this.setTabItem('received');}}>{vikinger_translation.received} ({receivedFriendRequestsCount})</p>
                <p className={`dropdown-box-header-action dropdown-box-header-action-tab ${this.state.currentTabItem === 'sent' ? 'active' : ''}`} onClick={() => {this.setTabItem('sent');}}>{vikinger_translation.sent} ({sentFriendRequestsCount})</p>
              </div>
            </div>
            {/* DROPDOWN BOX HEADER */}
        
            {
              this.state.currentTabItem === 'received' &&
                <div className="dropdown-box-list no-hover">
                {
                  newFriendRequestsReceived &&
                    receivedFriendRequestsToShow.map((request) => {
                      return (
                        <div key={request.id} className="dropdown-box-list-item">
                          <FriendStatus data={request.user}
                                        loggedUser={this.props.loggedUser}
                                        onActionComplete={this.props.onActionComplete}
                                        modifiers="request"
                                        allowReject={true}
                          />
                        </div>
                      );
                    })
                }
        
                {
                  !newFriendRequestsReceived &&
                    <p className="no-results-text">{vikinger_translation.no_friend_requests_received}</p>
                }
                </div>
            }

            {
              this.state.currentTabItem === 'sent' &&
                <div className="dropdown-box-list no-hover">
                {
                  newFriendRequestsSent &&
                    sentFriendRequestsToShow.map((request) => {
                      return (
                        <div key={request.id} className="dropdown-box-list-item">
                          <FriendStatus data={request.user}
                                        loggedUser={this.props.loggedUser}
                                        onActionComplete={this.props.onActionComplete}
                                        modifiers="request"
                                        allowReject={true}
                          />
                        </div>
                      );
                    })
                }
                
                {
                  !newFriendRequestsSent &&
                    <p className="no-results-text">{vikinger_translation.no_friend_requests_sent}</p>
                }
                </div>
            }
        
            <a className="dropdown-box-button secondary" href={this.props.loggedUser.friend_requests_link}>{vikinger_translation.view_all_friend_requests}</a>
          </React.Fragment>
      }
      {
        !this.props.loggedUser &&
          <LoaderSpinnerSmall />
      } 
      </HeaderDropdown>
    );
  }
}

module.exports = HeaderFriendRequestsDropdown;