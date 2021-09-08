const React = require('react');

const Checkbox = require('../form/Checkbox'),
      ActivityMediaPopup = require('../activity/ActivityMediaPopup'),
      IconSVG = require('../icon/IconSVG');

class VideoItem extends React.Component {
  constructor(props) {
    super(props);

    this.activityMediaPopupTriggerRef = React.createRef();
  }

  render() {
    return (
      <div className="video-box-wrap">
        <div className={`video-box ${this.props.modifiers || ''}`}>
          {
            this.props.selectable &&
              <Checkbox active={this.props.selected} toggleActive={this.props.toggleSelectableActive} />
          }

          {/* VIDEO BOX COVER */}
          <div ref={this.activityMediaPopupTriggerRef} className="video-box-cover">
            <div className="video-wrap">
              <video src={this.props.data.media.link}></video>
            </div>

            <div className="play-button">
              <IconSVG  icon="play"
                        modifiers="play-button-icon"
              />
            </div>
          </div>
          {/* VIDEO BOX COVER */}
        </div>

        {
          !(this.props.noPopup) &&
            <div>
              <ActivityMediaPopup data={this.props.data}
                                  user={this.props.user}
                                  reactions={this.props.reactions}
                                  activityMediaPopupTriggerRef={this.activityMediaPopupTriggerRef}
              />
            </div>
        }
      </div>
    );
  }
}

module.exports = VideoItem;