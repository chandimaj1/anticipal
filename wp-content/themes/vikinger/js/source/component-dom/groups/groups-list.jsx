const React = require('react'),
      ReactDOM = require('react-dom');

const GroupFilterableList = require('../../component/filter/GroupFilterableList');

const groupFilterableListElement = document.querySelector('#group-filterable-list');

if (groupFilterableListElement) {
  const themeColor = groupFilterableListElement.getAttribute('data-themecolor') || false,
        userID = Number.parseInt(groupFilterableListElement.getAttribute('data-userid'), 10) || false,
        searchTerm = groupFilterableListElement.getAttribute('data-searchterm') || false,
        gridType = groupFilterableListElement.getAttribute('data-grid-type') || false;

  ReactDOM.render(
    <GroupFilterableList  itemsPerPage={12}
                          themeColor={themeColor}
                          userID={userID}
                          searchTerm={searchTerm}
                          gridType={gridType}
    />,
    groupFilterableListElement
  );
}