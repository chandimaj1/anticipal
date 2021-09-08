const React = require('react');

const PhotoPreview = require('./PhotoPreview');

class PhotoPreviewList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      this.props.data.map((item, i) => {
        return (
          <PhotoPreview key={item.id}
                        data={item}
                        user={this.props.user}
                        reactions={this.props.reactions}
                        modifiers={this.props.modifiers}
                        selectable={this.props.selectable}
                        selected={this.props.selectedItems[i]}
                        toggleSelectableActive={() => {this.props.toggleSelectableActive(i);}}
          />
        );
      })
    );
  }
}

module.exports = PhotoPreviewList;