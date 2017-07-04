/**
 * The Controller. Controller responds to user actions and
 * invokes changes on the model.
 */
function MessagesController(model, view) {
    this._model = model;
    this._view = view;

    var _this = this;

    this._view.addButtonClicked.attach(function () {
        _this.addMsgs();
    });
}

MessagesController.prototype = {
    addMsgs: function () {
        var item = document.getQuerySelecter('.rich-text-box').value;
        if (item) {
            this._model.addMsgs(item);
        }
    }
};

window.MessagesController = MessagesController;