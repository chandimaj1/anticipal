const React = require('react');

class AvatarTinyCircle extends React.Component {
  constructor(props) {
    super(props);

    this.noBorderClasses = this.props.noBorder ? 'no-border' : '';
  }

  render() {
    const Element = this.props.noLink || !vikinger_constants.plugin_active.buddypress ? 'div' : 'a';
    
    return (
      <Element  className={`user-avatar-circle tiny ${this.noBorderClasses} ${this.props.modifiers || ''}`}
                {...(!this.props.noLink ? { href: this.props.data.link } : {})}
      >
        {/* USER AVATAR CIRCLE IMAGE */}
        <img className="user-avatar-circle-image" src={this.props.data.avatar_url} alt="user-avatar" />
        {/* USER AVATAR CIRCLE IMAGE */}
      </Element>
    );
  }
}

module.exports = AvatarTinyCircle;