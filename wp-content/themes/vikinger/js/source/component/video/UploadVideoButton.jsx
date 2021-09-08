const React = require('react');

const plugins = require('../../utils/plugins'),
      IconSVG = require('../icon/IconSVG');

class UploadVideoButton extends React.Component {
  constructor(props) {
    super(props);

    this.fileID = 1;

    this.allowedExtensions = `.${vikinger_constants.settings.media_video_allowed_extensions.join(',.')}`;
    
    this.fileInputRef = React.createRef();
    this.videoTooltipRef = React.createRef();

    this.uploadFiles = this.uploadFiles.bind(this);
  }

  uploadFiles() {
    const files = this.fileInputRef.current.files;

    // console.log('UPLOAD VIDEO BUTTON - UPLOAD FILES: ', files);

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

    // console.log('UPLOAD VIDEO BUTTON - FILE DATA: ', fileData);

    this.props.onSelect && this.props.onSelect(fileData);
  }

  componentDidMount() {
    plugins.createTooltip({
      containerElement: this.videoTooltipRef.current,
      offset: 8,
      direction: 'top',
      animation: {
        type: 'translate-out-fade'
      }
    });
  }

  render() {
    return (
      <div  className="quick-post-footer-action" 
            ref={this.videoTooltipRef} 
            data-title={vikinger_translation.add_video} 
            onClick={() => {this.fileInputRef.current.click();}}
      >
        {/* UPLOADABLE ITEM SELECTOR INPUT */}
        <input  ref={this.fileInputRef}
                className="uploadable-item-selector-input"
                type="file"
                accept={this.allowedExtensions}
                onChange={this.uploadFiles}
        />
        {/* UPLOADABLE ITEM SELECTOR INPUT */}
        
        <IconSVG  icon="videos"
                  modifiers="quick-post-footer-action-icon"
        />
      </div>
    );
  }
}

module.exports = UploadVideoButton;