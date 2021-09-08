const React = require('react');

const SocialLink = require('./SocialLink');

class SocialLinkList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="social-links">
        {
          this.props.data.map((socialItem) => {
            return (
              <SocialLink key={socialItem.name} data={socialItem} />
            );
          })
        }
      </div>
    );
  }
}

module.exports = SocialLinkList;