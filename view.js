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
       var code = event.keyCode || event.which;
       if(code === 13) {
            _this.addButtonClicked.notify();
            _this.clear();
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

    clear: function() {
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

Messages.prototype.onload = function() {
    this.showMsgs(this._model.getMsgs());
};

Messages.prototype.showMsgs = function(msgs) {
    for(var msg of msgs) {
        this.showMsg(msg);
    }
};

Messages.prototype.showMsg = function(msg) {
    // <div class="message"></div>
    var message = document.createElement("div");
    message.classList.add("message");

    // Construct message by replacing smileys with image tags
    var msgContent = this.messageProcessor.getMessageHtml(msg);
    var template = document.createElement('div');
    template.innerHTML = msgContent;
    
    var elements = template.childNodes;
    for(var element of elements) {
        message.appendChild(element);
    }
    
    this.messagesElement.appendChild(message);
};

Messages.prototype.rebuildList = function() {
    this.clearMsgs();
    this.showMsgs(this._model.getMsgs());
};

Messages.prototype.clearMsgs = function () {
    while(this.messagesElement.firstChild)
    {
        this.messagesElement.removeChild(this.messagesElement.firstChild);
    }
};

Messages.prototype.clearText = function () {
    document.querySelector('.rich-text-box').value = "";
};


/**
 * Message processor processes message text for smileys.
 * It replaces smiley with image element with source of 
 * appropriate image.
 */
function MessageProcessor() {
    this.chars = [':', ')', '<', '3'];
    this.smileys = [':)', '<3'];
    this.smileysImgSrc = ['img/smile.png', 'img/heart.png'];
    this.maxlength = 2;
}

MessageProcessor.prototype.getMessageHtml = function(msg) {
    return this.replaceSmileys(msg);
};

MessageProcessor.prototype.replaceSmileys = function(msg) {
    var char, emoji, isMatchStarted = false, isMatchCompleted = false, isMatchFailed = false;
    var startIndex = 0, endIndex = 0;
    var result = '<span class="text">';

    for(var i=0; i<msg.length; i++) {
        char = msg[i];
        if(this.chars.indexOf(char) >= 0) {
            if(isMatchStarted === false) {
                startIndex = i;
                isMatchStarted = true;
                continue;
            }
            else {
                if(startIndex - (i+1) <= this.maxlength) {
                    // If Match COMPLETED
                    emoji = msg.substring(startIndex, i + 1);
                    isMatchCompleted = this.smileys.indexOf(emoji) >= 0;
                    endIndex = isMatchCompleted ? i : 0;
                }
                else {
                    // Match FAILED
                    isMatchFailed = true;
                    isMatchCompleted = false;
                    isMatchStarted = false;
                    startIndex = 0;
                    endIndex = 0;
                }
            }
        }

        // Add charecters to result
        if(isMatchStarted === false) {
            result += char;
        }
        // Replace smiley with image element
        if(isMatchCompleted) {
            result += this.getImageElement(emoji);
        }
        // Add last few chars to result
        if(isMatchFailed) {
            result += emoji;
        }

        // Reset state
        if(isMatchFailed || isMatchCompleted) {
            isMatchFailed = false;
            isMatchCompleted = false;
            isMatchStarted = false;
            startIndex = 0;
            endIndex = 0;
        }
    }

    result += '</span>';

    return result;
};

MessageProcessor.prototype.getImageElement = function(emoji) {
    var index  = this.smileys.indexOf(emoji);
    var result = '</span> <img class="icon" src="';
    result += this.smileysImgSrc[index];
    result += '"/> <span class="text">';
    return result;
};

window.MessagesView = MessagesView;