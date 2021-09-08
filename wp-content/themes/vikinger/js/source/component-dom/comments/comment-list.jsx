const React = require('react'),
      ReactDOM = require('react-dom');

const OpenPostFooter = require('../../component/post/OpenPostFooter');

const commentListElement = document.querySelector('#comment-list');

if (commentListElement) {
  const postID = commentListElement.getAttribute('data-postid'),
        postType = commentListElement.getAttribute('data-posttype') || false,
        order = 'DESC';

  ReactDOM.render(
    <OpenPostFooter postID={postID} order={order} postType={postType} />,
    commentListElement
  );
}