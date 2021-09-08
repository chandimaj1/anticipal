const React = require('react');

const AvatarTiny = require('../avatar/AvatarTiny'),
      IconSVG = require('../icon/IconSVG');

class MentionBlock extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="mention-block">
        <AvatarTiny data={this.props.data} noBorder noLink modifiers="mention-block-avatar" />

        <p className="mention-block-title">{this.props.data.mention_name}</p>

        <div className="mention-block-action" onClick={this.props.onActionClick}>
          <IconSVG icon="cross" modifiers="mention-block-action-icon" />
        </div>
      </div>
    );
  }
}

module.exports = MentionBlock;