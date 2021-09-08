const React = require('react');

const app = require('../../utils/core'),
      plugins = require('../../utils/plugins');

const ContentActions = require('../content-actions/ContentActions'),
      IconSVG = require('../icon/IconSVG');

class PostPreviewSmall extends React.Component {
  constructor(props) {
    super(props);

    this.iframePopupRef = React.createRef();

    this.titleWordLimit = 75;

    this.coverStyle = props.data.cover_url ? {background: `url(${props.data.cover_url}) center center / cover no-repeat`} : {};

    this.categories = props.data.categories.slice(0, 3);
  }

  componentDidMount() {
    plugins.createPopup({
      triggerElement: this.iframePopupRef.current,
      type: 'iframe'
    });
  }

  render() {
    return (
      <div className="post-preview small post-preview-type-iframe animate-slide-down">
        {/* POST PREVIEW IMAGE */}
        <a ref={this.iframePopupRef} data-iframe-url={this.props.data.format === 'video' ? this.props.data.video_url : this.props.data.audio_url}>
          <div className="post-preview-image" style={this.coverStyle}>
          {
            this.props.data.format === 'video' &&
            <div className="post-preview-image-action play-button medium">
              <IconSVG  icon="play"
                        modifiers="play-button-icon medium"
              />
            </div>
          }
          {
            this.props.data.format === 'audio' &&
            <div className="post-preview-image-action play-button medium centered">
              <IconSVG  icon="speaker"
                        modifiers="play-button-icon"
              />
            </div>
          }
          </div>
        </a>
        {/* POST PREVIEW IMAGE */}

        {/* POST PREVIEW INFO */}
        <div className="post-preview-info">
          <div className="post-preview-info-top">
            <p className="post-preview-timestamp">
              {
                this.categories.map((category) => {
                  return (
                    <span key={category.id}><a href={category.link}>{category.name}</a> - </span>
                  );
                })
              }
              {this.props.data.timestamp}
            </p>
            <p className="post-preview-title"><a href={this.props.data.permalink}>{app.truncateText(this.props.data.title, this.titleWordLimit)}</a></p>
          </div>
        </div>
        {/* POST PREVIEW INFO */}

        {/* CONTENT ACTIONS */}
        <ContentActions reactionData={this.props.data.reactions}
                        link={this.props.data.permalink}
                        commentCount={this.props.data.comment_count}
                        shareCount={this.props.data.share_count}
        />
        {/* CONTENT ACTIONS */}
      </div>
    );
  }
}

module.exports = PostPreviewSmall;