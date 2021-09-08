const React = require('react');

const app = require('../../utils/core');

const WP_Router = require('../../router/WP_Router')();

const AsyncCommentList = require('./AsyncCommentList');

class PostCommentList extends React.Component {
  constructor(props) {
    super(props);

    this.order = this.props.order ? this.props.order : 'DESC';

    this.getComment = this.getComment.bind(this);
    this.getComments = this.getComments.bind(this);
    this.getCommentCount = this.getCommentCount.bind(this);
    this.createComment = this.createComment.bind(this);
  }

  createComment(commentData, callback) {
    const config = {
      postID: this.props.postID
    };

    app.deepExtend(config, commentData);

    // console.log('CREATE COMMENT WITH CONFIG: ', config);

    WP_Router.createComment(config, (response) => {
      if (response) {
        this.props.updateCommentCount(1);
      }

      callback(response);
    });
  }

  getComment(commentID, callback) {
    WP_Router.getComments({comment__in: [commentID]}, (comments) => {
      callback(comments[0]);
    });
  }

  getComments(callback, options) {
    const config = {
      post_id: this.props.postID,
      paged: options.page,
      number: this.props.perPage,
      order: this.order,
      hierarchical: 'threaded',
      status: 'approve'
    };

    WP_Router.getComments(config, callback);
  }

  getCommentCount(callback) {
    WP_Router.getPostTopLevelCommentCount(this.props.postID, callback);
  }

  render() {
    return (
      <AsyncCommentList getComment={this.getComment}
                        getComments={this.getComments}
                        commentCount={this.props.commentCount}
                        getCommentCount={this.getCommentCount}
                        createComment={this.createComment}
                        user={this.props.user}
                        order={this.order}
                        replyType={this.props.replyType}
                        formPosition={this.props.formPosition}
                        entityData={(id) => ({postcomment_id: id})}
                        reactions={this.props.reactions}
                        createUserReaction={WP_Router.createPostCommentUserReaction}
                        deleteUserReaction={WP_Router.deletePostCommentUserReaction}
                        disableComments={this.props.disableComments}
                        postType='post'
                        showVerifiedBadge={vikinger_constants.plugin_active['bp-verified-member'] && vikinger_constants.settings.bp_verified_member_display_badge_in_wp_comments}
                        deleteComment={WP_Router.deletePostComment}
      />
    )
  }
}

module.exports = PostCommentList;