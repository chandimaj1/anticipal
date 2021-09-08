const React = require('react');

const IconSVG = require('../icon/IconSVG');

class UploadableMediaItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="uploadable-item" style={{background: `url('${this.props.data.url}') center center / cover no-repeat`}}>
        <div className="uploadable-item-remove-button" onClick={this.props.onRemoveButtonClick}>
          <IconSVG  icon="cross"
                    modifiers="uploadable-item-remove-button-icon"
          />
        </div>
      </div>
    );
  }
}

module.exports = UploadableMediaItem;