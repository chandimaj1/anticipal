const React = require('react');

const plugins = require('../../utils/plugins');

const WP_Router = require('../../router/WP_Router')();

const SectionHeader = require('../section/SectionHeader'),
      MessageBox = require('../message/MessageBox'),
      ScrollPager = require('../pager/ScrollPager'),
      Notification = require('../notification/Notification');

const NotificationBoxList = require('../notification/NotificationBoxList');

class NotificationsSettingsScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loggedUser: false,
      notifications: [],
      selectedNotifications: [],
      selectedAll: false,
      initialFetch: true,
      moreItems: true
    };

    this.currentPage = 1;

    this.messageBoxRef = React.createRef();

    this.getNotificationsPage = this.getNotificationsPage.bind(this);

    this.toggleAllSelectable = this.toggleAllSelectable.bind(this);
    this.toggleSelectableActive = this.toggleSelectableActive.bind(this);

    this.markSelectedAsRead = this.markSelectedAsRead.bind(this);
  }

  getLoggedInMember() {
    WP_Router.getLoggedInMember()
    .done((response) => {
      // console.log('NOTIFICATIONS SETTINGS SCREEN - LOGGED IN USER: ', response);

      this.setState({
        loggedUser: response
      });
    });
  }

  notificationsSelected() {
    return this.state.selectedNotifications.some(selected => selected);
  }

  deleteSelected() {
    const notificationsToDelete = [];

    this.state.selectedNotifications.forEach((selectedNotification, i) => {
      // add notification to be deleted if it is selected
      if (selectedNotification) {
        notificationsToDelete.push(this.state.notifications[i].id);
      }
    });

    // console.log('NOTIFICATIONS SETTINGS SCREEN - DELETE: ', notificationsToDelete);

    const deleteNotificationsPromise = WP_Router.deleteNotifications(notificationsToDelete);

    deleteNotificationsPromise.then((response) => {
      // console.log('NOTIFICATIONS SETTINGS SCREEN - DELETE RESPONSE: ', response);
    }, (error) => {
      // console.log('NOTIFICATIONS SETTINGS SCREEN - DELETE ERROR: ', error);
    });

    // delete notifications (optimistic approach)
    this.setState((state, props) => {
      const notifications = state.notifications.slice(),
            newNotifications = notifications.filter((notification) => {
              return !notificationsToDelete.includes(notification.id);
            });

      // console.log('NOTIFICATIONS SETTINGS SCREEN - UPDATED NOTIFICATIONS: ', newNotifications);

      return {
        notifications: newNotifications,
        selectedNotifications: (new Array(newNotifications.length)).fill(false),
        selectedAll: false
      };
    });
  }

  markSelectedAsRead() {
    const notificationsToMarkAsRead = [];

    this.state.selectedNotifications.forEach((selectedNotification, i) => {
      // add notification to be marked as read if it is selected
      if (selectedNotification) {
        notificationsToMarkAsRead.push(this.state.notifications[i].id);
      }
    });

    // console.log('NOTIFICATIONS SETTINGS SCREEN - MARK AS READ: ', notificationsToMarkAsRead);

    const markNotificationsAsReadPromise = WP_Router.markNotificationsAsRead(notificationsToMarkAsRead);

    markNotificationsAsReadPromise.then((response) => {
      // console.log('NOTIFICATIONS SETTINGS SCREEN - MARK AS READ RESPONSE: ', response);
    }, (error) => {
      // console.log('NOTIFICATIONS SETTINGS SCREEN - MARK AS READ ERROR: ', error);
    });

    // mark notifications as read in state (optimistic approach)
    this.setState((state, props) => {
      const notifications = state.notifications.slice();

      for (const notification of notifications) {
        // if notification was marked as read, update it
        if (notificationsToMarkAsRead.includes(notification.id)) {
          notification.is_new = 0;
        }
      }

      // console.log('NOTIFICATIONS SETTINGS SCREEN - UPDATED NOTIFICATIONS: ', notifications);

      return {
        notifications: notifications
      };
    });
  }

  toggleSelectableActive(i) {
    this.setState((state, props) => {
      const newSelectedNotifications = state.selectedNotifications.slice();
      newSelectedNotifications[i] = !newSelectedNotifications[i];

      // console.log('NOTIFICATIONS SETTINGS SCREEN - SELECTED NOTIFICATIONS: ', newSelectedNotifications);

      return {
        selectedNotifications: newSelectedNotifications
      };
    });
  }

  toggleAllSelectable() {
    if (!this.state.selectedAll) {
      this.selectAll();
    } else {
      this.unselectAll();
    }
  }

  selectAll() {
    this.setState((state, props) => {
      return {
        selectedNotifications: (new Array(state.notifications.length)).fill(true),
        selectedAll: true
      };
    });
  }

  unselectAll() {
    this.setState((state, props) => {
      return {
        selectedNotifications: (new Array(state.notifications.length)).fill(false),
        selectedAll: false
      };
    });
  }

  getNotificationsPage(callback = () => {}) {
    const notificationsPromise = WP_Router.getNotifications({
      user_id: this.state.loggedUser.id,
      per_page: 100,
      page: this.currentPage
    });

    notificationsPromise.then((response) => {
      // console.log('NOTIFICATIONS SETTINGS SCREEN - GET NOTIFICATIONS PAGE ', this.currentPage, ' RESPONSE: ', response);

      this.currentPage++;

      const notifications = response ? response : [],
            newSelectedNotifications = (new Array(notifications.length)).fill(false);

      this.setState((state, props) => {
        return {
          notifications: state.notifications.concat(notifications),
          selectedNotifications: state.selectedNotifications.concat(newSelectedNotifications),
          moreItems: (notifications.length > 0),
          initialFetch: false
        };
      }, () => {
        callback(notifications.length > 0);
      });
    });
  }

  componentDidMount() {
    this.getLoggedInMember();

    this.getNotificationsPage();

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
    return (
      <div className="account-hub-content">
        <SectionHeader  pretitle={vikinger_translation.my_profile} title={vikinger_translation.notifications}>
        {
          (this.state.notifications.length > 0) &&
            <div className="section-header-actions">
            {
              this.notificationsSelected() &&
                <React.Fragment>
                  <p className="section-header-action" onClick={() => {this.popup.show();}}>{vikinger_translation.delete}</p>
                  <p className="section-header-action" onClick={this.markSelectedAsRead}>{vikinger_translation.mark_as_read}</p>
                </React.Fragment>
            }
              <p className="section-header-action" onClick={this.toggleAllSelectable}>{!this.state.selectedAll ? vikinger_translation.select_all : vikinger_translation.unselect_all}</p>
            </div>
        }
        </SectionHeader>

        {/* MESSAGE BOX */}
        <MessageBox ref={this.messageBoxRef}
                    data={{title: vikinger_translation.delete, text: vikinger_translation.delete_selected_message}}
                    error
                    confirm
                    onAccept={() => {this.deleteSelected(); this.popup.hide();}}
                    onCancel={() => {this.popup.hide();}}
        />
        {/* MESSAGE BOX */}

        {
          this.state.loggedUser &&
            <ScrollPager loadMoreItems={this.getNotificationsPage} moreItems={this.state.moreItems} initialFetch={this.state.initialFetch}>
              <React.Fragment>
                {
                  (this.state.notifications.length === 0) && !this.state.moreItems &&
                    <Notification title={vikinger_translation.notifications_received_no_results_title}
                                  text={vikinger_translation.notifications_received_no_results_text}
                    />
                }

                <NotificationBoxList  data={this.state.notifications}
                                      selectable={true}
                                      selectedItems={this.state.selectedNotifications}
                                      toggleSelectableActive={this.toggleSelectableActive}
                />
              </React.Fragment>
            </ScrollPager>
        }
      </div>
    );
  }
}

module.exports = NotificationsSettingsScreen;