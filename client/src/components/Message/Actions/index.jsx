import { useState, useRef } from 'react';
import { toast } from 'react-toastify';
import { EmojiIcon, MoreIcon } from '~/components/Icon';
import Emoji from '~/components/Emoji';
import { useClickOutside, useAxios } from '~/hooks';
import api from '~/config/api';

import style from './style.module.scss';
import ClassNames from '~/utils/classNames';
const cx = ClassNames(style);

function Actions({ className, isYours, messageId }) {
    const [persistent, setPersistent] = useState(false);
    const containerRef = useRef()
    const emojiIconRef = useRef()
    const emojiChildrenRef = useRef()
    const moreIconRef = useRef()
    const moreRef = useRef()
    const axios = useAxios()

    useClickOutside(() => {
        setPersistent(false)
        emojiChildrenRef.current.style.visibility = 'hidden';
        moreRef.current.style.visibility = 'hidden';
    }, [containerRef.current])
    
    useClickOutside(() => {
        emojiChildrenRef.current.style.visibility = 'hidden';
    }, [emojiIconRef.current], [emojiChildrenRef.current])
    
    useClickOutside(() => {
        moreRef.current.style.visibility = 'hidden';
    }, [moreIconRef.current], [ moreRef.current])

    const handleShowFullEmoji = () => {
        if (['hidden', ''].includes(emojiChildrenRef.current.style.visibility)) {
            emojiChildrenRef.current.style.visibility = 'visible';
            setPersistent(true)
        } else {
            setPersistent(false)
            emojiChildrenRef.current.style.visibility = 'hidden';
        }
    }
    
    const handleOpenMore = () => {
        if (['hidden', ''].includes(moreRef.current.style.visibility)) {
            setPersistent(true)
            moreRef.current.style.visibility = 'visible';
        } else {
            setPersistent(false)
            moreRef.current.style.visibility = 'hidden';
        }
    }

    const deleteMessage = () => {
        axios.delete(api.deleteMessage(messageId))
            .then(res => {
                if (res.statusText === 'OK') {
                }
            }).catch(err => {
                console.log(err)
                toast.err('Cannot delete this message!')
            })
    }

    const handleReactMessage = (emojiObject) => {
        axios.post(api.reactMessage(messageId), {emoji: emojiObject.emoji})
            .then(res => {
                if (res.statusText === 'OK') {
                    emojiChildrenRef.current.style.visibility = 'hidden';
                }
            }).catch(err => {
                console.log(err)
                toast.error('Something went wrong when reacting.')
            })
    }

    const classes = cx('container', {
        [className]: !!className,
        isYours: isYours,
        persistent: persistent
    })

    return (
        <div className={classes} ref={containerRef}>
            <EmojiIcon className={cx('item')} onClick={handleShowFullEmoji} ref={emojiIconRef} />
            <MoreIcon className={cx('item')} onClick={handleOpenMore} ref={moreIconRef} />
            <div className={cx('more')} ref={moreRef}>
                {
                    isYours &&
                    <span
                        className={cx('btn', 'btn-delete')}
                        onClick={deleteMessage}
                    >Delete</span>
                }
            </div>
            <Emoji
                className={cx('emoji-container')}
                ref={emojiChildrenRef}
                onEmojiClick={handleReactMessage}
            /> {/* set to be hidden*/}
        </div>
    );
}

export default Actions;