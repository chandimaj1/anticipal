const React = require('react'),
      ReactDOM = require('react-dom');

const MemberFilterableList = require('../../component/filter/MemberFilterableList');

const memberFilterableListElement = document.querySelector('#member-filterable-list');

if (memberFilterableListElement) {
  const themeColor = memberFilterableListElement.getAttribute('data-themecolor') || false,
        userID = Number.parseInt(memberFilterableListElement.getAttribute('data-userid'), 10) || false,
        groupID = Number.parseInt(memberFilterableListElement.getAttribute('data-groupid'), 10) || false,
        searchTerm = memberFilterableListElement.getAttribute('data-searchterm') || false,
        gridType = memberFilterableListElement.getAttribute('data-grid-type') || false;

  ReactDOM.render(
    <MemberFilterableList itemsPerPage={12}
                          themeColor={themeColor}
                          userID={userID}
                          groupID={groupID}
                          searchTerm={searchTerm}
                          gridType={gridType}
    />,
    memberFilterableListElement
  );
}