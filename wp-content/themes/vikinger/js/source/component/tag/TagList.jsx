const React = require('react');

const Tag = require('./Tag');

class TagList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="tag-list">
        {
          this.props.tags.map((tag) => {
            return <Tag key={tag.id} name={tag.name} link={tag.link} />;
          })
        }
      </div>
    );
  }
}

module.exports = TagList;