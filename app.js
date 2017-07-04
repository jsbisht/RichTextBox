(function (window) {
    window.onload = function () {
        var model = new MessageModel();
	    var view = new MessagesView(model, {
            'addButton': document.querySelector('.submit')
        });
	    var controller = new MessagesController(model, view);

	    view.show();
    }
})(window);