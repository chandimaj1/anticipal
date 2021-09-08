const React = require('react');

const BadgeItem = require('./BadgeItem'),
      BadgeItemMore = require('./BadgeItemMore');

class BadgeItemList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const maxDisplayCount = this.props.maxDisplayCount || this.props.data.length,
          badgesCount = this.props.data.length,
          displayCount = Math.min(maxDisplayCount, badgesCount),
          badges = this.props.data.slice(0, displayCount),
          moreCount = (badgesCount - displayCount) > 0 ? badgesCount - displayCount : 0;

    return (
      <div className={`badge-list ${this.props.modifiers || ''}`}>
      {
        badges.map((badge) => {
          return (
            <BadgeItem key={badge.id} data={badge} />
          );
        })
      }
      {
        moreCount > 0 &&
          <BadgeItemMore more_count={moreCount} more_link={this.props.moreLink} />
      }
      </div>
    );
  }
}

module.exports = BadgeItemList;