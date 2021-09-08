const React = require('react');

const SelectableUserStatus = require('../user-status/SelectableUserStatus');

class SelectableUserStatusList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="user-status-list user-status-list-3-cols">
      {
        this.props.data.map((user, i) => {
          return (
            <SelectableUserStatus key={user.id}
                                  data={user}
                                  loggedUser={this.props.loggedUser}
                                  selected={this.props.selectedItems[i]}
                                  toggleSelectableActive={() => {this.props.toggleSelectableActive(i);}}
            />
          );
        })
      }
      </div>
    );
  }
}

module.exports = SelectableUserStatusList;