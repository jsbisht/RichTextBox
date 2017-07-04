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
    this._elements.addButton.click(function () {
        _this.addButtonClicked.notify();
    });
}

MessagesView.prototype = {
    show: function () {
        this.messages.onload();
    },

    rebuildList: function () {
       this.messages.rebuildList();
    }
};


/**
 * Messages class to handle showing messages list
 * @param {model} model Model object
 */
function Messages(model) {
    this._model = model;
    this.messagesElement = document.querySelector('.messages');
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
    var msgContent = getMessageHtml(msg);
    var template = document.createElement('template');
    template.innerHTML = msgContent;
    var elements = template.content.firstChild;

    message.appendChild(elements);
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

function getMessageHtml(msg) {
    return msg;
}

window.MessagesView = MessagesView;