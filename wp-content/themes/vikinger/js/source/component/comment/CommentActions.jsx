const React = require('react');

const ReactionMetaLineSmall = require('../reaction/ReactionMetaLineSmall'),
      CommentReactionOption = require('./CommentReactionOption'),
      CommentSettings = require('./CommentSettings');

class CommentActions extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="content-actions">
        <div className="content-action">
        {
          this.props.reactionData.length > 0 &&
            <ReactionMetaLineSmall data={this.props.reactionData} loggedUser={this.props.user} />
        }
        
        {
          this.props.user &&
          ((this.props.postType === 'post' && vikinger_constants.plugin_active.vkreact) ||
          (this.props.postType === 'activity' && vikinger_constants.plugin_active.vkreact && vikinger_constants.plugin_active['vkreact-buddypress'])) &&
            <CommentReactionOption  reactions={this.props.reactions}
                                    userReaction={this.props.userReaction}
                                    createUserReaction={this.props.createUserReaction}
                                    deleteUserReaction={this.props.deleteUserReaction}
            />
        }
          
        {
          this.props.allowReply &&
          <React.Fragment>
          {
            !this.props.data.showReplyForm &&
              <div className="meta-line">
                <p className="meta-line-link light" onClick={this.props.onReplyButtonClick}>{vikinger_translation.reply_action}</p>
              </div>
          }
          {
            this.props.data.showReplyForm &&
              <div className="meta-line">
                <p className="meta-line-link light" onClick={this.props.onCancelReplyButtonClick}>{vikinger_translation.cancel_action}</p>
              </div>
          }
          </React.Fragment>
        }

        {
          this.props.user && (this.props.user.id === this.props.data.author.id) &&
            <div className="meta-line settings">
          
                <CommentSettings  data={this.props.data}
                                  deleteComment={this.props.deleteComment}
                />
            </div>
        }

          <div className="meta-line">
            <p className="meta-line-timestamp">{this.props.data.timestamp}</p>
          </div>
        </div>
      </div>
    );
  }
}

module.exports = CommentActions;