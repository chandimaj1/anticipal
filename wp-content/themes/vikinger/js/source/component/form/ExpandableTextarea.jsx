const React = require('react');

const app = require('../../utils/core'),
      plugins = require('../../utils/plugins');

const MentionList = require('../mention/MentionList'),
      LoaderSpinner = require('../loader/LoaderSpinner');

class ExpandableTextarea extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      mentioning: false,
      mentionChars: '',
      mentionPositionData: false
    };

    this.maxLength = this.props.maxLength || 1000;
    this.minHeight = this.props.minHeight || 48;

    this.formTextareaRef = React.createRef();
    this.textareaRef = React.createRef();
    this.shadowTextareaRef = React.createRef();

    this.handleChange = this.handleChange.bind(this);
    this.oneTimeDisableInput = this.oneTimeDisableInput.bind(this);
    this.applySelectedMention = this.applySelectedMention.bind(this);

    this.savePressedKey = this.savePressedKey.bind(this);
    this.resetPressedKey = this.resetPressedKey.bind(this);
    this.submitOnEnterKeyPress = this.submitOnEnterKeyPress.bind(this);
    this.addNewlineOnShiftEnterKeyPress = this.addNewlineOnShiftEnterKeyPress.bind(this);

    this.pressedKeys = {};
  }

  clearInput() {
    this.formTextareaRef.current.classList.remove('active');
  }

  savePressedKey(e) {
    this.pressedKeys[e.keyCode] = true;
  }

  resetPressedKey(e) {
    this.pressedKeys[e.keyCode] = false;
  }

  resetPressedKeys() {
    this.pressedKeys = {};
  }

  updateTextareaDimensions() {
    // set minimum textarea height
    this.textareaRef.current.style.height = `${this.minHeight}px`;

    const scrollHeight = this.textareaRef.current.scrollHeight;

    // if scroll height is greater that minimum height, set it as textarea height
    if (scrollHeight > this.minHeight) {
      this.textareaRef.current.style.height = `${this.textareaRef.current.scrollHeight}px`;
    }
  }

  submitOnEnterKeyPress() {
    const shift = 16,
          enter = 13;

    // enter key
    if (this.pressedKeys[enter] && !this.pressedKeys[shift]) {
      this.resetPressedKeys();
      this.props.onSubmit();
    }
  }

  addNewlineOnShiftEnterKeyPress() {
    const shift = 16,
          enter = 13;

    // shift + enter
    if (this.pressedKeys[shift] && this.pressedKeys[enter]) {
      // put newline in textarea
      this.props.handleChange({
        target: {
          name: this.props.name,
          value: this.props.value + '\n'
        }
      });
    }
  }

  disableEnterKey(e) {
    // enter key
    if (e.keyCode === 13) {
      e.preventDefault();
    }
  }

  disableInputArrows(e) {
    // arrow up/down pressed
    if ((e.keyCode === 38) || (e.keyCode === 40)) {
      e.preventDefault();
    }
  }

  oneTimeDisableInput(e) {
    // spacebar or enter key pressed
    if ((e.keyCode === 32) || (e.keyCode === 13)) {
      e.preventDefault();
      this.textareaRef.current.removeEventListener('keydown', this.oneTimeDisableInput);
    }
  }

  getTextWithMention(text, mentionText) {
    const newText = app.insertWordInText(text, `@${mentionText}`, this.wordInCursor.startIndex, this.wordInCursor.word.length);

    return newText;
  }

  closeMention(mentionData, event) {
    this.setState({
      mentioning: false
    });

    // don't interrupt writing focus
    this.textareaRef.current.focus();
    
    // set cursor position to be after user mention
    if (mentionData) {
      this.textareaRef.current.selectionEnd = this.wordInCursor.startIndex + mentionData.length + 1;
    }

    // enable arrows
    this.textareaRef.current.removeEventListener('keydown', this.disableInputArrows);

    // console.log('APPLY SELECTED MENTION - EVENT: ', event);

    // if event is not keydown (user didn't press spacebar/enter to select mention), remove enter/spacebar block
    if (event !== 'keydown') {
      this.textareaRef.current.removeEventListener('keydown', this.oneTimeDisableInput);
    }
  }

  checkForMentions(text) {
    // get word in current cursor position
    const currentCursorPosition = this.textareaRef.current.selectionStart,
          wordInCursor = app.getWordInPosition(text, currentCursorPosition);

    // console.log('CURSOR POSITION: ', currentCursorPosition);
    // console.log('WORD IN CURSOR POSITION: ', wordInCursor.word);
    // console.log('WORD IN CURSOR START INDEX: ', wordInCursor.startIndex);

    // if word has @, user is trying to mention
    const mentionRegex = /@/igm,
          wordInCursorIsMention = mentionRegex.test(wordInCursor.word);

    // if user is trying to mention
    if (wordInCursorIsMention) {
      this.wordInCursor = wordInCursor;

      // if user already mentioning (adding/removing characters from mention)
      if (this.state.mentioning) {
        this.setState({
          mentionChars: wordInCursor.word.substring(1)
        });
      } else {
      // if user just started mentioning

        // disable textarea input enter/spacebar (only one stroke)
        this.textareaRef.current.addEventListener('keydown', this.oneTimeDisableInput);
        // disable textarea arrows
        this.textareaRef.current.addEventListener('keydown', this.disableInputArrows);

        // calculate cursor position
        app.updateShadowInput(this.shadowTextareaRef.current, text);
        const dimensions = app.getPositionInInput(this.textareaRef.current, this.shadowTextareaRef.current, wordInCursor.startIndex + 1);

        this.setState({
          mentionPositionData: dimensions,
          mentioning: true,
          mentionChars: wordInCursor.word.substring(1)
        });
      }
    } else {
    // if user isn't trying to mention
      // if user just ended doing a mention (deleted mention characters including @)
      if (this.state.mentioning) {
        this.setState({
          mentioning: false
        });

        // enable arrows
        this.textareaRef.current.removeEventListener('keydown', this.disableInputArrows);
        
        // remove one time spacebar/enter block
        this.textareaRef.current.removeEventListener('keydown', this.oneTimeDisableInput);
      }
    }
  }

  handleChange(e) {
    // check for mentions (@name)
    this.checkForMentions(e.target.value);

    this.props.handleChange(e);
  }

  applySelectedMention(user, event) {
    // console.log('EXPANDABLE TEXTAREA - APPLY SELECTED MENTION: ', user);

    const newText = this.getTextWithMention(this.props.value, user.mention_name);

    this.closeMention(user.mention_name, event);

    this.props.handleChange({
      target: {
        name: this.props.name,
        value: newText,
        user: user
      }
    });
  }

  componentDidUpdate(prevProps) {
    // if text changed
    if (prevProps.value !== this.props.value) {
      // refresh textarea size
      this.updateTextareaDimensions();
    }

    // if clear input changed
    if (prevProps.clearInput !== this.props.clearInput) {
      this.clearInput();
    }
  }

  componentDidMount() {
    // refresh textarea size
    this.updateTextareaDimensions();

    if (this.props.label) {
      plugins.createFormInput([this.formTextareaRef.current]);
    }

    // disable enter for space
    if (this.props.disableEnter) {
      // disable enter key
      this.textareaRef.current.addEventListener('keypress', this.disableEnterKey);
    }

    // submit content on enter key press
    if (this.props.submitOnEnter) {
      this.textareaRef.current.addEventListener('keypress', this.submitOnEnterKeyPress);
      this.textareaRef.current.addEventListener('keypress', this.addNewlineOnShiftEnterKeyPress);

      // disable enter key
      this.textareaRef.current.addEventListener('keypress', this.disableEnterKey);

      // insert newline on shift + enter
      this.textareaRef.current.addEventListener('keydown', this.savePressedKey);
      this.textareaRef.current.addEventListener('keyup', this.resetPressedKey);
    }
  }

  render() {
    return (
      <div ref={this.formTextareaRef} className={`form-textarea ${this.props.focus ? 'active' : ''} ${this.props.modifiers || ''}`}>
        {/* FORM TEXTAREA SHADOW */}
        <p ref={this.shadowTextareaRef} className={`form-textarea-shadow ${this.props.modifiers || ''}`}></p>
        {/* FORM TEXTAREA SHADOW */}

        {/* LABEL */}
        {
          this.props.label &&
            <label className={`${this.props.loading ? 'label-disabled' : ''}`}>{this.props.label}</label>
        }
        {/* LABEL */}

        {/* MENTION LIST */}
        {
          this.props.userFriends && this.state.mentioning &&
            <MentionList  data={this.props.userFriends}
                          searchText={this.state.mentionChars}
                          positionData={this.state.mentionPositionData}
                          onItemSelection={this.applySelectedMention}
            />
        }
        {/* MENTION LIST */}

        {/* TEXTAREA */}
        <textarea ref={this.textareaRef}
                  name={this.props.name}
                  value={this.props.value}
                  className={`${this.props.loading ? 'input-disabled' : ''} ${this.props.error ? 'input-error' : ''}`}
                  {...(this.props.placeholder ? { placeholder: this.props.placeholder } : {})}
                  maxLength={this.maxLength}
                  autoFocus={this.props.focus}
                  disabled={this.props.disabled}
                  onChange={this.handleChange}
        >
        </textarea>
        {/* TEXTAREA */}

        {
          !this.props.hideLimit &&
            <div className={`form-textarea-limit ${this.props.modifiers || ''}`}>
              {
                this.props.loading &&
                  <LoaderSpinner />
              }
              <p className="form-textarea-limit-text">{this.props.value.length}/{this.maxLength}</p>
            </div>
        }
      </div>
    );
  }
}

module.exports = ExpandableTextarea;