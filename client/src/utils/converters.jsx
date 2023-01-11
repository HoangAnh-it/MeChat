import { isFalsy } from './validator'

const initialChatItemPreview = {
    id: '',
    name: '',
    avatar: '',
    intro: '',
    conversationId: ''
}

export const convertToPreviewChat = (chat) => {
    if (isFalsy(chat)) return initialChatItemPreview

    let intro = '';
    let message;
    switch (chat.lastMessage.type) {
        case 'text':
        case 'announcement':
            message = chat.lastMessage.content
            break;
    
        case 'image':
        case 'video':
            message = 'sent a media.'
            break;
        
        default:
            message = 'error.'
            break;
    }
    const isMessageUnsent = !!chat.lastMessage.deletedAt
    if (Object.keys(chat.lastMessage).length > 0) {
        const user = chat.users.find(user => user.id === chat.lastMessage.from);
        if (user) {
            intro = `${user.lastName}: ${isMessageUnsent ? 'Unsent a message' : message}`
        } else {
            intro= `You: ${isMessageUnsent ? 'Unsent a message' : message}`
        }
    }
        
    if (chat.conversationType === 'private') {
        return {
            id: chat.users[0].id,
            name: `${chat.users[0].firstName} ${chat.users[0].lastName}`,
            avatar: chat.users[0].avatar,
            intro,
            conversationId: chat.conversationId,
            conversationType: chat.conversationType,
            users: chat.users
        }
    }
    else if (chat.conversationType === 'public') {
        return {
            id: chat.conversationId,
            name: chat.conversationName,
            avatar: chat.conversationAvatar,
            intro,
            conversationId: chat.conversationId,
            conversationType: chat.conversationType,
            users: chat.users,
            admin: chat.admin
        }
    }
}

export const extractBasicUser = (chat) => {
    if (isFalsy(chat)) return initialChatItemPreview

    if (chat.conversationType === 'private') {
        return {
            id: chat.users[0].id,
            name: `${chat.users[0].firstName} ${chat.users[0].lastName}`,
            avatar: chat.users[0].avatar,
            conversationId: chat.conversationId,
            conversationType: chat.conversationType,
            users: chat.users
        }
    }
    else if (chat.conversationType === 'public') {
        return {
            id: chat.conversationId,
            name: chat.conversationName,
            avatar: chat.conversationAvatar,
            conversationId: chat.conversationId,
            conversationType: chat.conversationType,
            users: chat.users
        }
    }
}
