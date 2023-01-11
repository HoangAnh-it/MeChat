import { useState, useEffect, useReducer, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import Message from '~/components/Message';
import { reducer, initialState, actions as inboxActions } from '~/store/inbox';
import style from './style.module.scss';
import ClassNames from '~/utils/classNames';
import { useAxios, useSocket } from '~/hooks';
import Loading from '~/components/Loading';
import api from '~/config/api'
const cx = ClassNames(style);

const LIMIT_MESSAGE = 20;

function Inbox({ className, userChatting }) {
    const { id } = useParams()
    const [isNoData, setIsNoData] = useState(false)
    const [inboxState, inboxDispatch] = useReducer(reducer, initialState);
    const [loading, setLoading] = useState(false)
    const containerRef = useRef()
    const containerObserver = useRef()
    const firstMessageRef = useRef()
    const positionScrollBottom = useRef(0)
    const axios = useAxios()
    const [socket, socketEvents] = useSocket()

    const fetchData = (fromStart = false) => {
        if (Object.keys(userChatting).length === 0) return;
        if (!fromStart && isNoData) return;
        setLoading(true);
        axios.get(api.getMessages(userChatting.conversationId), {
            params: {
                limit: LIMIT_MESSAGE,
                skip: fromStart ? 0 : inboxState.messages.length
            }
        })
            .then((response) => {
                if (response.statusText === 'OK') {
                    if (response.data.length === 0) {
                        setIsNoData(true);
                        if (firstMessageRef.current) {
                            containerObserver.current.unobserve(firstMessageRef.current)
                        }
                    }
                    if (!fromStart) {
                        inboxDispatch(inboxActions.loadNewMessages(response.data.reverse()))
                    } else {
                        inboxDispatch(inboxActions.loadInitMessages(response.data.reverse()))
                    }
                        
                    setLoading(false)
                }
            })
            .catch(error => {
                console.log(error)
                setLoading(false)
                toast.error('Something went wrong with fetching messages!')
            })
    }

    useEffect(() => {
        if (id) {
            positionScrollBottom.current = 0;
            fetchData(true)
        }
    }, [userChatting.conversationId])

    useEffect(() => {
        const element = containerRef.current;
        if (positionScrollBottom.current <= 0) {
            element.scrollTop = element.scrollHeight - element.clientHeight;
        } else {
            element.scrollTop = element.scrollHeight - positionScrollBottom.current;
        }
    }, [inboxState.messages.length])
    
    useEffect(() => {
        if (inboxState.messages.length === 0 || isNoData) return;

        containerObserver.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                console.log('isIntersecting')
                positionScrollBottom.current = containerRef.current.scrollHeight - containerRef.current.scrollTop
                fetchData()
            }
        }, {
            threshold: 1.0
        })

        if (containerRef.current.scrollHeight > containerRef.current.clientHeight) {
            containerObserver.current.observe(firstMessageRef.current)
        }
        const firstMessageRefValue = firstMessageRef.current
        return () => {
            if (firstMessageRefValue) {
                containerObserver.current.unobserve(firstMessageRefValue)
            }
        }
    }, [inboxState.messages.length])

    useEffect(() => {
        const newMessageListener = ({ messages }) => {
            positionScrollBottom.current = 0;
            inboxDispatch(inboxActions.addMessages(messages))
        }

        const deleteMessageListener = (data) => {
            inboxDispatch(inboxActions.deleteMessage(data))
        }
        
        const reactMessageListener = (reaction) => {
            inboxDispatch(inboxActions.reactMessage(reaction))
        }
        
        const removeReactionListener = (data) => {
            inboxDispatch(inboxActions.removeReaction(data))
        }
        
        socket.on(socketEvents.REMOVE_REACTION, removeReactionListener)
        socket.on(socketEvents.NEW_MESSAGE, newMessageListener);
        socket.on(socketEvents.DELETE_MESSAGE, deleteMessageListener);
        socket.on(socketEvents.REACT_MESSAGE, reactMessageListener);
        
        return () => {
            socket.off(socketEvents.REMOVE_REACTION, removeReactionListener)
            socket.off(socketEvents.NEW_MESSAGE, newMessageListener);
            socket.off(socketEvents.DELETE_MESSAGE, deleteMessageListener);
            socket.off(socketEvents.REACT_MESSAGE, reactMessageListener);
        }
    }, [socket])

    return (
        <div className={[cx('container'), className].join(' ')}>
                {
                    loading && <Loading className={cx('loading')} />
                }
            <div className={cx('body')} ref={containerRef}>
                {
                    inboxState.messages.map((message, index, list) => {
                        let isAvatarShown = !(index < list.length - 1 && ( message.from === list[index + 1].from && list[index + 1].type !== 'announcement'))
                        const ref = index === 0 ? firstMessageRef : null;
                        return <Message
                            key={index}
                            data={message}
                            isAvatarShown={isAvatarShown}
                            ref={ref}
                            loading={false} 
                            members={userChatting.users}    
                        />
                    })
                }
            </div>
        </div>
    );
}

export default Inbox;