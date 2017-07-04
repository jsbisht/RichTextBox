/**
 * The Controller. Controller responds to user actions and
 * invokes changes on the model.
 */
function ListController(model, view) {
    this._model = model;
    this._view = view;

    var _this = this;

    this._view.addButtonClicked.attach(function () {
        _this.addItem();
    });
}

ListController.prototype = {
    addItem: function () {
        
    }
};

window.ListController = ListController;