const React = require('react')

const plugins = require('../../utils/plugins');

const LoaderSpinnerSmall = require('../loader/LoaderSpinnerSmall'),
      IconSVG = require('../icon/IconSVG');

class ActionRequest extends React.Component {
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
      <div ref={this.tooltipRef} className={`action-request ${this.props.type}`} data-title={this.props.title} onClick={this.props.onClick}>
        {
          !this.props.loading &&
            <IconSVG  icon={this.props.icon}
                      modifiers="action-request-icon"
            />
        }
        {
          this.props.loading &&
            <LoaderSpinnerSmall />
        }
      </div>
    );
  }
}

module.exports = ActionRequest;