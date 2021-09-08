const React = require('react'),
      ReactDOM = require('react-dom');

const SearchForm = require('../../component/search/SearchForm');

const searchFormElement = document.querySelector('#vk-search-form');

if (searchFormElement) {
  const userID = Number.parseInt(searchFormElement.getAttribute('data-userid'), 10) || false;

  ReactDOM.render(
    <SearchForm userID={userID} />,
    searchFormElement
  );
}