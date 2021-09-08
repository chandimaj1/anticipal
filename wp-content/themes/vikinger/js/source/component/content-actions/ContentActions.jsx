const React = require('react');

const ReactionMetaLine = require('../reaction/ReactionMetaLine');

class ContentActions extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const commentsText = this.props.commentCount === 1 ? vikinger_translation.comment : vikinger_translation.comments,
          sharesText = this.props.shareCount === 1 ? vikinger_translation.share : vikinger_translation.shares;

    return (
      <div className="content-actions">
        {/* CONTENT ACTION */}
        <div className="content-action">
        {
          this.props.reactionData.length > 0 &&
            <ReactionMetaLine data={this.props.reactionData} />
        }
        </div>
        {/* CONTENT ACTION */}
    
        {/* CONTENT ACTION */}
        <div className="content-action">
          <div className="meta-line">
          {
            !this.props.link &&
              <p className="meta-line-text">{this.props.commentCount} {commentsText}</p>
          }
          {
            this.props.link &&
              <a className="meta-line-link" href={`${this.props.link}#comment-list`}>{this.props.commentCount} {commentsText}</a>
          }
          </div>

        {
          this.props.shareCount !== false && vikinger_constants.plugin_active.buddypress &&
            <div className="meta-line">
              <p className="meta-line-text">{this.props.shareCount} {sharesText}</p>
            </div>
        }
        </div>
        {/* CONTENT ACTION */}
      </div>
    );
  }
}

module.exports = ContentActions;