const React = require('react');

const WP_Router = require('../../router/WP_Router')();

const HeaderDropdown = require('./HeaderDropdown'),
      NotificationStatus = require('../user-status/NotificationStatus'),
      LoaderSpinnerSmall = require('../loader/LoaderSpinnerSmall');

const SimpleBar = require('simplebar-react');

class HeaderNotificationsDropdown extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      notifications: [],
      unreadNotificationsCount: 0
    };

    this.markNotificationAsRead = this.markNotificationAsRead.bind(this);

    this.simplebarStyles = {overflowX: 'hidden', height: '100%'};
  }

  markNotificationAsRead(i) {
    const notification = this.state.notifications[i];
    // console.log('HEADER NOTIFICATIONS - MARK NOTIFICATION AS READ: ', notification);

    // update notification data to be marked as read
    const markNotificationAsReadPromise = WP_Router.markNotificationAsRead({
      id: notification.id
    });

    markNotificationAsReadPromise.then((response) => {
      // console.log('HEADER NOTIFICATIONS - MARK NOTIFICATIONS AS READ RESPONSE: ', response);
    }, (error) => {
      // console.log('HEADER NOTIFICATIONS - MARK NOTIFICATIONS AS READ ERROR: ', error);
    });

    // mark notification as read in state (optimistic approach)
    this.setState((state, props) => {
      const notifications = state.notifications.slice(),
            notificationItem = state.notifications.slice(i, i + 1)[0];

      notificationItem.is_new = 0;
      notifications[i] = notificationItem;

      // console.log('HEADER NOTIFICATIONS - UPDATED NOTIFICATIONS: ', notifications);

      return {
        notifications: notifications,
        unreadNotificationsCount: state.unreadNotificationsCount - 1
      };
    });
  }

  getUnreadNotificationsCount() {
    const unreadNotificationsCountPromise = WP_Router.getUnreadNotificationsCount();

    unreadNotificationsCountPromise.then((response) => {
      // console.log('HEADER NOFITICATIONS - GET UNREAD NOTIFICATIONS COUNT: ', response);

      this.setState({
        unreadNotificationsCount: Number.parseInt(response, 10)
      });
    }, (error) => {
      // console.log('HEADER NOFITICATIONS - GET UNREAD NOTIFICATIONS COUNT ERROR: ', error);
    });
  }

  getNotifications() {
    const notificationsPromise = WP_Router.getNotifications({per_page: 8});

    notificationsPromise.then((response) => {
      // console.log('HEADER NOTIFICATIONS - NOTIFICATIONS RESPONSE: ', response);

      const notifications = response ? response : [];

      this.setState({
        notifications: notifications
      });
    });
  }

  componentDidMount() {
    this.getNotifications();
    this.getUnreadNotificationsCount();
  }

  render() {
    return (
      <HeaderDropdown icon="notification" unread={this.state.unreadNotificationsCount > 0}>
      {
        this.props.loggedUser &&
          <React.Fragment>
            <div className="dropdown-box-header">
              <p className="dropdown-box-header-title">{vikinger_translation.notifications} <span className="highlighted">{this.state.unreadNotificationsCount}</span></p>
            </div>
        
            <div className="dropdown-box-list">
            <SimpleBar style={this.simplebarStyles}>
            {
              (this.state.notifications.length > 0) &&
                this.state.notifications.map((notification, i) => {
                  return (
                    <div  key={notification.id}
                          className={`dropdown-box-list-item ${notification.is_new ? 'unread' : ''}`}
                          {...(notification.is_new ? {onMouseEnter: () => {this.markNotificationAsRead(i);}} : {})}
                    >
                      <NotificationStatus data={notification} />
                    </div>
                  );
                })
            }

            {
              (this.state.notifications.length === 0) &&
                <p className="no-results-text">{vikinger_translation.no_notifications_received}</p>
            }
            </SimpleBar>
            </div>
        
            <a className="dropdown-box-button secondary" href={this.props.loggedUser.notifications_link}>{vikinger_translation.view_all_notifications}</a>
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

module.exports = HeaderNotificationsDropdown;