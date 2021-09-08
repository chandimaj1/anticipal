const React = require('react');

const plugins = require('../../utils/plugins');

class BadgeItem extends React.Component {
  constructor(props) {
    super(props);

    this.tooltipRef = React.createRef();
  }

  componentDidMount() {
    plugins.createTooltip({
      containerElement: this.tooltipRef.current,
      offset: 4,
      direction: 'top',
      animation: {
        type: 'translate-out-fade'
      }
    });
  }

  render() {
    return (
      <div ref={this.tooltipRef} className="badge-item" data-title={this.props.data.name}>
        <img src={this.props.data.image_url} alt={this.props.data.slug} />
      </div>
    );
  }
}

module.exports = BadgeItem;