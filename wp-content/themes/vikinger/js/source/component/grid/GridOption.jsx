const React = require('react');

const plugins = require('../../utils/plugins');

const IconSVG = require('../icon/IconSVG');

class GridOption extends React.Component {
  constructor(props) {
    super(props);

    this.tooltipRef = React.createRef();
  }

  componentDidMount() {
    plugins.createTooltip({
      containerElement: this.tooltipRef.current,
      offset: 8,
      direction: 'top',
      animation: {
        type: 'translate-out-fade'
      }
    });
  }

  render() {
    return (
      <div  ref={this.tooltipRef}
            className={`view-action ${this.props.active ? 'active' : ''}`}
            data-title={vikinger_translation.grid_filter[this.props.type]}
            onClick={this.props.onClick}
      >
        <IconSVG  icon={`${this.props.type}-grid-view`}
                  modifiers="view-action-icon"
        />
      </div>
    );
  }
}

module.exports = GridOption;

