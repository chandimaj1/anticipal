const React = require('react');

const ReactionOption = require('./ReactionOption');

class ReactionOptionList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div ref={this.props.forwardedRef} className={`reaction-options ${this.props.modifiers || ''}`}>
        {
          this.props.data.map((reaction) => {
            return (
              <ReactionOption key={reaction.id} data={reaction} createUserReaction={this.props.createUserReaction} />
            );
          })
        }
      </div>
    );
  }
}

const ReactionOptionListForwardRef = React.forwardRef((props, ref) => {
  return (
    <ReactionOptionList {...props} forwardedRef={ref} />
  )
});

module.exports = ReactionOptionListForwardRef;