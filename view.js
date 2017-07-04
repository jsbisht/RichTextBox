/**
 * The View. View presents the model and provides
 * the UI events. The controller is attached to these
 * events to handle the user interraction.
 */
function ListView(model, elements) {
    this._model = model;
    this._elements = elements;

    this.addButtonClicked = new Event(this);

    var _this = this;

    // attach model listeners
    this._model.itemAdded.attach(function () {
        _this.rebuildList();
    });

    // attach listeners to HTML controls
    this._elements.addButton.click(function () {
        _this.addButtonClicked.notify();
    });
}

ListView.prototype = {
    show: function () {
        this.rebuildList();
    },

    rebuildList: function () {
       
    }
};

window.ListView = ListView;