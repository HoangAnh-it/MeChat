import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import routes from '~/config/routes'
import style from './style.module.scss';
import ClassNames from '~/utils/classNames';
import Image from '~/components/Image';
import Button from '~/components/Button';
import { useSocket } from '~/hooks';
import { extractBasicUser } from '~/utils/converters';

const cx = ClassNames(style);

function ChatDetail(props) {
    const { className } = props;
    const navigate = useNavigate()
    const [userChatting, setUserChatting] = useState({});
    const [socket, socketEvents] = useSocket()

    useEffect(() => {
        const userChattingListener = (userChatting) => {
            setUserChatting(userChatting);
        }
        
        socket.on(socketEvents.INBOX, userChattingListener)
        
        return () => {
            socket.off(socketEvents.INBOX, userChattingListener)
        }
    }, [socket])

    const handleToProfile = () => {
        if (userChatting.conversationType === 'public') {
            navigate(routes.private.toGroupDetail(userChatting.conversationId), { replace: true })
        } else if (userChatting.conversationType === 'private') {
            navigate(routes.private.toProfile(userChatting.id), { replace: true })
        }
    }

    const handleCloseChat = () => {
        navigate(routes.private.home, { replace: true });
    }

    return (
        <div className={[cx('container'), className].join(' ')}>
            <div className={cx('user')}>
                <Image className={cx('avatar')} src={userChatting.avatar} />
                <div className={cx('name')}>{userChatting.name}</div>
            </div>

            <div className={cx('actions')}>
                <Button
                    className={cx('btn')}
                    onClick={handleToProfile}
                >Go to profile</Button>
            </div>

            <Button
                className={cx('btn-close-chat')}
                onClick={handleCloseChat}
            >Close chat</Button>
        </div>
    );
}

export default ChatDetail;