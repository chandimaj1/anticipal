const React = require('react');

const CircleProgressBar = require('../progress/CircleProgressBar');

class AvatarSmallCircle extends React.Component {
  constructor(props) {
    super(props);

    this.noBorderClasses = this.props.noBorder ? 'no-border' : '';
  }

  render() {
    const Element = this.props.noLink || !vikinger_constants.plugin_active.buddypress ? 'div' : 'a';
    
    return (
      <Element  className={`user-avatar-circle small ${!this.props.data.rank ? 'no-stats' : ''} ${this.noBorderClasses} ${this.props.modifiers || ''}`}
                {...(!this.props.noLink ? { href: this.props.data.link } : {})}
      >
        {/* USER AVATAR CIRCLE IMAGE */}
        <img className="user-avatar-circle-image" src={this.props.data.avatar_url} alt="user-avatar" />
        {/* USER AVATAR CIRCLE IMAGE */}

      {
        this.props.data.rank &&
          <React.Fragment>
            {/* USER AVATAR CIRCLE PROGRESS */}
            <CircleProgressBar size="small" fillAmount={this.props.data.rank.current / this.props.data.rank.total} />
            {/* USER AVATAR CIRCLE PROGRESS */}

            {/* USER AVATAR CIRCLE BADGE */}
            <div className="user-avatar-circle-badge">
              {/* USER AVATAR CIRCLE BADGE CONTENT */}
              <div className="user-avatar-circle-badge-content">
                {/* USER AVATAR CIRCLE BADGE CONTENT TEXT */}
                <p className="user-avatar-circle-badge-content-text">{this.props.data.rank.current}</p>
                {/* USER AVATAR CIRCLE BADGE CONTENT TEXT */}
              </div>
              {/* USER AVATAR CIRCLE BADGE CONTENT */}
            </div>
            {/* USER AVATAR CIRCLE BADGE */}
          </React.Fragment>
      }
      </Element>
    );
  }
}

module.exports = AvatarSmallCircle;