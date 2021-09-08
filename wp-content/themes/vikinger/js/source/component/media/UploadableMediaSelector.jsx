const React = require('react');

const plugins = require('../../utils/plugins'),
      IconSVG = require('../icon/IconSVG');

class UploadableMediaSelector extends React.Component {
  constructor(props) {
    super(props);

    this.fileID = 1;

    this.allowedExtensions = `.${vikinger_constants.settings.media_photo_allowed_extensions.join(',.')}`;
    
    this.fileInputRef = React.createRef();
    this.selectorButtonRef = React.createRef();

    this.uploadFiles = this.uploadFiles.bind(this);
  }

  uploadFiles() {
    const files = this.fileInputRef.current.files;

    // console.log('UPLOADABLE MEDIA SELECTOR - UPLOAD FILES: ', files);

    const fileData = [];
    
    for (const file of files) {
      const fileExtension = file.name.substring(file.name.lastIndexOf('.') + 1);

      fileData.push({
        id: this.fileID,
        file: new File([file], file.name),
        url: URL.createObjectURL(file),
        extension: fileExtension
      });

      this.fileID++;
    }

    this.props.onSelect(fileData);
  }

  componentDidMount() {
    plugins.createTooltip({
      containerElement: this.selectorButtonRef.current,
      offset: 8,
      direction: 'top',
      animation: {
        type: 'translate-out-fade'
      }
    });
  }

  render() {
    return (
      <div className="uploadable-item-selector">
        {/* UPLOADABLE ITEM SELECTOR INPUT */}
        <input  ref={this.fileInputRef}
                className="uploadable-item-selector-input"
                type="file"
                accept={this.allowedExtensions}
                multiple
                onChange={this.uploadFiles}
        />
        {/* UPLOADABLE ITEM SELECTOR INPUT */}
      
        {/* UPLOADABLE ITEM SELECTOR BUTTON */}
        <div  ref={this.selectorButtonRef}
              className="uploadable-item-selector-button"
              onClick={() => {this.fileInputRef.current.click();}}
              data-title={vikinger_translation.upload_photo}
        >
          <IconSVG  icon="plus-small"
                    modifiers="uploadable-item-selector-button-icon"
          />
        </div>
        {/* UPLOADABLE ITEM SELECTOR BUTTON */}
      </div>
    );
  }
}

module.exports = UploadableMediaSelector;