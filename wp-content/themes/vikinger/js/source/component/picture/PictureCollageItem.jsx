const React = require('react');

const PhotoPreview = require('./PhotoPreview');

class PictureCollageItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
        <div className="picture-collage-item">
          {
            (this.props.data.media.more > 0) &&
            <a className="picture-collage-item-overlay" href={this.props.data.media.more_link}>
              <p className="picture-collage-item-overlay-text">+{this.props.data.media.more}</p>
            </a>
          }

          <PhotoPreview data={this.props.data}
                        user={this.props.user}
                        reactions={this.props.reactions}
                        noPopup={(this.props.data.media.more) || (this.props.noPopup)}
          />
      </div>
    );
  }
}

module.exports = PictureCollageItem;