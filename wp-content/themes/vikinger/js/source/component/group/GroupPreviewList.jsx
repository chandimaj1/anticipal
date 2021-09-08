const React = require('react');

const GroupPreview = require('./GroupPreview'),
      GroupPreviewBig = require('./GroupPreviewBig'),
      GroupPreviewSmall = require('./GroupPreviewSmall'),
      Grid_4 = require('../grid/Grid_4'),
      Grid_3 = require('../grid/Grid_3'),
      Grid = require('../grid/Grid'),
      Notification = require('../notification/Notification');

class GroupPreviewList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let grid, groups;

    // if there are groups
    if (this.props.data.length) {
      if (this.props.gridType === 'big') {
        groups = this.props.data.map((group) => {
          return (
            <GroupPreviewBig key={group.id} data={group} loggedUser={this.props.loggedUser} onActionComplete={this.props.onActionComplete} />
          );
        });
  
        grid = <Grid_4 content={groups} />;
      } else if (this.props.gridType === 'small') {
        groups = this.props.data.map((group) => {
          return (
            <GroupPreview key={group.id} data={group} loggedUser={this.props.loggedUser} onActionComplete={this.props.onActionComplete} />
          );
        });
  
        grid = <Grid_3 content={groups} />;
      } else if (this.props.gridType === 'list') {
        groups = this.props.data.map((group) => {
          return (
            <GroupPreviewSmall key={group.id} data={group} loggedUser={this.props.loggedUser} onActionComplete={this.props.onActionComplete} />
          );
        });
  
        grid = <Grid content={groups} />;
      }
    } else {
      grid = <Notification title={vikinger_translation.group_no_results_title} text={vikinger_translation.group_no_results_text} />;
    }

    return grid;
  }
}

module.exports = GroupPreviewList;