const React = require('react');

const PagerItem = require('./PagerItem'),
      SliderControl = require('../controls/SliderControl');

class Pager extends React.Component {
  constructor(props) {
    super(props);

    this.pageClicked = this.pageClicked.bind(this);
    this.previousPage = this.previousPage.bind(this);
    this.nextPage = this.nextPage.bind(this);

    this.pagerLength = 3;
  }

  pageClicked(pageNumber) {
    // console.log('CLICKED PAGE: ', pageNumber);
    this.props.showPage(pageNumber);
  }

  previousPage() {
    if (this.props.activePage !== 1) {
      // console.log('SHOW PREVIOUS PAGE');
      this.props.showPage(this.props.activePage - 1);
    }
  }

  nextPage() {
    if (this.props.activePage !== this.props.pageCount) {
      // console.log('SHOW NEXT PAGE');
      this.props.showPage(this.props.activePage + 1);
    }
  }

  render() {
    const pages = [];

    let startPage,
        endPage;

    // if page count is lower than pager length, then show all pages
    if (this.props.pageCount < this.pagerLength) {
      startPage = 1;
      endPage = this.props.pageCount;
    } else if ((this.props.activePage + this.pagerLength - 1) < this.props.pageCount) {
    // if active page plus pager length is lower than last page, show active page first
      startPage = this.props.activePage;
      endPage = this.props.activePage + this.pagerLength - 1;
    } else {
    // if active page plus pager length is higher than last page, show last page minus pager length first
      startPage = this.props.pageCount - this.pagerLength + 1;
      endPage = this.props.pageCount;
    }

    // console.log('PAGER - START PAGE: ', startPage);
    // console.log('PAGER - END PAGE: ', endPage);

    // show go to first page
    // if (this.props.activePage > 2) {
    //   pages.push(<SliderControl direction='left' double={true} disabled={this.props.activePage === 1} controlClicked={() => { this.pageClicked(1); }} />);
    // }

    // show go previous page
    if (this.props.activePage > 1) {
      pages.push(<SliderControl direction='left' disabled={this.props.activePage === 1} controlClicked={this.previousPage} />);
    }

    // show pagerLength pages
    for (let i = startPage; i <= endPage; i++) {
      pages.push(<PagerItem key={i} pageNumber={i} active={this.props.activePage === i} pageClicked={this.pageClicked} />);
    }

    // show go to next page
    if (this.props.activePage !== this.props.pageCount) {
      pages.push(<SliderControl direction='right' disabled={this.props.activePage === this.props.pageCount} controlClicked={this.nextPage} />);
    }

    // show go to last page
    // if (this.props.activePage < this.props.pageCount - 1) {
    //   pages.push(<SliderControl direction='right' double={true} disabled={this.props.activePage === this.props.pageCount} controlClicked={() => { this.pageClicked(this.props.pageCount); }} />);
    // }

    return (
      <div className="section-pager-bar-wrap align-center">
        <div className="section-pager-bar">
          <div className={`section-pager ${this.props.themeColor}`}>
          { pages }
          </div>
        </div>
      </div>
    );
  }
}

module.exports = Pager;