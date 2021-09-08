const React = require('react');

const plugins = require('../../utils/plugins');

const ActivityForm = require('../activity/ActivityForm'),
      IconSVG = require('../icon/IconSVG');

class PostShareOption extends React.Component {
  constructor(props) {
    super(props);

    this.shareBoxRef = React.createRef();
    this.shareBoxTriggerRef = React.createRef();
  }

  componentDidMount() {
    this.popup = plugins.createPopup({
      triggerElement: this.shareBoxTriggerRef.current,
      premadeContentElement: this.shareBoxRef.current,
      type: 'premade',
      popupSelectors: ['share-box-popup', 'animate-slide-down'],
      onOverlayCreate: function (overlay) {
        overlay.setAttribute('data-simplebar', '');
      }
    });

    if ((this.props.postType === 'activity') && vikinger_constants.settings.newsfeed_yt_playback_limit === 'yes') {
      // console.log('BINDING SHARE PLAYBACK LIMIT');
      this.shareBoxTriggerRef.current.addEventListener('mousedown', this.props.onPlay);
    }
  }

  componentWillUnmount() {
    if ((this.props.postType === 'activity') && vikinger_constants.settings.newsfeed_yt_playback_limit === 'yes') {
      // console.log('UNBINDING SHARE PLAYBACK LIMIT');
      this.shareBoxTriggerRef.current.removeEventListener('mousedown', this.props.onPlay);
    }
  }

  render() {
    return (
      <div className="post-option-wrap">
        <div ref={this.shareBoxTriggerRef} className="post-option">
          <IconSVG  icon="share"
                    modifiers="post-option-icon"
          />
  
          <p className="post-option-text">{vikinger_translation.share_action}</p>
        </div>

        <ActivityForm ref={this.shareBoxRef}
                      user={this.props.user}
                      onSubmit={this.props.onShare}
                      shareData={this.props.shareData}
                      popup={this.popup}
        />
      </div>
    );
  }
}

module.exports = PostShareOption;