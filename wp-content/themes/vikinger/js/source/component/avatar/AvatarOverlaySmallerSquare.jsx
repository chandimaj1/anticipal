const React = require('react');

class AvatarOverlaySmallerSquare extends React.Component {
  constructor(props) {
    super(props);

    this.noBorderClasses = this.props.noBorder ? 'no-border' : '';
  }

  render() {
    const Element = this.props.noLink || !vikinger_constants.plugin_active.buddypress ? 'div' : 'a';
    
    return (
      <Element  className={`user-avatar-circle user-avatar-circle-flat smaller ${this.noBorderClasses} ${this.props.modifiers || ''}`}
                {...(!this.props.noLink ? { href: this.props.link } : {})}
      >
        {/* USER AVATAR CIRCLE IMAGE */}
        <img className="user-avatar-circle-image" src={this.props.data.avatar_url} alt="user-avatar" />
        {/* USER AVATAR CIRCLE IMAGE */}

        {/* USER AVATAR CIRCLE OVERLAY */}
        <div class="user-avatar-circle-overlay">
          {/* USER AVATAR CIRCLE OVERLAY TEXT */}
          <p class="user-avatar-circle-overlay-text">+{this.props.count}</p>
          {/* USER AVATAR CIRCLE OVERLAY TEXT */}
        </div>
        {/* USER AVATAR CIRCLE OVERLAY */}
      </Element>
    );
  }
}

module.exports = AvatarOverlaySmallerSquare;