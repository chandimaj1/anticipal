const React = require('react');

const app = require('../../utils/core'),
      plugins = require('../../utils/plugins');

const ReactionBox = require('../reaction/ReactionBox');

class ReactionItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      reactionBoxActiveTab: 0
    };

    this.reactionDropdownTriggerRef = React.createRef();
    this.reactionDropdownContentRef = React.createRef();

    this.reactionBoxRef = React.createRef();
    this.reactionBoxTriggerRef = React.createRef();

    this.setReactionBoxActiveTab = this.setReactionBoxActiveTab.bind(this);
  }

  setReactionBoxActiveTab(i) {
    this.setState({
      reactionBoxActiveTab: i
    });

    // console.log('REACTION ITEM - SET ACTIVE TAB: ', i);
  }

  componentDidMount() {
    plugins.createDropdown({
      triggerElement: this.reactionDropdownTriggerRef.current,
      containerElement: this.reactionDropdownContentRef.current,
      triggerEvent: 'hover',
      offset: {
        bottom: 38,
        left: -16
      },
      animation: {
        type: 'translate-bottom',
        speed: .3,
        translateOffset: {
          vertical: 20
        }
      }
    });

    plugins.createPopup({
      triggerElement: this.reactionBoxTriggerRef.current,
      premadeContentElement: this.reactionBoxRef.current,
      type: 'premade',
      popupSelectors: ['reaction-box-popup', 'animate-slide-down']
    });

    this.reactionBoxTriggerRef.current.addEventListener('mousedown', () => {
      this.setReactionBoxActiveTab(this.props.index);
    });
  }

  render() {
    const reactionUsers = [],
          maxReactionUsers = 6,
          reactionUsersCount = Math.min(maxReactionUsers, this.props.data.users.length),
          moreUsersCount = this.props.data.users.length <= maxReactionUsers ? false : this.props.data.users.length - maxReactionUsers;
    
    for (let i = 0; i < reactionUsersCount; i++) {
      reactionUsers.push(
        <p key={this.props.data.users[i].id} className="simple-dropdown-text">{this.props.data.users[i].name}</p>
      );
    }

    return (
      <div className="reaction-item-wrap">
        <div ref={this.reactionBoxTriggerRef} className="reaction-item">
          <img ref={this.reactionDropdownTriggerRef} className="reaction-image" src={this.props.data.image_url} alt={`reaction-${this.props.data.name}`} />

          <div ref={this.reactionDropdownContentRef} className="simple-dropdown padded">
            <p className="simple-dropdown-text">
              <img className="reaction" src={this.props.data.image_url} alt={`reaction-${this.props.data.name}`} />
              <span className="bold">{app.capitalizeText(this.props.data.name)}</span>
            </p>

            { reactionUsers }
            
            {
              moreUsersCount &&
            <p className="simple-dropdown-text"><span className="bold">{`${vikinger_translation.more_reactions_text_1} ${moreUsersCount} ${vikinger_translation.more_reactions_text_2}`}</span></p>
            }
            
          </div>
        </div>

        <ReactionBox  ref={this.reactionBoxRef}
                      data={this.props.reactionData}
                      reactionCount={this.props.reactionCount}
                      activeTab={this.state.reactionBoxActiveTab}
                      showTab={this.setReactionBoxActiveTab}
        />
      </div>
    );
  }
}

module.exports = ReactionItem;