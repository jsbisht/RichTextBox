(function () {
    window.onload = function () {
        var model = new MessageModel();
	    var view = new ListView(model);
	    var controller = new ListController(model, view);

	    view.show();
    }
});