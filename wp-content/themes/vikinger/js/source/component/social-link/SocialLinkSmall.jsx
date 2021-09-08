const React = require('react');

const IconSVG = require('../icon/IconSVG');

class SocialLinkSmall extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <a key={this.props.data.name} className={`social-link small ${this.props.data.name}`} href={this.props.data.link} target="_blank">
        <IconSVG  icon={this.props.data.name}
                  modifiers="social-link-icon"
        />
      </a>
    );
  }
}

module.exports = SocialLinkSmall;