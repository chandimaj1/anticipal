const React = require('react');

const app = require('../../utils/core');

class Reactionable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      reactionData: props.reactionData,
      userReaction: false
    };

    this.createUserReaction = this.createUserReaction.bind(this);
    this.deleteUserReaction = this.deleteUserReaction.bind(this);
  }

  createUserReaction(reaction_id) {
    // console.log('REACTIONABLE - CREATE USER REACTION: ', reaction_id);

    if (this.state.userReaction && (this.state.userReaction.id == reaction_id)) {
      // reaction already selected
      return;
    }

    // console.log('REACTIONABLE - CREATE WITH: ', this.props.entityData);

    const config = {
      user_id: this.props.user.id,
      reaction_id: reaction_id
    };

    app.deepExtend(config, this.props.entityData);

    // create user reaction
    this.props.createUserReaction(config, (response) => {
      // console.log('REACTIONABLE - CREATE USER REACTION: ', response);

      // check if created correctly
    });

    // remove other reaction from this user on this activity if exists
    // and reduce reaction count
    this.deleteUserReactionStatic();

    // add reaction from this user to this activity
    // and increse reaction count
    this.createUserReactionStatic(reaction_id);

    // get created user reaction
    this.getUserReaction();

    // sort user reactions
    this.sortUserReactions();
  }

  deleteUserReaction() {
    // console.log('REACTIONABLE - DELETE USER REACTION: ', this.state.userReaction);

    const config = {
      user_id: this.props.user.id
    };

    app.deepExtend(config, this.props.entityData);

    // delete user reaction
    this.props.deleteUserReaction(config, (response) => {
      // console.log('REACTIONABLE - DELETE USER REACTION: ', response);

      // check if deleted correctly
    });

    // remove other reaction from this user on this activity if exists
    // and reduce reaction count
    this.deleteUserReactionStatic();

    this.setState({
      userReaction: false
    });

    // sort user reactions
    this.sortUserReactions();
  }

  deleteUserReactionStatic() {
    this.setState((state, props) => {
      const reactions = [];
      app.deepExtend(reactions, state.reactionData);

      for (let i = 0; i < state.reactionData.length; i++) {
        const reaction = state.reactionData[i];

        for (let j = 0; j < reaction.users.length; j++) {
          const user = reaction.users[j];
          // found user
          if (user.id == this.props.user.id) {
            // console.log('FOUND USER: ', user);

            // decrease reaction count
            const newReactionCount = Number.parseInt(reaction.reaction_count, 10) - 1;

            // if last reaction of this type
            if (newReactionCount === 0) {
              // remove reaction
              reactions.splice(i, 1);
            } else {
              // remove user
              reactions[i].users.splice(j, 1);
              // decrease reaction count
              reactions[i].reaction_count = newReactionCount + '';
            }

            // console.log('DELETE MODIFIED REACTION DATA: ', reactions);

            return {
              reactionData: reactions
            };
          }
        }
      }
    });
  }

  sortUserReactions(order = 'DESC') {
    this.setState((state, props) => {
      const reactionData = [];
      app.deepExtend(reactionData, state.reactionData);

      const sortedReactionData = reactionData.sort((firstEl, secondEl) => {
        if (firstEl.reaction_count < secondEl.reaction_count) {
          // console.log(firstEl.reaction_count + '<' + secondEl.reaction_count);
          return -1;
        }

        if (firstEl.reaction_count > secondEl.reaction_count) {
          // console.log(firstEl.reaction_count + '>' + secondEl.reaction_count);
          return 1;
        }

        return 0;
      });

      // console.log('REACTIONABLE - SORTED REACTION DATA: ', sortedReactionData);

      return {
        reactionData: sortedReactionData
      };
    });
  }

  createUserReactionStatic(reaction_id) {
    this.setState((state, props) => {
      const reactions = [];

      app.deepExtend(reactions, state.reactionData);

      for (let i = 0; i < state.reactionData.length; i++) {
        const reaction = state.reactionData[i];

        // found reaction
        if (reaction.id == reaction_id) {
          // increase reaction count
          reactions[i].reaction_count = (Number.parseInt(reactions[i].reaction_count, 10) + 1) + '';
          // add user
          reactions[i].users.push(this.props.user);

          // console.log('CREATE MODIFIED REACTION DATA: ', reactions);

          return {
            reactionData: reactions
          };
        }
      }

      // reaction not found, create it
      for (const reaction of this.props.reactions) {
        // reaction found
        if (reaction.id == reaction_id) {
          const newReaction = {};
          app.deepExtend(newReaction, reaction);
          newReaction.reaction_count = '1';
          newReaction.users = [];
          newReaction.users.push(this.props.user);

          reactions.unshift(newReaction);

          // console.log('CREATE MODIFIED REACTION DATA: ', reactions);

          return {
            reactionData: reactions
          };
        }
      }
    });
  }

  getUserReaction() {
    this.setState((state, props) => {
      for (const reaction of state.reactionData) {
        for (const user of reaction.users) {
          // user found
          if (user.id == this.props.user.id) {
            return {
              userReaction: {
                id: reaction.id,
                image_url: reaction.image_url,
                name: reaction.name
              }
            };
          }
        }
      }

      return {};
    });
  }

  componentDidMount() {
    if (this.props.user) {
      this.getUserReaction();
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.user !== this.props.user) {
      this.getUserReaction();
    }
  }

  render() {
    return (
      this.props.children(this.state.reactionData, this.state.userReaction, this.createUserReaction, this.deleteUserReaction)
    );
  }
}

module.exports = Reactionable;