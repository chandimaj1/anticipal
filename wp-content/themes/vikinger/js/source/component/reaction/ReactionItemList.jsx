const React = require('react');

const ReactionItem = require('./ReactionItem');

class ReactionItemList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={`reaction-item-list ${this.props.modifiers || ''}`}>
      {
        this.props.data.map((reactionData, i) => {
          return (
            <ReactionItem key={reactionData.id}
                          data={reactionData}
                          reactionData={this.props.data}
                          reactionCount={this.props.reactionCount}
                          index={this.props.data.length - i}
            />
          );
        })
      }
      </div>
    );
  }
}

module.exports = ReactionItemList;