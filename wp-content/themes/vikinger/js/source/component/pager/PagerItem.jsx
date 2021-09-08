const React = require('react');

class PagerItem extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.props.pageClicked(this.props.pageNumber);
  }

  render() {
    return (
      <div className={`section-pager-item ${this.props.static ? 'section-pager-item-no-link' : ''} ${this.props.active ? 'active' : ''}`} onClick={this.handleClick}>
        <p className="section-pager-item-text">{this.props.pageNumber < 10 ? `0${this.props.pageNumber}` : this.props.pageNumber}</p>
      </div>
    );
  }
}

module.exports = PagerItem;