import React from 'react';

import api from '~/config/api';
import { useAxios, useAuth, useSocket } from '~/hooks';
import style from './style.module.scss';
import ClassNames from '~/utils/classNames';
import { toast } from 'react-toastify';
import UserItem from '~/components/UserItem';
import {CloseIcon} from '~/components/Icon'
import Loading from '~/components/Loading';
const cx = ClassNames(style);

function DetailReactionModal({ data, close, message }) {
    const [users, setUsers] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const axios = useAxios();
    const [auth] = useAuth()
    const [socket, socketEvents] = useSocket()

    React.useEffect(() => {
        axios.get(api.basicMultipleInfo(data.map(d => d.from)))
            .then((res) => {
                if (res.statusText === 'OK') {
                    setTimeout(() => {
                        setUsers(res.data.map(d => ({
                            id: d.id,
                            name: `${d.firstName} ${d.lastName}`,
                            avatar: d.avatar,
                            emoji: data.find(r => r.from === d.id)
                        })))
                        setLoading(false)
                    }, 1000)
                }
            }).catch(err => {
                console.log(err)
                toast.error('Cannot show reactions.')
                setLoading(false)
            })
    }, [])

    const removeReaction= (user) => {
        axios.delete(api.removeReaction(user.emoji.id))
            .then(res => {
                if (res.statusText === 'OK') {
                    setUsers(users => users.filter(u => u.id !== user.id))
                    socket.emit(socketEvents.REMOVE_REACTION, {
                        conversationId: message.conversationId,
                        messageId: message.id,
                        from: auth.user.id
                    })
                }
            }).catch(error => {
                console.log(error)
                toast.error("Cannot remove reaction.");
            })
    }

    return (
        <div id="modal">
            <div className={cx('container')}>
                <CloseIcon
                    className={cx('close-icon')}
                    onClick={close}
                />
                {
                    loading ?
                        <Loading />
                        :
                        <>
                            <h1 className={cx('title')}>Reactions</h1>
                            <div className={cx('list')}>
                                {
                                    users.map((user, index) => {
                                        if (auth.user.id === user.id) {
                                            return (
                                                <UserItem
                                                    key={`react-modal-${user.id}-${index}`} data={user}
                                                    className={cx('item', 'isYours')}
                                                    More={<span className={cx('more-emoji')}>{user.emoji.emoji}</span>}
                                                    onClick={() => removeReaction(user)}
                                                />
                                            )
                                        } else {
                                            return (
                                                <UserItem
                                                    key={`react-modal-${user.id}-${index}`} data={user}
                                                    className={cx('item')}
                                                    More={<span className={cx('more-emoji')}>{user.emoji.emoji}</span>}
                                                />
                                            )
                                        }
                                    })
                                }
                            </div>
                        </>
                }
                
            </div>
        </div>
    );
}

export default DetailReactionModal;