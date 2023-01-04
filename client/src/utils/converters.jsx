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
    const message = chat.lastMessage.type === 'text' ? chat.lastMessage.content : 'sent a media';
    const isMessageUnsent = !!chat.lastMessage.deletedAt
    chat.users.forEach(user => {
        if (user.id === chat.lastMessage.from) {
            intro= `${user.lastName}: ${isMessageUnsent ? 'Unsent a message' : message}`
        } else {
            intro= `You: ${isMessageUnsent ? 'Unsent a message' : message}`
        }
    })

    if (chat.conversationType === 'private') {
        return {
            id: chat.users[0].id,
            name: `${chat.users[0].firstName} ${chat.users[0].lastName}`,
            avatar: chat.users[0].avatar,
            intro,
            conversationId: chat.conversationId
        }
    }
    else if (chat.conversationType === 'public') {
        return {
            id: chat.conversationId,
            name: chat.conversationName,
            avatar: chat.conversationAvatar,
            intro,
            conversationId: chat.conversationId
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
            conversationType: chat.conversationType
        }
    }
    else if (chat.conversationType === 'public') {
        return {
            id: chat.conversationId,
            name: chat.conversationName,
            avatar: chat.conversationAvatar,
            conversationId: chat.conversationId,
            conversationType: chat.conversationType
        }
    }
}
