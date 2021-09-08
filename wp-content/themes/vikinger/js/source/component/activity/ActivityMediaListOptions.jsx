const React = require('react');

const plugins = require('../../utils/plugins');

const LoaderSpinnerSmall = require('../loader/LoaderSpinnerSmall');

class ActivityMediaListOptions extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      processingDelete: false
    };

    this.uploadPhotoBoxTriggerRef = React.createRef();
    this.uploadPhotoBoxRef = React.createRef();

    this.deleteSelected = this.deleteSelected.bind(this);
  }

  deleteSelected() {
    this.setState({
      processingDelete: true
    });

    this.props.deleteSelected(() => {
      this.setState({
        processingDelete: false
      });
    });
  }

  componentDidMount() {
    this.popup = plugins.createPopup({
      triggerElement: this.uploadPhotoBoxTriggerRef.current,
      premadeContentElement: this.uploadPhotoBoxRef.current,
      type: 'premade',
      popupSelectors: ['upload-box-popup', 'animate-slide-down'],
      onOverlayCreate: function (overlay) {
        overlay.setAttribute('data-simplebar', '');
      }
    });
  }

  render() {
    const ActivityUploadForm = this.props.activityUploadForm;

    return (
      <div className="item-list-options">
        <div className="item-list-option-wrap">
          <p ref={this.uploadPhotoBoxTriggerRef} className="item-list-option">{this.props.uploadButtonText}</p>
          <ActivityUploadForm ref={this.uploadPhotoBoxRef}
                              user={this.props.user}
                              postIn={this.props.postIn}
                              onSubmit={this.props.onUpload}
                              popup={this.popup}
          />
        </div>
        {
          this.props.allowDelete && (this.props.activities.length > 0) &&
            <React.Fragment>
            {
              this.props.activitiesSelected() &&
                <div className="item-list-option-wrap">
                  <p className="item-list-option" onClick={this.deleteSelected}>{vikinger_translation.delete}</p>
                  {
                    this.state.processingDelete &&
                      <LoaderSpinnerSmall />
                  }
                </div>
            }
              <p className="item-list-option" onClick={this.props.toggleAllSelectable}>{!this.props.selectedAll ? vikinger_translation.select_all : vikinger_translation.unselect_all}</p>
            </React.Fragment>
        }
      </div>
    );
  }
}

module.exports = ActivityMediaListOptions;