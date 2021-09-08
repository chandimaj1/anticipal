const React = require('react');

const AvatarMicro = require('../avatar/AvatarMicro');

class MentionItem extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.props.onClick(this.props.data);
  }

  render() {
    const wrapSearchTextRegex = new RegExp(this.props.searchText, 'igm'),
          name = this.props.data.mention_name,
          wrappedName = this.props.searchText === '' ? this.props.data.mention_name : name.replace(wrapSearchTextRegex, '<span class="highlighted">$&</span>');

    return (
      <div className={`mention-list-item ${this.props.active ? 'active' : ''}`} onClick={this.handleClick} onMouseEnter={this.props.activateItem}>
        <AvatarMicro data={this.props.data} noBorder noLink />
        <p className="mention-list-item-text" dangerouslySetInnerHTML={{__html: `@${wrappedName}`}}></p>
      </div>
    );
  }
}

module.exports = MentionItem;