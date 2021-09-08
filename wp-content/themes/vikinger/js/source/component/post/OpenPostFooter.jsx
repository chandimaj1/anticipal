const React = require('react');

const WP_Router = require('../../router/WP_Router')();

const PostCommentList = require('../comment/PostCommentList'),
      Reactionable = require('../reaction/Reactionable'),
      PostFooter = require('./PostFooter'),
      Loader = require('../loader/Loader');

class OpenPostFooter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      postData: false,
      user: false,
      reactions: [],
      loading: false
    };

    this.postType = props.postType ? props.postType : 'post';
  }

  componentDidMount() {
    this.setState({
      loading: true
    });

    let getPosts = WP_Router.getPosts;
      
    const getPostsArgs = { include: [this.props.postID] };

    if (this.props.postType === 'page') {
      getPosts = WP_Router.getPages;
    }

    // console.log('OPEN POST FOOTER - POST TYPE: ', this.postType);
    // console.log('OPEN POST FOOTER - REQUIRED PLUGINS ACTIVE: ', vikinger_constants.plugin_active);

    // get posts promise
    const getPostsPromise = getPosts(getPostsArgs),
          getLoggedInMemberPromise = WP_Router.getLoggedInMember('user-activity');
          
    let getReactionsPromise = {no_result: true};

    if (vikinger_constants.plugin_active.vkreact) {
      getReactionsPromise = WP_Router.getReactions();
    }

    jQuery
    .when(getPostsPromise, getLoggedInMemberPromise, getReactionsPromise)
    .done((getPostsResponse, getLoggedInMemberResponse, getReactionsResponse) => {
      // console.log('OPEN POST FOOTER - POST DATA: ', getPostsResponse);
      // console.log('OPEN POST FOOTER - LOGGED IN USER: ', getLoggedInMemberResponse);
      // console.log('OPEN POST FOOTER - REACTIONS: ', getReactionsResponse);

      const postData = getPostsResponse[0],
            user = getLoggedInMemberResponse[0];

      let reactions = [];

      if (vikinger_constants.plugin_active.vkreact) {
        reactions = getReactionsResponse[0];
      }

      this.setState({
        postData: postData[0],
        user: user,
        reactions: reactions,
        loading: false
      });
    });
  }

  render() {
    return (
      <React.Fragment>
        {
          this.state.loading &&
            <Loader />
        }
        {
          !this.state.loading &&
            <Reactionable entityData={{post_id: this.props.postID}}
                          user={this.state.user}
                          reactions={this.state.reactions}
                          reactionData={this.state.postData ? this.state.postData.reactions : []}
                          createUserReaction={WP_Router.createPostUserReaction}
                          deleteUserReaction={WP_Router.deletePostUserReaction}
            >
            {
              (reactionData, userReaction, createUserReaction, deleteUserReaction) => {
                return (
                  <PostFooter commentCount={this.state.postData ? this.state.postData.comment_count : 0}
                              shareType='post'
                              shareData={this.state.user && (this.postType !== 'page') ? this.state.postData : false}
                              shareCount={this.state.postData && (this.postType !== 'page') ? this.state.postData.share_count : false}
                              user={this.state.user}
                              reactions={this.state.reactions}
                              reactionData={reactionData}
                              userReaction={userReaction}
                              createUserReaction={createUserReaction}
                              deleteUserReaction={deleteUserReaction}
                              disableActions={this.state.postData.comment_status !== 'open'}
                              postType='post'
                  >
                  {
                    (updateCommentCount) => {
                      return (
                        <React.Fragment>
                        {
                          !this.state.postData.password_required &&
                            <PostCommentList  postID={this.props.postID}
                                              commentCount={this.state.postData ? this.state.postData.comment_count : 0}
                                              updateCommentCount={updateCommentCount}
                                              perPage={2}
                                              order={this.props.order}
                                              user={this.state.user}
                                              reactions={this.state.reactions}
                                              formPosition='bottom'
                                              disableComments={this.state.postData.comment_status !== 'open'}
                            />
                        }
                        </React.Fragment>
                      );
                    }
                  }
                  </PostFooter>
                );
              }
            }
            </Reactionable>
        }
      </React.Fragment>
    );
  }
}

module.exports =  OpenPostFooter;