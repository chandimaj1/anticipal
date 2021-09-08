const React = require('react');

const IconSVG = require('../icon/IconSVG');

class UploadBox extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: this.props.title,
      active: this.props.active || false
    }

    this.fileData = false;

    this.fileInputRef = React.createRef();

    this.updateFile = this.updateFile.bind(this);
  }

  updateFile() {
    const file = this.fileInputRef.current.files[0];

    // console.log('UPLOAD BOX - SELECTED FILE: ', file);

    // if no file selected (user clicked cancel)
    if (typeof file === 'undefined') {
      return;
    }

    // release previous blob image resource if exists
    if (this.fileData) {
      URL.revokeObjectURL(this.fileData.url);
      // console.log('UPLOAD BOX - REVOKE FILE URL: ', this.fileData.url);
    }

    // save new selected file
    this.fileData = {
      file: new File([file], file.name),
      url: URL.createObjectURL(file)
    };

    this.setState({
      title: file.name,
      active: true
    });

    this.props.onFileSelect(this.fileData);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.title !== this.props.title) {
      this.setState({
        title: this.props.title
      });
    }

    if (prevProps.active !== this.props.active) {
      this.setState({
        active: this.props.active
      });
    }
  }

  render() {
    return (
      <div className={`upload-box ${this.props.modifiers || ''} ${this.state.active ? 'active' : ''}`} onClick={() => {this.fileInputRef.current.click();}}>
        <IconSVG icon="members" modifiers="upload-box-icon" />
    
        <p className="upload-box-title">{this.state.title}</p>

        <p className="upload-box-text">{this.props.text}</p>

        <input ref={this.fileInputRef} className="upload-box-file-input" type="file" accept="image/png, image/jpeg" onChange={this.updateFile} />
      </div>
    );
  }
}

module.exports = UploadBox;