const React = require('react');

const Comment = require('./Comment'),
      Reactionable = require('../reaction/Reactionable');

class CommentList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      deleting: false
    };

    this.onReplyButtonClick = this.onReplyButtonClick.bind(this);

    this.deleteComment = this.deleteComment.bind(this);
  }

  deleteComment(config) {
    this.setState({
      deleting: config.comment_id
    });

    this.props.deleteComment(config, (response) => {
      if (!response) {
        this.setState({
          deleting: false
        });
      }
    });
  }

  onReplyButtonClick(commentID) {
    this.props.getChildrenComments(commentID);
    this.props.onReplyButtonClick(commentID);
  }

  render() {
    let depth = this.props.depth || 1;
    
    const replyText = depth === 2 && this.props.childrenComments > 1 ? vikinger_translation.replies : vikinger_translation.reply,
          commentsLeft = this.props.commentCount - this.props.comments.length,
          hasMoreComments = commentsLeft > 0,
          comments = [];

    for (const comment of this.props.comments) {
      comments.push(
        <div className={`post-comment-list ${this.state.deleting === comment.id ? 'post-comment-list-deleted' : ''}`} key={comment.id}>
        <Reactionable entityData={this.props.entityData(comment.id)}
                      user={this.props.user}
                      reactions={this.props.reactions}
                      reactionData={comment.reactions}
                      createUserReaction={this.props.createUserReaction}
                      deleteUserReaction={this.props.deleteUserReaction}
          >
          {
            (reactionData, userReaction, createUserReaction, deleteUserReaction) => {
              return (
                <Comment  data={comment}
                          user={this.props.user}
                          allowGuest={this.props.allowGuest}
                          onReplyButtonClick={() => {depth === 1 && comment.hasChildren ? this.onReplyButtonClick(comment.id) : this.props.onReplyButtonClick(comment.id);}}
                          onCancelReplyButtonClick={this.props.onCancelReplyButtonClick}
                          createComment={this.props.createComment}
                          depth={depth}
                          reactions={this.props.reactions}
                          reactionData={reactionData}
                          userReaction={userReaction}
                          createUserReaction={createUserReaction}
                          deleteUserReaction={deleteUserReaction}
                          postType={this.props.postType}
                          showVerifiedBadge={this.props.showVerifiedBadge}
                          deleteComment={this.deleteComment}
                          disableComments={this.props.disableComments}
                />
              );
            }
          }
          </Reactionable>
          {
            comment.children instanceof Array &&
              <CommentList  comments={comment.children}
                            user={this.props.user}
                            createComment={this.props.createComment}
                            onReplyButtonClick={this.props.onReplyButtonClick}
                            onCancelReplyButtonClick={this.props.onCancelReplyButtonClick}
                            childrenComments={comment.hasChildren}
                            getChildrenComments={() => {this.props.getChildrenComments(comment.id);}}
                            commentCount={comment.children.length}
                            depth={depth + 1}
                            entityData={this.props.entityData}
                            reactions={this.props.reactions}
                            createUserReaction={this.props.createUserReaction}
                            deleteUserReaction={this.props.deleteUserReaction}
                            postType={this.props.postType}
                            showVerifiedBadge={this.props.showVerifiedBadge}
                            deleteComment={this.deleteComment}
                            disableComments={this.props.disableComments}
              />
          }
        </div>
      );
    }
    
    return (
      <div className="post-comment-list-wrap">
        {comments}
        {
          (depth === 1) && hasMoreComments &&
            <p className="post-comment-heading animate-slide-down" onClick={this.props.getMoreComments}>{vikinger_translation.load_more_comments} <span className="highlighted">{commentsLeft}</span></p>
        }
        {
          (depth === 2) && this.props.childrenComments > 0 &&
            <p className={`post-comment-heading animate-slide-down reply-${depth}`} onClick={this.props.getChildrenComments}>{vikinger_translation.load} <span className="highlighted">{this.props.childrenComments}</span> {replyText}...</p>
        }
      </div>
    );
  }
}

module.exports = CommentList;