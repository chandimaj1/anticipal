const React = require('react');

const Loader = require('../loader/Loader');

class ScrollPager extends React.Component {
  constructor(props) {
    super(props);

    this.loaderRef = React.createRef();
    
    this.loadMoreOnScroll = this.loadMoreOnScroll.bind(this);
  }

  scrolledThrough(el) {
    const elementScrollPosition = {
            y: el.offsetTop + el.offsetHeight - window.innerHeight
          },
          windowScrollPosition = {
            y: window.scrollY
          };

    return windowScrollPosition.y > elementScrollPosition.y;
  }

  loadMoreOnScroll() {
    // console.log('SCROLL PAGER - LOAD MORE ON SCROLL: ', this.loaderRef.current);

    if (this.scrolledThrough(this.loaderRef.current)) {
      window.removeEventListener('scroll', this.loadMoreOnScroll);
      this.loadMoreItems();
    }
  }

  loadMoreItems() {
    this.props.loadMoreItems((moreItems) => {
      if (moreItems) {
        window.addEventListener('scroll', this.loadMoreOnScroll);
      }
    });
  }

  componentDidMount() {
    if (!this.props.initialFetch && this.props.moreItems) {
      window.addEventListener('scroll', this.loadMoreOnScroll);
    }
  }

  componentDidUpdate(prevProps) {
    // initial fetch finished, filter changed, or page reset
    if (prevProps.initialFetch !== this.props.initialFetch) {
      if (!this.props.initialFetch) {
        window.addEventListener('scroll', this.loadMoreOnScroll);
      }
    }
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.loadMoreOnScroll);
  }

  render() {
    return (
      <div ref={this.loaderRef} className={`${this.props.modifiers || ''}`}>
        { this.props.children }
        {
          this.props.moreItems &&
            <Loader />
        }
      </div>
    );
  }
}

module.exports = ScrollPager;