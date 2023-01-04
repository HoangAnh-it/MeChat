import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { isFalsy } from '~/utils/validator';
import Sidebar from './Sidebar'
import ChatCenter from './ChatCenter'
import ChatDetail from './ChatDetail'
import style from './style.module.scss';
import ClassNames from '~/utils/classNames';
const cx = ClassNames(style);

function Home() {
    const { id } = useParams()
    const [isInbox, setIsInbox] = useState(false)

    useEffect(() => {
        if (isFalsy(id)) {
            setIsInbox(false)
        } else {
            setIsInbox(true)
        }
    }, [id])

    return (
        <div className={cx('container')}>
            <Sidebar className={cx('item', 'sidebar')} />
            {
                isInbox ?
                    <>
                        <ChatCenter className={cx('item', 'chat-center')} />
                        <ChatDetail className={cx('item', 'chat-detail')} />
                    </>
                    :
                    <div className={cx('empty-chat-container')}>
                        <div className={[cx('text')]}>Welcome to MeChat!</div>
                    </div>
            }
        </div>
    );
}

export default Home;