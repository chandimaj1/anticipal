const React = require('react');

const MemberPreviewBig = require('./MemberPreviewBig'),
      MemberPreview = require('./MemberPreview'),
      MemberPreviewSmall = require('./MemberPreviewSmall'),
      Grid_4 = require('../grid/Grid_4'),
      Grid_3 = require('../grid/Grid_3'),
      Grid = require('../grid/Grid'),
      Notification = require('../notification/Notification');

class MemberPreviewList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let grid, members;

    // if there are members
    if (this.props.data.length) {
      if (this.props.gridType === 'big') {
        members = this.props.data.map((member) => {
          return (
            <MemberPreviewBig key={member.id} data={member} loggedUser={this.props.loggedUser} onActionComplete={this.props.onActionComplete} />
          );
        });
  
        grid = <Grid_4 content={members} />;
      } else if (this.props.gridType === 'small') {
        members = this.props.data.map((member) => {
          return (
            <MemberPreview key={member.id} data={member} loggedUser={this.props.loggedUser} onActionComplete={this.props.onActionComplete} />
          );
        });
  
        grid = <Grid_3 content={members} />;
      } else if (this.props.gridType === 'list') {
        members = this.props.data.map((member) => {
          return (
            <MemberPreviewSmall key={member.id} data={member} loggedUser={this.props.loggedUser} onActionComplete={this.props.onActionComplete} />
          );
        });
  
        grid = <Grid content={members} />;
      }
    } else {
      grid = <Notification title={vikinger_translation.member_no_results_title} text={vikinger_translation.member_no_results_text} />;
    }

    return grid;
  }
}

module.exports = MemberPreviewList;