const React = require('react');

const plugins = require('../../utils/plugins');

const ReactionOptionList = require('../reaction/ReactionOptionList');

class CommentReactionOption extends React.Component {
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
        bottom: 30,
        left: -80
      },
      animation: {
        type: 'translate-bottom',
        speed: .3,
        translateOffset: {
          vertical: 16
        }
      },
      closeOnDropdownClick: true
    });
  }

  render() {
    return (
      <div className="meta-line">
        <div ref={this.reactionOptionsDropdownTriggerRef} className="meta-line-link-wrap" {...(this.props.userReaction && { onClick: this.props.deleteUserReaction })}>
        {
          !this.props.userReaction &&
            <p className="meta-line-link light">{vikinger_translation.react}</p>
        }
        {
          this.props.userReaction &&
            <p className="meta-line-link">{this.props.userReaction.name[0].toUpperCase() + this.props.userReaction.name.slice(1)}</p>
        }
        </div>

        <ReactionOptionList ref={this.reactionOptionsDropdownContentRef} modifiers='small' data={this.props.reactions} createUserReaction={this.props.createUserReaction} />
      </div>
    );
  }
}

module.exports = CommentReactionOption;