const React = require('react');

const AvatarSmall = require('../avatar/AvatarSmall'),
      ExpandableTextarea = require('../form/ExpandableTextarea');

class CommentForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      replyText: '',
      disabled: false,
      error: false,
      loading: false
    };

    this.inputRef = React.createRef();

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
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
    this.setState({
      replyText: '',
      error: false
    });
  }

  isEmpty(string) {
    return string === '';
  }

  handleSubmit() {
    if (this.isEmpty(this.state.replyText)) {
      this.setState({
        error: vikinger_translation.comment_empty_message
      });

      return;
    }

    // return if already loading
    if (this.state.loading) {
      return;
    }

    this.setState({
      loading: true,
      error: false
    });

    const commentData = {
      parentID: this.props.parent ? this.props.parent : 0,
      content: this.state.replyText.trim(),
      userID: this.props.user.id,
      author: this.props.user.name
    };

    this.lockInput();

    // console.log('COMMENT FORM - COMMENT DATA: ', commentData);

    this.props.createComment(commentData, (response) => {
      // console.log('COMMENT FORM - FORM CREATE COMMENT WITH ID: ', response);

      // if comment was not created
      if (Number.isNaN(Number.parseInt(response, 10))) {
        // console.log('COMMENT FORM - COULDN\'T CREATE COMMENT: ', response);

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
      <div className="post-comment-form animate-slide-down">
        <AvatarSmall noBorder data={this.props.user} />
        <form className="form comment-form">
          <div className="form-row">
            <div className="form-item">
              <ExpandableTextarea name='replyText'
                                  value={this.state.replyText}
                                  label={vikinger_translation.your_reply}
                                  modifiers='small'
                                  maxLength={vikinger_constants.settings.activity_comment_character_limit}
                                  userFriends={this.props.user.friends}
                                  handleChange={this.handleChange}
                                  loading={this.state.loading}
                                  focus={this.props.focus}
                                  disabled={this.state.disabled}
                                  error={this.state.error}
                                  submitOnEnter
                                  onSubmit={this.handleSubmit}
              />
            </div>
          </div>
        </form>
        {
          this.state.error &&
            <p className="post-comment-form-error" dangerouslySetInnerHTML={{__html: this.state.error}}></p>
        }
      </div>
    );
  }
}

module.exports = CommentForm;