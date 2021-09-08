const React = require('react');

const app = require('../../utils/core');

const CommentList = require('./CommentList'),
      CommentForm = require('./CommentForm'),
      CommentFormBig = require('./CommentFormBig'),
      CommentFormGuest = require('./CommentFormGuest'),
      LoaderSpinner = require('../loader/LoaderSpinner');

class AsyncCommentList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      comments: [],
      commentCount: props.commentCount,
      initialFetch: props.commentCount > 0
    };

    this.commentsWithChildren = [];
    this.preloadedComments = [];
    this.currentPage = 1;

    this.onReplyButtonClick = this.onReplyButtonClick.bind(this);
    this.onCancelReplyButtonClick = this.onCancelReplyButtonClick.bind(this);
    this.createComment = this.createComment.bind(this);
    this.getMoreComments = this.getMoreComments.bind(this);
    this.getChildrenComments = this.getChildrenComments.bind(this);

    this.deleteComment = this.deleteComment.bind(this);
  }

  deleteCommentStatic(commentID) {
    this.setState((state, props) => {
      let comments = [];

      app.deepExtend(comments, state.comments);

      let deletedCommentCount = 0;

      // only need top level comment count
      for (const comment of comments) {
        if (comment.id === commentID) {
          deletedCommentCount = 1;
        }
      }

      comments = this.iterateCommentsFilter(comments, commentID);

      // console.log('ASYNC COMMENT LIST - COMMENTS WITH DELETED: ', comments);
      // console.log('ASYNC COMMENT LIST - DELETED COMMENT COUNT: ', deletedCommentCount);

      return {
        comments: comments,
        commentCount: state.commentCount - deletedCommentCount
      };
    });
  }

  deleteComment(config, callback) {
    const deleteCommentPromise = this.props.deleteComment(config);

    console.log('ASYNC COMMENT LIST - DELETE COMMENT CONFIG: ', config);

    deleteCommentPromise
    .done((response) => {
      console.log('ASYNC COMMENT LIST - DELETE COMMENT RESPONSE: ', response);

      // comment deleted succesfully, remove comment and all its children from the comments
      if (response) {
        // remove comment from state
        this.deleteCommentStatic(config.comment_id);
      } else {
      // show error
        callback(false);
      }
    })
    .fail((error) => {
      console.log('ASYNC COMMENT LIST - DELETE COMMENT ERROR: ', error);

      // show error
      callback(false);
    });
  }

  iterateCommentsFilter(comments, commentID) {
    const filteredComments = comments.filter(comment => comment.id !== commentID);

    return filteredComments.map((comment) => {
      if (typeof comment.children !== 'undefined') {
        comment.children = this.iterateCommentsFilter(comment.children, commentID);
      }

      return comment;
    });
  }

  iterateComments(comments, callback, depth = 1) {
    for (const comment of comments) {
      callback(comment, depth);

      if (typeof comment.children !== 'undefined') {
        this.iterateComments(comment.children, callback, depth + 1);
      }
    }
  }

  onReplyButtonClick(commentID) {
    this.setState((state, props) => {
      const comments = state.comments.slice();

      this.iterateComments(comments, (comment) => {
        comment.showReplyForm = (comment.id === commentID);
      });

      return {
        comments: comments
      };
    });
  }

  onCancelReplyButtonClick() {
    this.setState((state, props) => {
      const comments = state.comments.slice();

      this.iterateComments(comments, (comment) => {
        comment.showReplyForm = false;
      });

      return {
        comments: comments
      };
    });
  }

  clearChildrenComments(comments) {
    for (const comment of comments) {
      if (comment.children instanceof Array && comment.children.length > 0) {
        comment.hasChildren = 0;

        this.iterateComments(comment.children, () => {
          comment.hasChildren++;
        });

        comment.children = [];
      }
    }
  }

  getChildrenComments(parentID) {
    // console.log('GET CHILDREN COMMENTS FOR: ', parentID);

    for (const comment of this.commentsWithChildren) {
      if (comment.id === parentID) {
        const children = comment.children;
        // console.log('FOUND CHILDREN COMMENTS: ', children);
        
        this.setState((state, props) => {
          const comments = state.comments.slice();

          for (const stateComment of comments) {
            if (stateComment.id === parentID) {
              stateComment.children = children;
              stateComment.hasChildren = 0;
            }
          }

          return {
            comments: comments
          };
        });

        return;
      }
    }
  }

  getCommentsPage(callback) {
    const config = {
      page: this.currentPage
    };

    this.props.getComments((requestedComments) => {
      // console.log('ASYNC COMMENT LIST - GET COMMENTS PAGE RESPONSE: ', requestedComments);

      let comments = [];

      app.deepExtend(comments, requestedComments);

      // console.log('ASYNC COMMENT LIST - COMMENTS WITH DUPLICATES (MAYBE): ', comments);

      const newComments = comments.slice();

      // remove duplicates (needed for on demand comment show vs pagination)
      for (let i = comments.length - 1; i >= 0; i--) {
        const comment = comments[i];

        for (let j = this.state.comments.length - 1; j >= 0; j--) {
          const stateComment = this.state.comments[j];

          // if comment already exists at level 0, remove it
          if (comment.id === stateComment.id) {
            newComments.splice(i, 1);
          }
        }
      }

      // console.log('COMMENTS WITHOUT DUPLICATES: ', newComments);

      // save original comments with children
      this.commentsWithChildren = this.commentsWithChildren.concat(requestedComments);
      // console.log('COMMENTS WITH CHILDREN: ', this.commentsWithChildren);

      // remove children comments from top level
      // and add children comment count property
      this.clearChildrenComments(newComments);

      // console.log('COMMENTS WITHOUT CHILDREN: ', newComments);

      this.currentPage++;

      callback(newComments);
    }, config);
  }

  getMoreComments() {
    // dump preloaded comments if any
    if (this.preloadedComments.length > 0) {
      if (this._isMounted) {
        this.setState((state, props) => {
          return {
            comments: state.comments.concat(this.preloadedComments)
          };
        }, () => {
          this.getCommentsPage((comments) => {
            this.preloadedComments = comments;
          });
        });
      }
    // get comments page and preload comments if there are any left
    } else {
      this.getCommentsPage((comments) => {
        if (this._isMounted) {
          this.setState((state, props) => {
            return {
              comments: state.comments.concat(comments),
              initialFetch: false
            };
          });
        }

        this.getCommentsPage((comments) => {
          this.preloadedComments = comments;
        });
      });
    }
  }

  createComment(commentData, callback) {
    // console.log('CREATE COMMENT');

    this.props.createComment(commentData, (response) => {
      // console.log('COMMENT ID: ', response);

      if (!response) {
        callback('An error has ocurred, please try again later');
      } else {
        callback(response);

        if (!Number.isNaN(Number.parseInt(response, 10))) { 
          this.newCommentCreated(response);
        }
      }
    });
  }

  newCommentCreated(commentID) {
    // console.log('NEW COMMENT CREATED WITH ID: ', commentID);

    // get created comment and update comment list state
    this.props.getComment(commentID, (comment) => {
      this.setState((state, props) => {
        // console.log('CREATED COMMENT GET: ', comment);

        comment.showReplyForm = false;

        const currentComments = state.comments.slice();

        let commentCount = state.commentCount;

        // if comment doesn't have parent push it to currentComments array
        if (comment.parent == 0) {
          commentCount++;

          // console.log('ORDER: ', props.order);
          if (props.order === 'ASC') {
            currentComments.push(comment);
          } else if (props.order === 'DESC') {
            // comment.scrollToMe = true;
            currentComments.unshift(comment);
          }
        } else {
        // if comment has a parent, push it in the parents children array (create it if first child)
          this.iterateComments(currentComments, (currentComment, depth) => {
            // if found comment parent
            if (currentComment.id == comment.parent) {
              // if children array doesn't exist in parent, create it
              if (typeof currentComment.children === 'undefined') {
                currentComment.children = [];
              }

              // insert comment as child
              if (props.order === 'ASC') {
                currentComment.children.push(comment);
              } else if (props.order === 'DESC') {
                // comment.scrollToMe = true;
                currentComment.children.unshift(comment);
              }

              // hide parent comment reply form
              currentComment.showReplyForm = false;

              // don't continue searching
              return;
            }
          });
        }

        // console.log('CURRENT COMMENTS BEFORE STATE UPDATE: ', currentComments);

        return {
          comments: currentComments,
          commentCount: commentCount
        };
      });
    });
  }

  componentDidMount() {
    this._isMounted = true;

    if (this.props.commentCount > 0) {
      this.props.getCommentCount((commentCount) => {
        this.setState({
          commentCount: commentCount
        });
        
        this.getMoreComments();
      });
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    let commentForm;

    if (this.props.allowGuest) {
      commentForm = <CommentFormGuest createComment={this.createComment} />;
    }

    if (this.props.user) {
      if (this.props.replyType === 'quick') {
        commentForm = <CommentForm user={this.props.user} userFriends={this.props.user.friends} createComment={this.createComment} />;
      } else {
        commentForm = <CommentFormBig user={this.props.user} userFriends={this.props.user.friends} createComment={this.createComment} />;
      }
    }

    return (
      <div className="post-comments">
      {
        this.state.initialFetch &&
          <LoaderSpinner />
      }

      {
        !this.state.initialFetch &&
          <React.Fragment>
          {
            !this.props.disableComments && (this.props.formPosition === 'top') &&
              commentForm
          }
          {
            (this.state.comments.length > 0) &&
              <CommentList  comments={this.state.comments}
                            user={this.props.user}
                            createComment={this.createComment}
                            onReplyButtonClick={this.onReplyButtonClick}
                            onCancelReplyButtonClick={this.onCancelReplyButtonClick}
                            commentCount={this.state.commentCount}
                            getMoreComments={this.getMoreComments}
                            getChildrenComments={this.getChildrenComments}
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
          {
            !this.props.disableComments && (this.props.formPosition === 'bottom') &&
              commentForm
          }
          </React.Fragment>
      }
      </div>
    )
  }
}

module.exports = AsyncCommentList;