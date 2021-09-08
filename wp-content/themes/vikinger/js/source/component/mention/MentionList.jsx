const React = require('react');

const MentionItem = require('./MentionItem');

const SimpleBar = require('simplebar-react');

class MentionList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeUserIndex: 0
    };

    this.handleClick = this.handleClick.bind(this);
    this.userMatchCompareFunction = this.userMatchCompareFunction.bind(this);
    this.activateUser = this.activateUser.bind(this);
    this.activateUserOnKeyPressed = this.activateUserOnKeyPressed.bind(this);
    this.activatePreviousUserOnArrowUpPressed = this.activatePreviousUserOnArrowUpPressed.bind(this);
    this.activateNextUserOnArrowDownPressed = this.activateNextUserOnArrowDownPressed.bind(this);

    this.mentionListRef = React.createRef();

    this.simplebarStyles = { maxHeight: 140 };
  }

  handleClick(data) {
    this.props.onItemSelection(data, 'click');
  }

  activatePreviousUser() {
    this.setState((state, props) => {
      return {
        activeUserIndex: state.activeUserIndex === 0 ? this.userMatches.length - 1 : state.activeUserIndex - 1
      };
    });
  }

  activateNextUser() {
    this.setState((state, props) => {
      return {
        activeUserIndex: state.activeUserIndex === this.userMatches.length - 1 ? 0 : state.activeUserIndex + 1
      };
    });
  }

  activateUser(i) {
    this.setState({
      activeUserIndex: i
    });
  }

  activatePreviousUserOnArrowUpPressed(e) {
    // arrow up key pressed
    if (e.keyCode === 38) {
      this.activatePreviousUser();
    }
  }

  activateNextUserOnArrowDownPressed(e) {
    // arrow down key pressed
    if (e.keyCode === 40) {
      this.activateNextUser();
    }
  }

  activateUserOnKeyPressed(e) {
    // spacebar or enter key pressed
    if ((e.keyCode === 32) || (e.keyCode === 13)) {
      if (this.userMatches.length > 0) {
        this.props.onItemSelection(this.userMatches[this.state.activeUserIndex], 'keydown');
      }
    }
  }

  userMatchCompareFunction(a, b) {
    const aExec = (new RegExp(this.props.searchText, 'igm')).exec(a.mention_name),
          bExec = (new RegExp(this.props.searchText, 'igm')).exec(b.mention_name);

    if (aExec.index < bExec.index) {
      return -1;
    }

    if (aExec.index > bExec.index) {
      return 1;
    }

    return 0;
  };

  componentDidMount() {
    // console.log('MENTION LIST - POSITION DATA: ', this.props.positionData);
    // set mention dropdown position to cursor position
    this.mentionListRef.current.style.top = `${this.props.positionData.relTop + this.props.positionData.height}px`;
    this.mentionListRef.current.style.left = `${this.props.positionData.relLeft}px`;

    window.addEventListener('keydown', this.activateUserOnKeyPressed);
    window.addEventListener('keydown', this.activatePreviousUserOnArrowUpPressed);
    window.addEventListener('keydown', this.activateNextUserOnArrowDownPressed);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.activateUserOnKeyPressed);
    window.removeEventListener('keydown', this.activatePreviousUserOnArrowUpPressed);
    window.removeEventListener('keydown', this.activateNextUserOnArrowDownPressed);
  }

  componentDidUpdate(prevProps) {
    // if search text changed, reset active user
    if (prevProps.searchText !== this.props.searchText) {
      this.setState({
        activeUserIndex: 0
      });
    }
  }

  render() {
    // console.log('MENTION LIST - DATA: ', this.props.data);
    // console.log('MENTION LIST - SEARCH TEXT: ', this.props.searchText);
    
    this.userMatches = [];

    // get users that matches searchText
    for (const user of this.props.data) {
      const searchTextRegex = new RegExp(this.props.searchText, 'igm');
      
      if (searchTextRegex.test(user.mention_name)) {
        this.userMatches.push(user);
      }
    }

    // sort users that matched searchText by lower index
    this.userMatches.sort(this.userMatchCompareFunction);

    // console.log('MENTION LIST - USER MATCHES: ', this.userMatches);

    return (
      <div ref={this.mentionListRef} className="mention-list">
        <SimpleBar style={this.simplebarStyles}>
        {
          this.userMatches.map((user, i) => {
            return (
              <MentionItem  key={user.id}
                            data={user}
                            searchText={this.props.searchText}
                            onClick={this.handleClick}
                            active={this.state.activeUserIndex === i}
                            activateItem={() => {this.activateUser(i);}}
              />
            );
          })
        }
        {
          (this.userMatches.length === 0) &&
            <p className="mention-list-error-text">{vikinger_translation.no_members_found}</p>
        }
        </SimpleBar>
      </div>
    );
  }
}

module.exports = MentionList;