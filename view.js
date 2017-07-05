/**
 * The View. View presents the model and provides
 * the UI events. The controller is attached to these
 * events to handle the user interraction.
 */
function MessagesView(model, elements) {
    this._model = model;
    this._elements = elements;

    this.addButtonClicked = new Event(this);
    this.messages = new Messages(model);
    this.messageProcessor = new MessageProcessor();

    var _this = this;

    // attach model listeners
    this._model.msgAdded.attach(function () {
        _this.rebuildList();
    });

    // attach listeners to HTML controls
    this._elements.addButton.addEventListener('click', function () {
        _this.addButtonClicked.notify();
        _this.clear();
    });
    this._elements.richTextBox.addEventListener('keydown', function (event) {
        function placeCaretAtEnd(el) {
            el.focus();
            if (typeof window.getSelection != "undefined"
                    && typeof document.createRange != "undefined") {
                var range = document.createRange();
                range.selectNodeContents(el);
                range.collapse(false);
                var sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
            } else if (typeof document.body.createTextRange != "undefined") {
                var textRange = document.body.createTextRange();
                textRange.moveToElementText(el);
                textRange.collapse(false);
                textRange.select();
            }
        }

        var code = event.keyCode || event.which;
        if (code === 13) {
            event.preventDefault();
            _this.addButtonClicked.notify();
            _this.clear();
        }
        else {
            var keys = [48, 188];
            setTimeout(function() {
                var msg = document.querySelector('.rich-text-box').innerHTML;
                var newmsg = _this.messageProcessor.replaceSmileys(msg);
                document.querySelector('.rich-text-box').innerHTML = newmsg;
                placeCaretAtEnd(document.querySelector('.rich-text-box'));
            });
        }
    });
}

MessagesView.prototype = {
    show: function () {
        this.messages.onload();
    },

    rebuildList: function () {
        this.messages.rebuildList();
    },

    clear: function () {
        this.messages.clearText();
    }
};


/**
 * Messages class to handle showing messages list
 * @param {model} model Model object
 */
function Messages(model) {
    this._model = model;
    this.messagesElement = document.querySelector('.messages');
    this.messageProcessor = new MessageProcessor();
}

Messages.prototype.onload = function () {
    this.showMsgs(this._model.getMsgs());
};

Messages.prototype.showMsgs = function (msgs) {
    for (var msg of msgs) {
        this.showMsg(msg);
    }
};

Messages.prototype.showMsg = function (msg) {
    // <div class="message"></div>
    var message = document.createElement("div");
    message.classList.add("message");

    // Construct message by replacing smileys with image tags
    var msgContent = msg;
    var template = document.createElement('div');
    template.innerHTML = msgContent;

    message.appendChild(template);
    this.messagesElement.appendChild(message);
};

Messages.prototype.rebuildList = function () {
    this.clearMsgs();
    this.showMsgs(this._model.getMsgs());
};

Messages.prototype.clearMsgs = function () {
    while (this.messagesElement.firstChild) {
        this.messagesElement.removeChild(this.messagesElement.firstChild);
    }
};

Messages.prototype.clearText = function () {
    document.querySelector('.rich-text-box').innerHTML = "";
};


/**
 * Message processor processes message text for smileys.
 * It replaces smiley with image element with source of 
 * appropriate image.
 */
function MessageProcessor() {
    this.chars = [':', ')', '&', '3'];
    this.smileys = [':)', '&lt;3'];
    this.smileysImgSrc = ['img/smile.png', 'img/heart.png'];
    this.maxlength = 5;
}

MessageProcessor.prototype.getMessageHtml = function (msg) {
    return this.replaceSmileys(msg);
};

MessageProcessor.prototype.replaceSmileys = function (msg) {
    var char, emoji;
    var hasFoundEmojies = false, isMatchStarted = false, isMatchCompleted = false, isMatchFailed = false;
    var startIndex = 0, endIndex = 0;
    var result = '<span class="text">';

    for (var i = 0; i < msg.length; i++) {
        char = msg[i];
        if (this.chars.indexOf(char) >= 0 || isMatchStarted) {
            if (isMatchStarted === false) {
                startIndex = i;
                isMatchStarted = true;
                continue;
            }
            else {
                if ((i + 1) - startIndex <= this.maxlength) {
                    // If Match COMPLETED
                    emoji = msg.substring(startIndex, i + 1);
                    isMatchCompleted = this.smileys.indexOf(emoji) >= 0;
                    endIndex = isMatchCompleted ? i : 0;
                }
                else {
                    // Match FAILED
                    isMatchFailed = true;
                }
            }
        }

        // Add charecters to result
        if (isMatchStarted === false) {
            result += char;
        }
        // Replace smiley with image element
        if (isMatchCompleted) {
            result += this.getImageElement(emoji);
            hasFoundEmojies = true;
        }
        // Add last few chars to result
        if (isMatchFailed) {
            result += emoji;
        }

        // Reset state
        if (isMatchFailed || isMatchCompleted) {
            isMatchFailed = false;
            isMatchCompleted = false;
            isMatchStarted = false;
            startIndex = 0;
            endIndex = 0;
        }
    }

    result += '</span>';

    return hasFoundEmojies ? result : msg;
};

MessageProcessor.prototype.getImageElement = function (emoji) {
    var index = this.smileys.indexOf(emoji);
    var result = '</span> <img class="icon" src="';
    result += this.smileysImgSrc[index];
    result += '"/> <span class="text">';
    return result;
};

window.MessagesView = MessagesView;