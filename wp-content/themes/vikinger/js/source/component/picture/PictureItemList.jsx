const React = require('react');

const PictureItem = require('./PictureItem');

class PictureItemList extends React.Component {
  constructor(props) {
    super(props);

    this.displayMax = this.props.displayMax ? this.props.displayMax : 12;
  }

  render() {
    const pictures = [],
          totalCount = this.props.data.length,
          showMore = this.displayMax === this.props.data.length,
          pictureCount = showMore ? totalCount - 1 : totalCount;

    for (let i = 0; i < pictureCount; i++) {
      const picture = this.props.data[i];

      pictures.push(
        <PictureItem key={picture.id} data={picture} loggedUser={this.props.loggedUser} reactions={this.props.reactions} />
      );
    }


    return (
      <div className={`picture-item-list ${this.props.modifiers || ''}`}>
      { pictures }
      {
        showMore &&
          <PictureItem  data={this.props.data[pictureCount]}
                        user={this.props.user}
                        moreItems
                        noPopup
          />
      }
      </div>
    );
  }
}

module.exports = PictureItemList;