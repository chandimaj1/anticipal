const React = require('react');

const app = require('../../utils/core'),
      plugins = require('../../utils/plugins');

const ContentActions = require('../content-actions/ContentActions'),
      IconSVG = require('../icon/IconSVG');

class PostGalleryPreview extends React.Component {
  constructor(props) {
    super(props);

    this.galleryPopupRef = React.createRef();
    this.gallerySliderRef = React.createRef();
    this.gallerySlider = undefined;

    this.titleWordLimit = 75;
    this.excerptWordLimit = 220;

    this.categories = props.data.categories.slice(0, 3);
  }

  componentDidMount() {
    if (!this.props.sharePopupActivity) {
      plugins.createPopup({
        triggerElement: this.galleryPopupRef.current,
        type: 'gallery'
      });
  
      this.gallerySlider = plugins.createSlider(this.gallerySliderRef.current, {
        navigation: {
          prevEl: '.slider-control.left',
          nextEl: '.slider-control.right'
        },
        loop: true,
        effect: 'fade',
        speed: 800,
        fadeEffect: {
          crossFade: true
        },
        autoplay: {
          delay: 5000
        }
      });
    }
  }

  componentWillUnmount() {
    if (this.gallerySlider) {
      // Destroy slider instance and detach all events listeners
      this.gallerySlider.destroy();
    }
  }

  render() {
    const galleryData = [];

    for (const image of this.props.data.gallery) {
      galleryData.push(image.url);
    }

    return (
      <div className="post-preview post-preview-type-gallery animate-slide-down">
      {
        !this.props.sharePopupActivity &&
          <React.Fragment>
            {/* GALLERY POPUP BUTTON */}
            <div ref={this.galleryPopupRef} className="gallery-popup-button" data-gallery={JSON.stringify(galleryData)}>
              <IconSVG icon="gallery" />
            </div>
            {/* GALLERY POPUP BUTTON */}

            {/* POST PREVIEW GALLERY */}
            <div ref={this.gallerySliderRef} className="post-preview-gallery swiper-container">
              <div className="post-preview-gallery-slider swiper-wrapper">
                {
                  this.props.data.gallery.map((galleryItem => {
                    return (
                      <div key={galleryItem.id} className="post-preview-gallery-slider-item swiper-slide" style={{background: `url(${galleryItem.url}) center center / cover no-repeat`}}></div>
                    );
                  }))
                }
              </div>

              {/* POST PREVIEW GALLERY CONTROLS */}
              <div className="post-preview-gallery-controls">
                {/* SLIDER CONTROL */}
                <div className="slider-control medium solid left">
                  <IconSVG  icon="small-arrow"
                            modifiers="slider-control-icon"
                  />
                </div>
                {/* SLIDER CONTROL */}
          
                {/* SLIDER CONTROL */}
                <div className="slider-control medium solid right">
                  <IconSVG  icon="small-arrow"
                            modifiers="slider-control-icon"
                  />
                </div>
                {/* SLIDER CONTROL */}
              </div>
              {/* POST PREVIEW GALLERY CONTROLS */}
            </div>
            {/* POST PREVIEW GALLERY */}
          </React.Fragment>
      }
      {
        this.props.sharePopupActivity &&
          <div className="post-preview-gallery">
            <div className="post-preview-gallery-slider">
              <div className="post-preview-gallery-slider-item" style={{background: `url(${this.props.data.gallery[0].url}) center center / cover no-repeat`}}></div>
            </div>
          </div>
      }
        
        {/* POST PREVIEW INFO */}
        <div className="post-preview-info fixed-height">
          <div className="post-preview-info-top">
            <p className="post-preview-timestamp">
              {
                this.categories.map((category) => {
                  return (
                    <span key={category.id}><a href={category.link}>{category.name}</a> - </span>
                  );
                })
              }
              {this.props.data.timestamp}
            </p>
            <p className="post-preview-title"><a href={this.props.data.permalink}>{app.truncateText(this.props.data.title, this.titleWordLimit)}</a></p>
          </div>
          <div className="post-preview-info-bottom">
            <p className="post-preview-text" dangerouslySetInnerHTML={{__html: app.truncateText(this.props.data.excerpt, this.excerptWordLimit)}}></p>
            <a className="post-preview-link" href={this.props.data.permalink}>{vikinger_translation.read_more}</a>
          </div>
        </div>
        {/* POST PREVIEW INFO */}

        {/* CONTENT ACTIONS */}
        {
          !this.props.sharePopupActivity &&
            <ContentActions reactionData={this.props.data.reactions}
                            link={this.props.data.permalink}
                            commentCount={this.props.data.comment_count}
                            shareCount={this.props.data.share_count}
            />
        }
        {/* CONTENT ACTIONS */}
      </div>
    );
  }
}

module.exports = PostGalleryPreview;