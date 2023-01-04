import io from 'socket.io-client';

const ENDPOINT = process.env.REACT_APP_ENDPOINT;
const socket = io(ENDPOINT);

const useSocket = () => {
    const events = {
        JOIN_ROOM: 'JOIN_ROOM',
        JOIN_MULTIPLE_ROOMS: 'JOIN_MULTIPLE_ROOMS',
        INBOX: 'INBOX',
        NEW_MESSAGE: 'NEW_MESSAGE',
        NEW_CHAT: 'NEW_CHAT',
        DELETE_CHAT: 'DELETE_CHAT',
        DELETE_MESSAGE: 'DELETE_MESSAGE',
        REACT_MESSAGE: 'REACT_MESSAGE',
        REMOVE_REACTION: 'REMOVE_REACTION'
    }

    return [socket, events]
}

export default useSocket