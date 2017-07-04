/**
 * The Model. Model stores messages 
 * and notifies observers about changes.
 */
function MessageModel(msgs) {
    this._msgs = msgs;

    this.msgAdded = new Event(this);
}

MessageModel.prototype = {
    getMsgs: function () {
        return [].concat(this._msgs);
    },

    addMsgs: function (msg) {
        this._msgs.push(msg);
        this.msgAdded.notify({
            msg: msg
        });
    }
};

window.MessageModel = MessageModel;