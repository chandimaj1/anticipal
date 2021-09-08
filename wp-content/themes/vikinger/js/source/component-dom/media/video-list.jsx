const React = require('react'),
      ReactDOM = require('react-dom');

const ActivityVideoList = require('../../component/activity/ActivityVideoList');

const activityVideoListElement = document.querySelector('#activity-video-list');

if (activityVideoListElement) {
  const userID = Number.parseInt(activityVideoListElement.getAttribute('data-userid'), 10) || false,
        groupID = Number.parseInt(activityVideoListElement.getAttribute('data-groupid'), 10) || false,
        order = 'DESC';

  ReactDOM.render(
    <ActivityVideoList  userID={userID}
                        groupID={groupID}
                        perPage={24}
                        order={order}
    />,
    activityVideoListElement
  );
}