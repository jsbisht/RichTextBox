(function (window) {
    window.onload = function () {
        var model = new MessageModel();
	    var view = new MessagesView(model, {
            'addButton': document.querySelector('.submit'),
            'richTextBox': document.querySelector('.rich-text-box')
        });
	    var controller = new MessagesController(model, view);

	    view.show();
    }
})(window);