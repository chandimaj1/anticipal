const React = require('react');

const plugins = require('../../utils/plugins');

const LoaderSpinnerSmall = require('../loader/LoaderSpinnerSmall'),
      MessageBox = require('../message/MessageBox'),
      IconSVG = require('../icon/IconSVG');

class ActivitySettings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      processingFavorite: false,
      processingPinned: false,
      processingDelete: false
    };

    this.settingsDropdownTriggerRef = React.createRef();
    this.settingsDropdownContentRef = React.createRef();

    this.messageBoxRef = React.createRef();
    this.messageBoxTriggerRef = React.createRef();

    this.pinActivity = this.pinActivity.bind(this);
    this.unpinActivity = this.unpinActivity.bind(this);
    this.deleteActivity = this.deleteActivity.bind(this);
    this.addFavorite = this.addFavorite.bind(this);
    this.removeFavorite = this.removeFavorite.bind(this);
  }

  deleteActivity() {
    this.setState({
      processingDelete: true
    });

    this.props.deleteActivity(() => {
      this.setState({
        processingDelete: false
      });
    });
  }

  pinActivity() {
    this.setState({
      processingPinned: true
    });

    this.props.pinActivity(() => {
      this.setState({
        processingPinned: false
      });
    });
  }

  unpinActivity() {
    this.setState({
      processingPinned: true
    });

    this.props.unpinActivity(() => {
      this.setState({
        processingPinned: false
      });
    });
  }

  addFavorite() {
    this.setState({
      processingFavorite: true
    });

    this.props.addFavorite(() => {
      this.setState({
        processingFavorite: false
      });
    });
  }

  removeFavorite() {
    this.setState({
      processingFavorite: true
    });

    this.props.removeFavorite(() => {
      this.setState({
        processingFavorite: false
      });
    });
  }

  componentDidMount() {
    plugins.createDropdown({
      triggerElement: this.settingsDropdownTriggerRef.current,
      containerElement: this.settingsDropdownContentRef.current,
      offset: {
        top: 30,
        right: 9
      },
      animation: {
        type: 'translate-top',
        speed: .3,
        translateOffset: {
          vertical: 20
        }
      }
    });

    if (this.props.userCanDeleteActivity) {
      this.popup = plugins.createPopup({
        triggerElement: this.messageBoxTriggerRef.current,
        premadeContentElement: this.messageBoxRef.current,
        type: 'premade',
        popupSelectors: ['message-box-popup', 'animate-slide-down'],
        onOverlayCreate: function (overlay) {
          overlay.setAttribute('data-simplebar', '');
        }
      });
    }
  }

  render() {
    return (
      <div className="widget-box-settings">
        <div className="post-settings-wrap">
          <div ref={this.settingsDropdownTriggerRef} className="post-settings">
            <IconSVG  icon="more-dots"
                      modifiers="post-settings-icon"
            />
          </div>
  
          <div ref={this.settingsDropdownContentRef} className="simple-dropdown">
            {
              !this.props.favorite &&
                <div className="simple-dropdown-link" onClick={this.addFavorite}>{vikinger_translation.add_favorite} {this.state.processingFavorite && <LoaderSpinnerSmall />}</div> 
            }
            {
              this.props.favorite &&
                <div className="simple-dropdown-link" onClick={this.removeFavorite}>{vikinger_translation.remove_favorite} {this.state.processingFavorite && <LoaderSpinnerSmall />}</div>
            }
            {
              this.props.userCanPinActivity && !this.props.pinned &&
                <div className="simple-dropdown-link" onClick={this.pinActivity}>{vikinger_translation.pin_to_top} {this.state.processingPinned && <LoaderSpinnerSmall />}</div> 
            }
            {
              this.props.userCanPinActivity && this.props.pinned &&
                <div className="simple-dropdown-link" onClick={this.unpinActivity}>{vikinger_translation.unpin_from_top} {this.state.processingPinned && <LoaderSpinnerSmall />}</div>
            }
            {
              this.props.userCanDeleteActivity &&
                <React.Fragment>
                  <div ref={this.messageBoxTriggerRef} className="simple-dropdown-link">{vikinger_translation.delete_post} {this.state.processingDelete && <LoaderSpinnerSmall />}</div>

                  <MessageBox ref={this.messageBoxRef}
                              data={{title: vikinger_translation.delete_activity_message_title, text: vikinger_translation.delete_activity_message_text}}
                              error
                              confirm
                              onAccept={() => {this.popup.hide(); this.deleteActivity();}}
                              onCancel={() => {this.popup.hide();}}
                  />
                </React.Fragment>
            }
          </div>
        </div>
      </div>
    );
  }
}

module.exports = ActivitySettings;