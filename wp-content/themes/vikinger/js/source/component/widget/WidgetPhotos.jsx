const React = require('react');

const WP_Router = require('../../router/WP_Router')();

const PictureItemList = require('../picture/PictureItemList'),
      LoaderSpinner = require('../loader/LoaderSpinner');

class WidgetPhotos extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      photos: [],
      loggedUser: false,
      user: false,
      group: false,
      reactions: [],
      loading: true
    };

    this.getLoggedInMember = this.getLoggedInMember.bind(this);
  }

  getLoggedInMember() {
    const userScope = this.props.groupID ? 'user-groups' : 'user-status';

    WP_Router.getLoggedInMember(userScope)
    .done((loggedUser) => {
      // console.log('WIDGET PHOTOS - LOGGED USER: ', loggedUser);

      this.setState({
        loggedUser: loggedUser
      });
    });
  }

  getUser() {
    WP_Router.getMembers({include: [this.props.userID]})
    .done((response) => {
      // console.log('WIDGET PHOTOS - USER: ', response[0]);

      this.setState({
        user: response[0]
      });
    });
  }

  getGroup() {
    WP_Router.getGroups({include: [this.props.groupID]})
    .done((response) => {
      // console.log('WIDGET PHOTOS - GROUP: ', response[0]);

      this.setState({
        group: response[0]
      });
    });
  }

  getPhotos() {
    const filters = {
      per_page: 12,
      filter: {
        object: this.props.userID ? 'activity' : 'groups',
        action: 'activity_media'
      }
    };

    if (this.props.userID) {
      filters.filter.primary_id = this.props.userID;
    }

    if (this.props.groupID) {
      filters.filter.primary_id = this.props.groupID;
    }

    WP_Router.getActivities(filters, (response) => {
      // console.log('WIDGET PHOTOS - ACTIVITY DATA: ', response);

      this.setState({
        photos: response.activities,
        loading: false
      });
    });
  }

  getReactions() {
    WP_Router.getReactions()
    .done((response) => {
      // console.log('WIDGET PHOTOS - REACTIONS: ', response);

      this.setState({
        reactions: response
      });
    });
  }

  componentDidMount() {
    this.getLoggedInMember();
    this.getReactions();

    if (this.props.userID) {
      this.getUser();
    }

    if (this.props.groupID) {
      this.getGroup();
    }

    this.getPhotos();
  }

  render() {
    return (
      <div className="widget-box">
        {/* WIDGET BOX TITLE */}
        <p className="widget-box-title">{vikinger_translation.photos}</p>
        {/* WIDGET BOX TITLE */}

        {/* WIDGET BOX CONTENT */}
        <div className="widget-box-content">
        {
          this.state.loading &&
            <LoaderSpinner />
        }
        {
          !this.state.loading && (this.state.photos.length) > 0 &&
            <PictureItemList  data={this.state.photos}
                              loggedUser={this.state.loggedUser}
                              user={this.props.userID ? this.state.user : this.state.group}
                              reactions={this.state.reactions}
                              modifiers='small'
                              displayMax={12}
            />
        }
        {
          !this.state.loading && (this.state.photos.length === 0) &&
            <p className="no-results-text">{vikinger_translation.no_photos_found}</p>
        }
        </div>
        {/* WIDGET BOX CONTENT */}
      </div>
    );
  }
}

module.exports = WidgetPhotos;