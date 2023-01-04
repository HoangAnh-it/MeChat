const events = require('./events');

const controller = {
    joinRoom: (io, socket) => (room) => {
        socket.join(room);
    },

    joinMultipleRooms: (io, socket) => (rooms) => {
        for (const room of rooms) {
            socket.join(room)
        }
    },

    inbox: (io, socket) => (data) => {
        socket.emit(events.INBOX, data)
    },

    deleteChat: (io, socket) => (data) => {
        socket.emit(events.DELETE_CHAT, data)
    },

    deleteMessage: (io, socket) => (data) => {
        socket.emit(events.DELETE_CHAT, data)
    },

    removeReaction: (io, socket) => (data) => {
        io.in(data.conversationId).emit(events.REMOVE_REACTION, data)
    }
}

module.exports = controller;