import { useReducer, useState, useEffect, createRef, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import { PlusIcon, SearchIcon } from '~/components/Icon';
import { useAxios, useSocket, useConfirmModal } from '~/hooks';
import Input from '~/components/Input';
import UserItem from '~/components/UserItem';
import More from './More';
import style from './style.module.scss';
import ClassNames from '~/utils/classNames';
import Button from '~/components/Button';
import api from '~/config/api';
import { reducer, initialState, actions } from '~/store/sidebar';
import routes from '~/config/routes';
import { toLowerCaseNonAccentVietnamese } from '~/utils/nonAccentVietnamese';
import { convertToPreviewChat, extractBasicUser } from '~/utils/converters';
import { isFalsy } from '~/utils/validator';
const cx = ClassNames(style);

function Sidebar({ className }) {
    const { id } = useParams()
    const [moreRefs, setMoreRefs] = useState([]);
    const [ready, setReady] = useState(false);
    const [sidebarState, sidebarDispatch] = useReducer(reducer, initialState);
    const axios = useAxios()
    const navigate = useNavigate()
    const [socket, socketEvents] = useSocket();
    const [confirmModal_init, openConfirmModal, closeConfirmModal] = useConfirmModal();

    useEffect(() => {
        console.log('fetch sidebar')
        axios.get(api.chatPreview)
            .then(response => {
                if (response.statusText === 'OK') {
                    socket.emit(socketEvents.JOIN_MULTIPLE_ROOMS, response.data.map(chat => chat.conversationId))
                    sidebarDispatch(actions.handleDataChatPreview(response.data))
                    setReady(true)
                }
            })
            .catch(error => {
                console.log(error)
                toast.error(error.response.data.message)
            })
    }, [])

    useEffect(() => {
        setMoreRefs(
            Array(sidebarState.chats.length)
                .fill()
                .map(() => createRef())
        )
    }, [sidebarState.chats])

    useEffect(() => {
        if (isFalsy(id) || !ready) return;
        const userChatting = sidebarState.chats.find(chatItem => extractBasicUser(chatItem).id === id);
        if (userChatting) {
            socket.emit(socketEvents.INBOX,extractBasicUser(userChatting))
        }
        else {
            axios.get(api.basicInfo(id))
                .then(response => {
                    if (response.statusText === 'OK') {
                        inbox({
                            id: id,
                            name: `${response.data.firstName} ${response.data.lastName}`,
                            avatar: response.data.avatar
                        })
                    }
                }).catch(error => {
                    console.log(error);
                    toast.error('Something went wrong when opening chat!')
                })
        }
    }, [id, sidebarState.chats])

    useEffect(() => {
        const newMessagesListener = (data) => {
            sidebarDispatch(actions.newMessage(data))
        }
        
        const newChatListener = (data) => {
            socket.emit(socketEvents.JOIN_ROOM, data.id)
            sidebarDispatch(actions.newChat(data))
        }

        const deleteMessageListener = ({conversationId, from}) => {
            sidebarDispatch(actions.deleteMessage({conversationId, from}))
        }

        socket.on(socketEvents.NEW_MESSAGE, newMessagesListener);
        socket.on(socketEvents.NEW_CHAT, newChatListener);
        socket.on(socketEvents.DELETE_MESSAGE, deleteMessageListener);
        
        return () => {
            socket.off(socketEvents.NEW_MESSAGE, newMessagesListener);
            socket.off(socketEvents.NEW_CHAT, newChatListener);
            socket.off(socketEvents.DELETE_MESSAGE, deleteMessageListener);
        }
    }, [socket])

    const filterUsers = (chats) => {
        if (!sidebarState.searchInput.trim()) return chats;
        return chats.filter(chat => {
            const name = chat.conversationType === 'private' ? `${chat.users[0].firstName} ${chat.users[0].lastName}`: chat.conversationName
            return toLowerCaseNonAccentVietnamese(name).includes(sidebarState.searchInput.toLowerCase().trim())
        }
        )
    }


    const handleClickMore = (index) => {
        if (index < 0) return;
        if (moreRefs[index].current.style.display !== 'flex')
            moreRefs[index].current.style.display = 'flex';
        else
            moreRefs[index].current.style.display = 'none'
    }

    const handleToProfile = (chat) => {
        navigate(routes.private.toProfile(chat.id))
    }

    const handleToGroupDetail = (chat) => {
        navigate(routes.private.toGroupDetail(chat.conversationId))
    }
    
    const handleRemoveChat = (chat) => {
        const deleteConversation = () => {
            axios.delete(api.deleteConversation(chat.conversationId))
                .then(response => {
                    if (response.statusText === 'OK') {
                        sidebarDispatch(actions.deleteChat(chat.conversationId))
                        navigate(routes.private.home, { replace: true });
                        closeConfirmModal()
                    }
                }).catch(err => {
                    console.log(err)
                    toast.error('Cannot delete chat!')
                })
        }

        confirmModal_init(`Delete chat`, `Do you wanna delete chat: ${chat.name}?`, deleteConversation);
        openConfirmModal()
    }

    const inbox = (chat) => {
        navigate(routes.private.toInbox(chat.id))
    }

    const handleClickInbox = (chat) => {
        if (chat.id === id) return;
        inbox(chat)
    }

    return (
        <div className={[cx('container'), className].join(' ')}>
            <Input
                className={cx('search')}
                placeholder="Search your friends chat"
                RightIcon={<SearchIcon className={cx('input-search-icon')} />}
                onChange={(event) => sidebarDispatch(actions.changeInputSearch(event.target.value))}
                value={sidebarState.searchInput}
            />
            <div className={cx('options')}>
                <Button
                    className={cx('btn-create-group')}
                    LeftIcon={<PlusIcon />}
                    onClick={() => navigate(routes.private.group_create)}
                >Create group</Button>
                <Link className={cx('btn-find-new-friends')} to={routes.private.friends}>Find new friends</Link>
            </div>


            <div className={cx('list-chats')}>
                {
                    sidebarState.chats.length > 0 ?
                        filterUsers(sidebarState.chats).map((chat, index) => {
                            const isInbox =
                                chat.conversationType === 'private' ?
                                    chat.users[0].id === id
                                    :
                                    chat.conversationId === id

                            const data = convertToPreviewChat(chat);

                            return (
                                <div key={index} className={cx('chat-item')}>
                                    <div className={cx('main', { inbox: isInbox })}>
                                        <UserItem
                                            className={cx('user')}
                                            data={data}
                                            onClick={(e) => {
                                                if(!e.target.classList.contains(cx('more-actions')))
                                                    handleClickInbox(data)
                                            }}
                                            More={<More className={cx('more-actions')} onClick={() => handleClickMore(index)} />}
                                        />
                                    </div>
                                    {
                                        <div className={cx('detail-more-actions')} ref={moreRefs[index]}>
                                            <Button
                                                className={cx('item')}
                                                onClick={() => {
                                                    if(data.conversationType === 'private') {
                                                        handleToProfile(data)
                                                    } else {
                                                        handleToGroupDetail(data)
                                                    }
                                                }}
                                            >
                                                {data.conversationType === 'private' ? 'View profile' : 'Group detail'}
                                            </Button>
                                            <Button className={cx('item')} onClick={() => handleRemoveChat(data)}>Remove chat</Button>
                                        </div>
                                    }
                                </div>
                            )
                        })
                        :
                        <span className={cx('no-chats')}>No chats yet!</span>
                }
            </div>
        </div>
    );
}

export default Sidebar;