const React = require('react'),
      ReactDOM = require('react-dom');

const ActivityFilterableList = require('../../component/activity/ActivityFilterableList');

const activityFilterableListElement = document.querySelector('#activity-filterable-list');

if (activityFilterableListElement) {
  const userID = Number.parseInt(activityFilterableListElement.getAttribute('data-userid'), 10) || false,
        groupID = Number.parseInt(activityFilterableListElement.getAttribute('data-groupid'), 10) || false,
        activityID = Number.parseInt(activityFilterableListElement.getAttribute('data-activityid'), 10) || false,
        noFilter = (activityFilterableListElement.getAttribute('data-nofilter') === '') || false,
        order = 'DESC';

  ReactDOM.render(
    <ActivityFilterableList userID={userID}
                            groupID={groupID}
                            activityID={activityID}
                            perPage={5}
                            order={order}
                            noFilter={noFilter}
    />,
    activityFilterableListElement
  );
}