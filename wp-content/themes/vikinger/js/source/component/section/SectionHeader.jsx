const React = require('react');

class SectionHeader extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="section-header">
        {/* SECTION HEADER INFO */}
        <div className="section-header-info">
          <p className="section-pretitle">{this.props.pretitle}</p>
          <h2 className="section-title">
            {this.props.title}
            {
              (typeof this.props.titleCount !== 'undefined') &&
                <span className="highlighted">{` ${this.props.titleCount}`}</span>
            }
          </h2>
        </div>
        {/* SECTION HEADER INFO */}

        { this.props.children }
      </div>
    );
  }
}

module.exports = SectionHeader;