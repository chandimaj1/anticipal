const React = require('react');

const AvatarSmaller = require('./AvatarSmaller'),
      AvatarOverlaySmaller = require('./AvatarOverlaySmaller');

class AvatarSmallerList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const displayCount = this.props.limit ? Math.min(this.props.limit, this.props.data.length) : this.props.data.length,
          moreItems = this.props.count > displayCount ? this.props.count - displayCount : 0,
          items = [];

    for (let i = 0; i < displayCount; i++) {
      const dataItem = this.props.data[i],
            lastItem = (i === (displayCount - 1));

      if (lastItem && moreItems) {
        items.push(
          <AvatarOverlaySmaller key={dataItem.id} data={dataItem} count={moreItems} link={this.props.link} />
        );
      } else {
        items.push(
          <AvatarSmaller key={dataItem.id} data={dataItem} />
        );
      }
    }

    return (
      <div className="user-avatar-list medium reverse centered">
        { items }
      </div>
    );
  }
}

module.exports = AvatarSmallerList;