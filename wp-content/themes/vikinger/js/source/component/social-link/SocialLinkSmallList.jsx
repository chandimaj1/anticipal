const React = require('react');

const SocialLinkSmall = require('./SocialLinkSmall');

class SocialLinkSmallList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="social-links small">
        {
          this.props.data.map((socialItem, i) => {
            return (
              <SocialLinkSmall key={i} data={socialItem} />
            );
          })
        }
      </div>
    );
  }
}

module.exports = SocialLinkSmallList;