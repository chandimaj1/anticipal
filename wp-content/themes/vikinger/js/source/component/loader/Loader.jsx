const React = require('react');

class Loader extends React.Component {
  render() {
    return (
      <div className="page-loader-indicator">
        <div className="loader-bars">
          <div className="loader-bar"></div>
          <div className="loader-bar"></div>
          <div className="loader-bar"></div>
          <div className="loader-bar"></div>
          <div className="loader-bar"></div>
          <div className="loader-bar"></div>
          <div className="loader-bar"></div>
          <div className="loader-bar"></div>
        </div>
      </div>
    );
  }
}

module.exports = Loader;