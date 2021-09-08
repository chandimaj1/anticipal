const React = require('react'),
      ReactDOM = require('react-dom');

const ActivityPhotoList = require('../../component/activity/ActivityPhotoList');

const activityPhotoListElement = document.querySelector('#activity-photo-list');

if (activityPhotoListElement) {
  const userID = Number.parseInt(activityPhotoListElement.getAttribute('data-userid'), 10) || false,
        groupID = Number.parseInt(activityPhotoListElement.getAttribute('data-groupid'), 10) || false,
        order = 'DESC';

  ReactDOM.render(
    <ActivityPhotoList  userID={userID}
                        groupID={groupID}
                        perPage={24}
                        order={order}
    />,
    activityPhotoListElement
  );
}