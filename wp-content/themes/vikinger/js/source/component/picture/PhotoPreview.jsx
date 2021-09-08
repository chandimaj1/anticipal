const React = require('react');

const Checkbox = require('../form/Checkbox'),
      ActivityMediaPopup = require('../activity/ActivityMediaPopup'),
      IconSVG = require('../icon/IconSVG');

class PhotoPreview extends React.Component {
  constructor(props) {
    super(props);

    this.activityMediaPopupTriggerRef = React.createRef();
  }

  render() {
    return (
      <div className="photo-preview-wrap">
        <div className={`photo-preview ${this.props.modifiers || ''}`}>
          <div className="photo-preview-image" style={{background: `url('${this.props.data.media.link}') center center / cover no-repeat`}}></div>

          {
            this.props.selectable &&
              <Checkbox active={this.props.selected} toggleActive={this.props.toggleSelectableActive} />
          }
      
          {/* PHOTO PREVIEW INFO */}
          <div ref={this.activityMediaPopupTriggerRef} className="photo-preview-info">
            {/* REACTION COUNT LIST */}
            <div className="reaction-count-list">
            {
              vikinger_constants.plugin_active.vkreact && vikinger_constants.plugin_active['vkreact-buddypress'] &&
                <div className="reaction-count negative">
                  <IconSVG  icon="thumbs-up"
                            modifiers="reaction-count-icon"
                  />
        
                  <p className="reaction-count-text">{this.props.data.reactions.length}</p>
                </div>
            }

              <div className="reaction-count negative">
                <IconSVG  icon="comment"
                          modifiers="reaction-count-icon"
                />
      
                <p className="reaction-count-text">{this.props.data.comment_count}</p>
              </div>
            </div>
            {/* REACTION COUNT LIST */}
          </div>
          {/* PHOTO PREVIEW INFO */}
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

module.exports = PhotoPreview;