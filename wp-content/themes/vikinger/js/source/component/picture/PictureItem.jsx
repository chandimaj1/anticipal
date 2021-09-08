const React = require('react');

const ActivityMediaPopup = require('../activity/ActivityMediaPopup');

class PictureItem extends React.Component {
  constructor(props) {
    super(props);

    this.activityMediaPopupTriggerRef = React.createRef();
  }

  render() {
    return (
      <div className="picture-item-wrap">
        <div ref={this.activityMediaPopupTriggerRef} className="picture-item">
          <div className="picture round" style={{background: `url('${this.props.data.media.link}') center center / cover no-repeat`}}></div>
          {
            this.props.moreItems &&
              <a className="picture-item-overlay round" href={this.props.user.media_link}>
                <p className="picture-item-overlay-text">+</p>
              </a>
          }
        </div>
        {
          !(this.props.noPopup) &&
            <div>
              <ActivityMediaPopup data={this.props.data}
                                  user={this.props.loggedUser}
                                  reactions={this.props.reactions}
                                  activityMediaPopupTriggerRef={this.activityMediaPopupTriggerRef}
              />
            </div>
        }
      </div>
    );
  }
}

module.exports = PictureItem;