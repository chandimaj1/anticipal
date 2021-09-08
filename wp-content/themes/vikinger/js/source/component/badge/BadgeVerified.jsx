const React = require('react');

class BadgeVerified extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <span dangerouslySetInnerHTML={{__html: vikinger_constants.settings.bp_verified_member_badge}}></span>
    );
  }
}

module.exports = BadgeVerified;