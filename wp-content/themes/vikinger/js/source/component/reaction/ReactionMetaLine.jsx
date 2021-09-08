const React = require('react');

const plugins = require('../../utils/plugins');

const ReactionItemList = require('./ReactionItemList'),
      ReactionBox = require('./ReactionBox');

class ReactionMetaLine extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      reactionBoxActiveTab: 0
    };

    this.reactionBoxRef = React.createRef();
    this.reactionBoxTriggerRef = React.createRef();
    this.setReactionBoxActiveTab = this.setReactionBoxActiveTab.bind(this);
  }

  setReactionBoxActiveTab(i) {
    this.setState({
      reactionBoxActiveTab: i
    });

    // console.log('REACTION META LINE - SET ACTIVE TAB: ', i);
  }

  componentDidMount() {
    plugins.createPopup({
      triggerElement: this.reactionBoxTriggerRef.current,
      premadeContentElement: this.reactionBoxRef.current,
      type: 'premade',
      popupSelectors: ['reaction-box-popup', 'animate-slide-down']
    });

    this.reactionBoxTriggerRef.current.addEventListener('mousedown', () => {
      this.setReactionBoxActiveTab(0);
    });
  }

  render() {
    let reactionCount = 0;

    for (const reaction of this.props.data) {
      reactionCount += Number.parseInt(reaction.reaction_count, 10);
    }

    return (
      <div className="meta-line">
        <ReactionItemList modifiers='meta-line-list'
                          data={this.props.data}
                          reactionCount={reactionCount}
        />

        <p ref={this.reactionBoxTriggerRef} className="meta-line-text meta-line-text-trigger">{reactionCount}</p>

        <ReactionBox  ref={this.reactionBoxRef}
                      data={this.props.data}
                      reactionCount={reactionCount}
                      activeTab={this.state.reactionBoxActiveTab}
                      showTab={this.setReactionBoxActiveTab}
        />
      </div>
    );
  }
}

module.exports = ReactionMetaLine;