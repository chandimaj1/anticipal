const React = require('react');

const AvatarSmall = require('../avatar/AvatarSmall'),
      BadgeVerified = require('../badge/BadgeVerified'),
      CommentForm = require('./CommentForm'),
      CommentFormGuest = require('./CommentFormGuest'),
      CommentActions = require('./CommentActions');

class Comment extends React.Component {
  constructor(props) {
    super(props);

    this.commentRef = React.createRef();

    this.onReplyButtonClick = this.onReplyButtonClick.bind(this);

    this.deleteComment = this.deleteComment.bind(this);
  }

  deleteComment() {
    if (this.props.postType === 'activity') {
      this.props.deleteComment({activity_id: 0, comment_id: this.props.data.id});
    } else if (this.props.postType === 'post') {
      this.props.deleteComment({comment_id: this.props.data.id});
    }
  }

  onReplyButtonClick() {
    // console.log('COMMENT - ON REPLY BUTTON CLICK: ', this.props.data.id);
    this.props.onReplyButtonClick(this.props.data.id);
  }

  componentDidMount() {
    if (this.props.data.scrollToMe) {
      this.commentRef.current.scrollIntoView();
    }
  }

  render() {
    let commentForm;

    if (this.props.allowGuest) {
      commentForm = <CommentFormGuest parent={this.props.data.id} createComment={this.props.createComment} />;
    }

    if (this.props.user) {
      commentForm = <CommentForm user={this.props.user} parent={this.props.data.id} createComment={this.props.createComment} focus={true} />;
    }

    const replyForm = this.props.data.showReplyForm ? commentForm : '';

    const displayVerifiedMemberBadge = this.props.showVerifiedBadge && this.props.data.author.verified;

    return (
      <div ref={this.commentRef} className={`post-comment animate-slide-down reply-${this.props.depth || 1}`}>
      {
        (!this.props.data.type || (this.props.data.type === 'comment') || (this.props.data.type === 'activity_comment')) &&
          <AvatarSmall noBorder noLink={this.props.data.author.link === ''} data={this.props.data.author} />
      }

        {/* POST COMMENT TEXT */}
        <div className="post-comment-text">
        {
          (this.props.data.author.link !== '') &&
            <a className="post-comment-text-author" href={this.props.data.author.link}>{this.props.data.author.name}</a>
        }
        {
          (this.props.data.author.link === '') &&
            <span className="post-comment-text-author">{this.props.data.author.name}</span>
        }
        {
          displayVerifiedMemberBadge &&
            <BadgeVerified />
        }
          <div dangerouslySetInnerHTML={{__html: this.props.data.content}}></div>
        </div>
        {/* POST COMMENT TEXT */}

        <CommentActions data={this.props.data}
                        allowReply={!this.props.disableComments && (this.props.user || this.props.allowGuest)}
                        user={this.props.user}
                        onReplyButtonClick={this.onReplyButtonClick}
                        onCancelReplyButtonClick={this.props.onCancelReplyButtonClick}
                        reactions={this.props.reactions}
                        reactionData={this.props.reactionData}
                        userReaction={this.props.userReaction}
                        createUserReaction={this.props.createUserReaction}
                        deleteUserReaction={this.props.deleteUserReaction}
                        postType={this.props.postType}
                        deleteComment={this.deleteComment}
        />
      {replyForm}
      {
        this.props.data.approved == '0' &&
          <p className="post-comment-notification">{vikinger_translation.comment_not_approved_message}</p>
      }
      </div>
    );
  }
}

module.exports = Comment;