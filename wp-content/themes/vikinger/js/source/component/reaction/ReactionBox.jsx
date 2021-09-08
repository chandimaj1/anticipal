const React = require('react');

const app = require('../../utils/core');

const UserStatusList = require('../user-status/UserStatusList');

class ReactionBox extends React.Component {
  constructor(props) {
    super(props);

    this.activeTabSelector = 'active';
  }

  render() {
    let allReactionUsers = [];

    for (const reaction of this.props.data) {
      const users = [];

      for (const user of reaction.users) {
        const userReaction = {};
        app.deepExtend(userReaction, user);
        userReaction.reaction = {};
        userReaction.reaction.id = reaction.id;
        userReaction.reaction.name = reaction.name;
        userReaction.reaction.image_url = reaction.image_url;

        users.push(userReaction);
      }

      // allReactionUsers = allReactionUsers.concat(reaction.users);
      allReactionUsers = allReactionUsers.concat(users);
    }

    // console.log('REACTION BOX - REACTION USERS: ', allReactionUsers);

    // const reactions = this.props.data.slice().reverse();

    const reactions = [];

    for (const reaction of this.props.data.slice().reverse()) {
      const users = [];

      for (const user of reaction.users) {
        const userReaction = {};
        app.deepExtend(userReaction, user);
        userReaction.reaction = {};
        userReaction.reaction.id = reaction.id;
        userReaction.reaction.name = reaction.name;
        userReaction.reaction.image_url = reaction.image_url;

        users.push(userReaction);
      }

      reaction.users = users;
      reactions.push(reaction);
    }

    // console.log('REACTION BOX - REACTIONS: ', reactions);

    return (
      <div ref={this.props.forwardedRef} className="reaction-box">
        <div className="reaction-box-options">
          <div className={`reaction-box-option ${(this.props.activeTab === 0) && this.activeTabSelector}`} onClick={() => {this.props.showTab(0);}}>
            <p className="reaction-box-option-text">{`${vikinger_translation.all}: ${this.props.reactionCount}`}</p>
          </div>

        {
          reactions.map((reaction, i) => {
            return (
              <div key={reaction.id} className={`reaction-box-option ${(this.props.activeTab === (i + 1)) && this.activeTabSelector}`} onClick={() => {this.props.showTab(i + 1);}}>
                <img className="reaction-box-option-image" src={reaction.image_url} alt={`reaction-${reaction.name}`} />
                <p className="reaction-box-option-text">{reaction.reaction_count}</p>
              </div>
            );
          })
        }
        </div>

        <div className="reaction-box-content">
        {
          this.props.activeTab === 0 &&
            <div className="reaction-box-item" data-simplebar>   
              <UserStatusList data={allReactionUsers}
                              showVerifiedBadge={vikinger_constants.settings.bp_verified_member_display_badge_in_members_lists} />
            </div>
        }
        {
          reactions.map((reaction, i) => {
            return (
              (this.props.activeTab === (i + 1)) &&
                <div key={reaction.id} className="reaction-box-item" data-simplebar>   
                  <UserStatusList data={reaction.users}
                                  showVerifiedBadge={vikinger_constants.settings.bp_verified_member_display_badge_in_members_lists} />
                </div>
            );
          })
        }
        </div>
      </div>
    );
  }
}

const ReactionBoxForwardRef = React.forwardRef((props, ref) => {
  return (
    <ReactionBox {...props} forwardedRef={ref} />
  )
});

module.exports = ReactionBoxForwardRef;