const React = require('react'),
      ReactDOM = require('react-dom');

const WidgetPhotos = require('../../component/widget/WidgetPhotos');

const photosWidgetElement = document.querySelector('#photos-widget');

if (photosWidgetElement) {
  const userID = Number.parseInt(photosWidgetElement.getAttribute('data-userid'), 10) || false,
        groupID = Number.parseInt(photosWidgetElement.getAttribute('data-groupid'), 10) || false;

  ReactDOM.render(
    <WidgetPhotos userID={userID} groupID={groupID} />,
    photosWidgetElement
  );
}