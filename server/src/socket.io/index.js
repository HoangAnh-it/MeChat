const controller = require('./controller');
const events = require('./events');

module.exports = function initSocket(app, io) {
    io.on('connection', socket => {
        app.set('socket.io', {io, socket});
        console.log('An user connected', socket.id);

        socket.on(events.JOIN_ROOM ,controller.joinRoom(io, socket))
        socket.on(events.JOIN_MULTIPLE_ROOMS ,controller.joinMultipleRooms(io, socket))
        socket.on(events.INBOX, controller.inbox(io, socket))
        socket.on(events.DELETE_CHAT, controller.deleteChat(io, socket))
        socket.on(events.DELETE_MESSAGE, controller.deleteMessage(io, socket))
        socket.on(events.REMOVE_REACTION, controller.removeReaction(io, socket))
    })
}
