const React = require('react');

const app = require('../../utils/core');

const WP_Router = require('../../router/WP_Router')();

const AsyncCommentList = require('./AsyncCommentList');

class ActivityCommentList extends React.Component {
  constructor(props) {
    super(props);

    this.comments = this.props.comments.slice();
    this.order = this.props.order ? this.props.order : 'DESC';
    this.reorderComments(this.comments, this.order);

    this.getComment = this.getComment.bind(this);this.getComments = this.getComments.bind(this);
    this.getCommentCount = this.getCommentCount.bind(this);
    this.createComment = this.createComment.bind(this);
  }

  reorderComments(comments, order) {
    let sortFunction;

    // select sorting function according to selected sort order
    if (order === 'DESC') {
      sortFunction = (firstEl, secondEl) => {
        if (firstEl.date > secondEl.date) {
          return -1;
        }

        if (firstEl.date < secondEl.date) {
          return 1;
        }

        return 0;
      };
    } else if (order === 'ASC') {
      sortFunction = (firstEl, secondEl) => {
        if (firstEl.date < secondEl.date) {
          return -1;
        }

        if (firstEl.date > secondEl.date) {
          return 1;
        }

        return 0;
      };
    }

    // console.log('ACTIVITY COMMENT LIST - Recursively order comments');

    this.sortComments(comments, sortFunction);
  }

  sortComments(comments, sortFunction) {
    comments.sort(sortFunction);

    for (const comment of comments) {
      if (comment.children instanceof Array && comment.children.length > 0) {
        this.sortComments(comment.children, sortFunction);
      }
    }
  }

  createComment(commentData, callback) {
    const config = {
      activityID: this.props.activityID
    };

    app.deepExtend(config, commentData);

    // console.log('CREATE COMMENT WITH CONFIG: ', config);

    WP_Router.createActivityComment(config, (response) => {
      if (response) {
        this.props.updateCommentCount(1);
      }

      callback(response);
    });
  }

  getComment(commentID, callback) {
    const config = {
      display_comments: 'stream',
      in: commentID,
      filter: {
        action: 'activity_comment'
      }
    };

    WP_Router.getActivities(config, (response) => {
      const comment = response.activities[0];

      callback(comment);
    });
  }

  getComments(callback, options) {
    const startPosition = (options.page - 1) * this.props.perPage,
          endPosition = startPosition + this.props.perPage,
          comments = this.comments.slice(startPosition, endPosition);

    // console.log('ALL ACTIVITY COMMENTS: ', this.comments);

    callback(comments);
  }

  getCommentCount(callback) {
    callback(this.comments.length);
  }

  render() {
    return (
      <AsyncCommentList getComment={this.getComment}
                        getComments={this.getComments}
                        commentCount={this.comments.length}
                        getCommentCount={this.getCommentCount}
                        createComment={this.createComment}
                        user={this.props.user}
                        order={this.order}
                        replyType={this.props.replyType}
                        formPosition={this.props.formPosition}
                        entityData={(id) => ({activity_id: id})}
                        reactions={this.props.reactions}
                        createUserReaction={WP_Router.createActivityUserReaction}
                        deleteUserReaction={WP_Router.deleteActivityUserReaction}
                        postType='activity'
                        showVerifiedBadge={vikinger_constants.plugin_active['bp-verified-member'] && vikinger_constants.settings.bp_verified_member_display_badge_in_activity_stream}
                        deleteComment={WP_Router.deleteActivityComment}
      />
    )
  }
}

module.exports = ActivityCommentList;