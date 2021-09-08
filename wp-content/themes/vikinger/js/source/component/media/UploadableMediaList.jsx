const React = require('react');

const UploadableMediaItem = require('./UploadableMediaItem'),
      UploadableMediaSelector = require('./UploadableMediaSelector');

class UploadableMediaList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={`uploadable-item-list ${this.props.disabled ? 'disabled' : ''}`}>
        {
          this.props.data.map((item) => {
            return (
              <UploadableMediaItem key={item.id} data={item} onRemoveButtonClick={() => {this.props.onRemove(item.id);}} />
            );
          })
        }
        <UploadableMediaSelector onSelect={this.props.onSelect} />
      </div>
    );
  }
}

module.exports = UploadableMediaList;