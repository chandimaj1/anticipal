const React = require('react');

const app = require('../../utils/core'),
      plugins = require('../../utils/plugins');

const TagList = require('../tag/TagList'),
      ContentActions = require('../content-actions/ContentActions'),
      IconSVG = require('../icon/IconSVG');

class PostIframePreviewBig extends React.Component {
  constructor(props) {
    super(props);

    this.iframePopupRef = React.createRef();

    this.titleWordLimit = 70;
    this.excerptWordLimit = 400;

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
      <div className="post-preview medium post-preview-normal post-preview-type-iframe animate-slide-down">
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
        <div className="post-preview-info fixed-height">
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
            <p className="post-preview-title medium"><a href={this.props.data.permalink}>{app.truncateText(this.props.data.title, this.titleWordLimit)}</a></p>
          </div>
          <div className="post-preview-info-bottom">
            <p className="post-preview-text" dangerouslySetInnerHTML={{__html: app.truncateText(this.props.data.excerpt, this.excerptWordLimit)}}></p>
            <a className="post-preview-link" href={this.props.data.permalink}>{vikinger_translation.read_more}</a>
          </div>
        </div>
        {/* POST PREVIEW INFO */}

        {/* TAG LIST */}
        <TagList tags={this.props.data.tags} />
        {/* TAG LIST */}

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

module.exports = PostIframePreviewBig;