const React = require('react');

const PostPreview = require('./PostPreview'),
      PostIframePreview = require('./PostIframePreview'),
      PostGalleryPreview = require('./PostGalleryPreview'),
      PostPreviewSmall = require('./PostPreviewSmall'),
      PostIframePreviewSmall = require('./PostIframePreviewSmall'),
      PostGalleryPreviewSmall = require('./PostGalleryPreviewSmall'),
      PostPreviewBig = require('./PostPreviewBig'),
      PostIframePreviewBig = require('./PostIframePreviewBig'),
      PostGalleryPreviewBig = require('./PostGalleryPreviewBig'),
      Grid_4 = require('../grid/Grid_4'),
      Grid_6 = require('../grid/Grid_6'),
      Notification = require('../notification/Notification');

class PostPreviewList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let grid, posts;

    // if there are posts
    if (this.props.data.length) {
      if (this.props.gridType === 'big') {
        posts = this.props.data.map((post) => {
          if (((post.format === 'video') && post.video_url !== '') || ((post.format === 'audio') && post.audio_url !== '')) {
            return (
              <PostIframePreviewBig key={post.id} data={post} loggedUser={this.props.loggedUser} />
            );
          } else if ((post.format === 'gallery') && post.gallery) {
            return (
              <PostGalleryPreviewBig key={post.id} data={post} loggedUser={this.props.loggedUser} />
            );
          }

          return (
            <PostPreviewBig key={post.id} data={post} loggedUser={this.props.loggedUser} />
          );
        });

        grid = <Grid_6 content={posts} />;
      } else if (this.props.gridType === 'small') {
        posts = this.props.data.map((post) => {
          if (((post.format === 'video') && post.video_url !== '') || ((post.format === 'audio') && post.audio_url !== '')) {
            return (
              <PostIframePreview key={post.id} data={post} loggedUser={this.props.loggedUser} />
            );
          } else if ((post.format === 'gallery') && post.gallery) {
            return (
              <PostGalleryPreview key={post.id} data={post} loggedUser={this.props.loggedUser} />
            );
          }

          return (
            <PostPreview key={post.id} data={post} loggedUser={this.props.loggedUser} />
          );
        });

        grid = <Grid_4 content={posts} />;
      } else if (this.props.gridType === 'list') {
        posts = this.props.data.map((post) => {
          if (((post.format === 'video') && post.video_url !== '') || ((post.format === 'audio') && post.audio_url !== '')) {
            return (
              <PostIframePreviewSmall key={post.id} data={post} loggedUser={this.props.loggedUser} />
            );
          } else if ((post.format === 'gallery') && post.gallery) {
            return (
              <PostGalleryPreviewSmall key={post.id} data={post} loggedUser={this.props.loggedUser} />
            );
          }

          return (
            <PostPreviewSmall key={post.id} data={post} loggedUser={this.props.loggedUser} />
          );
        });

        grid = <Grid_6 content={posts} />;
      }
    } else {
      grid = <Notification title={vikinger_translation.post_no_results_title} text={vikinger_translation.post_no_results_text} />;
    }

    return grid;
  }
}

module.exports = PostPreviewList;