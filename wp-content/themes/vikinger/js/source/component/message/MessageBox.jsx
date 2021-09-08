const React = require('react');

const IconSVG = require('../icon/IconSVG');

class MessageBox extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let iconColor = 'secondary',
        iconType = 'info';

    if (this.props.success) {
      iconColor = 'primary';
      iconType = 'success';
    } else if (this.props.error) {
      iconColor = 'tertiary';
      iconType = 'error';
    } else if (this.props.warning) {
      iconColor = 'tertiary';
    }

    return (
      <div ref={this.props.forwardedRef} className={`message-box ${(this.props.confirm || this.props.continue) ? 'no-padding-bottom' : ''}`}>
        {/* MESSAGE BOX ICON WRAP */}
        <div className={`message-box-icon-wrap ${iconColor}`}>
          <IconSVG  icon={iconType}
                    modifiers="message-box-icon"
          />
        </div>
        {/* MESSAGE BOX ICON WRAP */}

        <p className="message-box-title">{this.props.data.title}</p>
        <p className="message-box-text">{this.props.data.text}</p>

        {
          this.props.confirm &&
            <div className="message-box-actions">
              <p className="message-box-action button white" onClick={this.props.onCancel}>{vikinger_translation.cancel}</p>
              <p className="message-box-action button secondary" onClick={this.props.onAccept}>{vikinger_translation.accept}</p>
            </div>
        }

        {
          this.props.continue &&
            <div className="message-box-actions">
              <p className="message-box-action button secondary" onClick={this.props.onContinue}>{vikinger_translation.continue}</p>
            </div>
        }
      </div>
    );
  }
}

const MessageBoxForwardRef = React.forwardRef((props, ref) => {
  return (
    <MessageBox {...props} forwardedRef={ref} />
  )
});

module.exports = MessageBoxForwardRef;