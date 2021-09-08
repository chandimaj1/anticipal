const React = require('react');

const PictureCollageItem = require('./PictureCollageItem');

class PictureCollageRow extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={`picture-collage-row ${this.props.modifiers || ''}`}>
        {
          this.props.data.map((item) => {
            return (
              <PictureCollageItem key={item.id}
                                  data={item}
                                  user={this.props.user}
                                  reactions={this.props.reactions}
                                  noPopup={this.props.noPopup}
              />
            );
          })
        }
      </div>
    );
  }
}

module.exports = PictureCollageRow;