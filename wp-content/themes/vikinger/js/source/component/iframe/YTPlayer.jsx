const React = require('react');

const app = require('../../utils/core');

class YTPlayer extends React.Component {
  constructor(props) {
    super(props);

    this.src = `${app.getMediaLink('youtube', props.videoID)}?enablejsapi=1`;

    this.iframeRef = React.createRef();

    this.loadPlayer = this.loadPlayer.bind(this);
    this.onPlayerStateChange = this.onPlayerStateChange.bind(this);
  }

  onPlayerStateChange(e, callback = () => {}) {
    const playing = e.data === window.YT.PlayerState.PLAYING;

    // console.log('YTPLAYER - ON PLAYER STATE CHANGE STATUS: ', e.data);

    // notify parent that this player started playing
    if (playing) {
      callback();
    }
  }

  loadPlayer(onPlayerStateChange) {
    // console.log('YTPLAYER - LOAD PLAYER: ', this.iframeRef.current);

    this.player = new window.YT.Player(this.iframeRef.current, {
      events: {
        onStateChange: onPlayerStateChange
      }
    });
  }

  componentDidMount() {
    // console.log('YTPLAYER - MOUNTING VIDEO: ', this.iframeRef.current);

    // load YT Iframe player API if it isn't loaded
    if (!window.YT && !document.querySelector('#ytIframePlayerScript')) {
      const ytIframePlayerScript = document.createElement('script');

      ytIframePlayerScript.id = 'ytIframePlayerScript';
      ytIframePlayerScript.src = 'https://www.youtube.com/iframe_api';

      document.body.appendChild(ytIframePlayerScript);
    }

    if (!window.onYouTubeIframeAPIReady) {
      window.onYouTubeIframeAPIReady = () => {
        for (const callback of window.onYouTubeIframeAPIReady.callbacks) {
          callback();
        }
      };

      window.onYouTubeIframeAPIReady.callbacks = [() => {this.loadPlayer((e) => {this.onPlayerStateChange(e, this.props.onPlay);})}];
    // } else {
    //   window.onYouTubeIframeAPIReady.callbacks.push(() => {this.loadPlayer((e) => {this.onPlayerStateChange(e, this.props.onPlay);})});
    // }
    } else if (!window.YT) {
      window.onYouTubeIframeAPIReady.callbacks.push(() => {this.loadPlayer((e) => {this.onPlayerStateChange(e, this.props.onPlay);})});
    } else {
      this.loadPlayer((e) => {this.onPlayerStateChange(e, this.props.onPlay)});
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.stop !== prevProps.stop) {
      // console.log('YTPLAYER - COMPONENT DID UPDATE PLAYER: ', this.player);
      // console.log('YTPLAYER - COMPONENT DID UPDATE PLAYER PAUSE VIDEO: ', this.player.pauseVideo);
      // console.log('YTPLAYER - COMPONENT DID UPDATE IFRAME: ', this.iframeRef.current);
      // hidden / popup iframes aren't loaded and won't have a player yet
      this.player.pauseVideo && this.player.pauseVideo();
    }
  }

  render() {
    return (
      <iframe ref={this.iframeRef} src={this.src} allowFullScreen></iframe>
    );
  }
}

module.exports = YTPlayer;