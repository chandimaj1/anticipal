const React = require('react');

const IconSVG = require('../icon/IconSVG');

class HeaderDropdown extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false
    };

    this.toggleDropdown = this.toggleDropdown.bind(this);
    this.closeDropdown = this.closeDropdown.bind(this);
  }

  toggleDropdown() {
    this.setState((state, props) => {
      return {
        open: !state.open
      };
    });
  }

  closeDropdown() {
    this.setState({
      open: false
    });
  }

  render() {
    return (
      <div className="action-list-item-wrap" tabIndex="0" onBlur={this.closeDropdown}>
        {/* DROPDOWN TRIGGER */}
        <div className={`action-list-item ${this.props.unread ? 'unread' : ''}`} onClick={this.toggleDropdown}>
          <IconSVG icon={this.props.icon} modifiers="action-list-item-icon" />
        </div>
        {/* DROPDOWN TRIGGER */}

        {/* DROPDOWN BOX */}
        <div  className="dropdown-box"
              style={{
                position: 'absolute',
                top: '64px',
                right: '6px',
                transition: 'transform .4s ease-in-out, opacity .4s ease-in-out, visibility .4s ease-in-out',
                opacity: this.state.open ? 1 : 0,
                visibility: this.state.open ? 'visible' : 'hidden',
                transform: this.state.open ? 'translate(0, 0)' : 'translate(0, -40px)'
              }}
        >
        { this.props.children }
        </div>
        {/* DROPDOWN BOX */}
      </div>
    );
  }
}

module.exports = HeaderDropdown;