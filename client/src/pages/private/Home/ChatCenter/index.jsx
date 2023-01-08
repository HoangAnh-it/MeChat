import { useState, useEffect } from 'react';

import ChatPanel from './ChatPanel';
import Inbox from './Inbox';
import Header from './HeaderChat';
import { useSocket } from '~/hooks';
import style from './style.module.scss';
import ClassNames from '~/utils/classNames';
import { extractBasicUser } from '~/utils/converters';
const cx = ClassNames(style);

function ChatCenter(props) {
    const { className} = props;
    const [userChatting, setUserChatting] = useState({});
    const [socket, socketEvents] = useSocket()

    useEffect(() => {
        const userChattingListener = (data) => {
            setUserChatting(data);
        }
        
        socket.on(socketEvents.INBOX, userChattingListener)
        
        return () => {
            socket.off(socketEvents.INBOX, userChattingListener)
        }
    }, [socket])

    return (
        <div className={[cx('container'), className].join(' ')}>
            <Header className={cx('header')} userChatting={userChatting} />
            <Inbox className={cx('inbox')} userChatting={userChatting}/>
            <ChatPanel className={cx('chat-panel')}
                conversation={{
                    id: userChatting.conversationId,
                    type: userChatting.conversationType
                }} 
            />
        </div>
    );
}

export default ChatCenter;