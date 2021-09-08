const React = require('react');

const plugins = require('../../utils/plugins');

const ReactionOptionList = require('../reaction/ReactionOptionList'),
      IconSVG = require('../icon/IconSVG');

class PostReactionOption extends React.Component {
  constructor(props) {
    super(props);

    this.reactionOptionsDropdownTriggerRef = React.createRef();
    this.reactionOptionsDropdownContentRef = React.createRef();
  }

  componentDidMount() {
    plugins.createDropdown({
      triggerElement: this.reactionOptionsDropdownTriggerRef.current,
      containerElement: this.reactionOptionsDropdownContentRef.current,
      triggerEvent: 'hover',
      offset: {
        bottom: 54,
        left: -16
      },
      animation: {
        type: 'translate-bottom',
        speed: .3,
        translateOffset: {
          vertical: 20
        }
      },
      closeOnDropdownClick: true
    });
  }

  render() {
    return (
      <div className="post-option-wrap">
        <div  ref={this.reactionOptionsDropdownTriggerRef}
              className={`post-option ${this.props.userReaction ? 'reaction-active' : ''}`}
              {...(this.props.userReaction && { onClick: this.props.deleteUserReaction })}
        >
          {
            !this.props.userReaction &&
              <IconSVG  icon="thumbs-up"
                        modifiers="post-option-icon"
              />
          }

          {
            this.props.userReaction &&
              <img className="post-option-image" src={this.props.userReaction.image_url} alt={`reaction-${this.props.userReaction.name}`} />
          }

          {
            !this.props.userReaction &&
              <p className="post-option-text">{vikinger_translation.react}</p>
          }

          {
            this.props.userReaction &&
              <p className="post-option-text">{this.props.userReaction.name[0].toUpperCase() + this.props.userReaction.name.slice(1)}</p>
          }
        </div>
        
        <ReactionOptionList ref={this.reactionOptionsDropdownContentRef}
                            data={this.props.reactions}
                            createUserReaction={this.props.createUserReaction}
                            modifiers={`${this.props.simpleOptions ? 'small' : ''}`}
        />
      </div>
    );
  }
}

module.exports = PostReactionOption;