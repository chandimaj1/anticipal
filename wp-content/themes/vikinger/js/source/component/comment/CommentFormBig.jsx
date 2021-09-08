const React = require('react');

const AvatarSmall = require('../avatar/AvatarSmall'),
      ExpandableTextarea = require('../form/ExpandableTextarea');

class CommentFormBig extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      replyText: '',
      disabled: false,
      error: false,
      loading: false,
      clearInput: false
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.clearInput = this.clearInput.bind(this);
  }

  lockInput() {
    this.setState({
      disabled: true
    });
  }

  unlockInput() {
    this.setState({
      disabled: false
    });
  }

  clearInput() {
    this.setState((state, props) => {
      return {
        replyText: '',
        error: false,
        clearInput: !state.clearInput
      };
    });
  }

  isEmpty(string) {
    return string === '';
  }

  handleSubmit(e) {
    e.preventDefault();

    if (this.isEmpty(this.state.replyText)) {
      this.setState({
        error: vikinger_translation.comment_empty_message
      });

      return;
    }

    const commentData = {
      parentID: this.props.parent ? this.props.parent : 0,
      content: this.state.replyText.trim(),
      userID: this.props.user.id,
      author: this.props.user.name
    };

    this.lockInput();

    // console.log('COMMENT FORM BIG - COMMENT DATA: ', commentData);

    this.setState({
      error: false,
      loading: true
    });

    this.props.createComment(commentData, (response) => {
      // console.log('COMMENT FORM BIG - COMMENT ID: ', response);

      // if comment was not created
      if (Number.isNaN(Number.parseInt(response, 10))) {
        // console.log('COMMENT FORM BIG - COULDN\'T CREATE COMMENT: ', response);

        this.unlockInput();

        this.setState({
          error: response,
          loading: false
        });

        return;
      }

      this.setState({
        loading: false
      });

      this.unlockInput();
      this.clearInput();
    });
  }

  handleChange(e) {
    this.setState({
      replyText: e.target.value
    });
  }

  render() {
    return (
      <div className="post-comment-form with-title animate-slide-down">
        <p className="post-comment-form-title">{vikinger_translation.leave_a_comment}</p>
        <AvatarSmall noBorder data={this.props.user} />
        <form className="form comment-form" onSubmit={this.handleSubmit}>
          <div className="form-row">
            <div className="form-item">
              <ExpandableTextarea name='replyText'
                                  value={this.state.replyText}
                                  label={vikinger_translation.your_reply}
                                  modifiers='small'
                                  minHeight={124}
                                  maxLength={vikinger_constants.settings.activity_comment_character_limit}
                                  userFriends={this.props.userFriends}
                                  handleChange={this.handleChange}
                                  loading={this.state.loading}
                                  error={this.state.error}
                                  disabled={this.state.disabled}
                                  clearInput={this.state.clearInput}
                />
            </div>
          </div>
          {
            this.state.error &&
              <p className="post-comment-form-error" dangerouslySetInnerHTML={{__html: this.state.error}}></p>
          }
          <div className="post-comment-form-actions">
            <p className="button void" onClick={this.clearInput}>{vikinger_translation.discard}</p>
            <button type="submit" className="button secondary">{vikinger_translation.post_reply}</button>
          </div>
        </form>
      </div>
    );
  }
}

module.exports = CommentFormBig;