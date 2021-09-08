const React = require('react');

const plugins = require('../../utils/plugins');

const LoaderSpinner = require('../loader/LoaderSpinner');

class CommentFormGuest extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      email: '',
      replyText: '',
      disabled: false,
      error: false,
      notification: false,
      loading: false
    };

    this.nameError = false;
    this.emailError = false;
    this.replyTextError = false;

    this.nameInputRef = React.createRef();
    this.emailInputRef = React.createRef();
    this.replyTextInputRef = React.createRef();

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.clearInput = this.clearInput.bind(this);
  }

  componentDidMount() {
    plugins.createFormInput([this.nameInputRef.current]);
    plugins.createFormInput([this.emailInputRef.current]);
    plugins.createFormInput([this.replyTextInputRef.current]);
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
      name: '',
      email: '',
      replyText: '',
      error: false,
      notification: false
    });

    this.nameInputRef.current.classList.remove('active');
    this.emailInputRef.current.classList.remove('active');
    this.replyTextInputRef.current.classList.remove('active');

    this.nameError = false;
    this.emailError = false;
    this.replyTextError = false;
  }

  emailIsValid(email) {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
  }

  isEmpty(string) {
    return string === '';
  }

  handleSubmit(e) {
    e.preventDefault();

    // check if there is an empty field
    this.nameError = this.isEmpty(this.state.name);
    this.emailError = this.isEmpty(this.state.email);
    this.replyTextError = this.isEmpty(this.state.replyText);

    if (this.nameError || this.emailError || this.replyTextError) {
      this.setState({
        error: 'Please complete all fields'
      });

      return;
    }

    // validate email
    if (!this.emailIsValid(this.state.email)) {
      this.emailError = true;

      this.setState({
        error: 'Please enter a valid email address'
      });

      return;
    }

    const commentData = {
      parentID: this.props.parent ? this.props.parent : 0,
      author: this.state.name,
      email: this.state.email,
      content: this.state.replyText.trim()
    };

    this.lockInput();

    // console.log('COMMENT FORM GUEST - COMMENT DATA: ', commentData);

    this.setState({
      error: false,
      notification: false,
      loading: true
    });

    this.props.createComment(commentData, (response) => {
      // console.log('COMMENT FORM GUEST - COMMENT ID: ', response);

      // if comment was not created
      if (Number.isNaN(Number.parseInt(response, 10))) {
        // console.log('COMMENT FORM GUEST - COULDN\'T CREATE COMMENT: ', response);

        this.unlockInput();

        this.replyTextError = true;

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
      [e.target.name]: e.target.value
    });
  }

  render() {
    return (
      <div className="post-comment-form guest-form animate-slide-down">
        <p className="post-comment-form-title">{vikinger_translation.sentence.leave_a_comment.singular}</p>
        <p className="post-comment-form-text">Please sign in or register to comment with your account!</p>
        <form className="form comment-form" onSubmit={this.handleSubmit}>
          <div className="form-row split">
            <div className="form-item">
              <div ref={this.nameInputRef} className="form-input small">
                <label className={`${this.state.loading ? 'label-disabled' : ''}`}>Name</label>
                <input type="text" name="name" 
                      className={`${this.nameError ? 'input-error' : ''} ${this.state.loading ? 'input-disabled' : ''}`}
                      disabled={this.state.disabled}
                      onChange={this.handleChange}
                      value={this.state.name} />
              </div>
            </div>
            <div className="form-item">
              <div ref={this.emailInputRef} className="form-input small">
                <label className={`${this.state.loading ? 'label-disabled' : ''}`}>Email</label>
                <input type="text" name="email"
                      className={`${this.emailError ? 'input-error' : ''} ${this.state.loading ? 'input-disabled' : ''}`}
                      disabled={this.state.disabled}
                      onChange={this.handleChange}
                      value={this.state.email} />
              </div>
            </div>
          </div>
          <div className="form-row">
            <div className="form-item">
              <div ref={this.replyTextInputRef} className="form-input small medium-textarea">
                <label className={`${this.state.loading ? 'label-disabled' : ''}`}>Write your comment here</label>
                <textarea name="replyText"
                          className={`${this.replyTextError ? 'input-error' : ''} ${this.state.loading ? 'input-disabled' : ''}`}
                          disabled={this.state.disabled}
                          onChange={this.handleChange}
                          value={this.state.replyText} />
              </div>
            </div>
          </div>
          {
            this.state.error &&
              <p className="post-comment-form-error" dangerouslySetInnerHTML={{__html: this.state.error}}></p>
          }
          {
            this.state.notification &&
              <p className="post-comment-form-notification">{this.state.notification}</p>
          }
          {
            this.state.loading &&
              <LoaderSpinner />
          }
          <div className="post-comment-form-actions">
            <p className="button void" onClick={this.clearInput}>Discard</p>
            <button type="submit" className="button secondary">Post Reply</button>
          </div>
        </form>
      </div>
    );
  }
}

module.exports = CommentFormGuest;