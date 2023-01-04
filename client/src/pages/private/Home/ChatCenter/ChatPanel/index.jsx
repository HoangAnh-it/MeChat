import { toast } from 'react-toastify';
import { useState, useRef, useReducer } from 'react';
import { useParams } from 'react-router-dom';

import { EmojiIcon, MediaUploadIcon,CloseIcon  } from '~/components/Icon';
import { useClickOutside, useAxios, useSocket } from '~/hooks';
import style from './style.module.scss';
import ClassNames from '~/utils/classNames';
import Input from '~/components/Input';
import Emoji from '~/components/Emoji';
import { reducer, initialState, actions } from '~/store/chatCenter/chatPanel';
import Image from '~/components/Image';
import api from '~/config/api';
import { uploadToFirebase } from '~/utils/firebase';
import { getTypeFile } from '~/utils/fileExtension'
import Loading from '~/components/Loading';

const cx = ClassNames(style);

function ChatPanel({ className, conversation = { id: '', type: '' } }) {
    const {id} = useParams()
    const [state, dispatch] = useReducer(reducer, initialState);
    const [showEmoji, setShowEmoji] = useState(false);
    const iconEmojiRef = useRef()
    const emojiContainer = useRef()
    const input = useRef() // input medias
    const axios = useAxios()
    const [loading, setLoading] = useState(false)

    useClickOutside(() => {
        setShowEmoji(false);
    }, [iconEmojiRef.current], [emojiContainer.current])

    const openEmoji = () => {
        setShowEmoji(!showEmoji);
    }

    const onEmojiChoose = (emojiObject) => {
        dispatch(actions.changeMessage(state.message + emojiObject.emoji))
    }

    const handlePreviewMedia = () => {
        if (input.current.files && input.current.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                dispatch(actions.addMedia({
                    base64: e.target.result,
                    localPath: input.current.value,
                    content: input.current.files[0]
                }))
            }

            reader.readAsDataURL(input.current.files[0])
        }
    }

    const handleRemove1Media = (media) => {
        dispatch(actions.removeMedia(media.base64))
        if (media.localPath === input.current.value) {
            input.current.value = ''
        }
    }

    const createDataMessages = (data = { messageText: '', urls: [] }) => {
        const baseData = {
            sentDateTime: Date.now(),
        }
        const messages = [];
        const dataMessageText = !!data.messageText ? {
            content: data.messageText,
            type: 'text',
        } : {}
        const dataMessagesMedias = data.urls.map(dataUrl => ({
            content: dataUrl.url,
            type: dataUrl.type,
            ...baseData
        }))

        if (Object.keys(dataMessageText).length > 0) {
            messages.push({
                ...dataMessageText,
                ...baseData
            })
        }

        if (dataMessagesMedias.length > 0) {
            messages.push(...dataMessagesMedias)
        }

        return messages;
    }

    const postMessages = async (e) => {
        if (e.keyCode === 13) {
            setLoading(true);
            try {
                const urls = await uploadToFirebase(state.medias.map(media => media.content))
                const dataUrls = urls.map(url => ({
                    url: url,
                    type: getTypeFile(new URL(url).pathname)
                }))
                const dataMessages = createDataMessages({ messageText: state.message, urls: dataUrls });
                if (dataMessages.length === 0) return;
                axios.post(api.sendMessage(conversation.type, conversation.id, id), dataMessages)
                    .then(response => {
                        if (response.statusText === 'OK') {
                            setTimeout(() => {
                                dispatch(actions.resetValue())
                                setLoading(false)
                            }, 1000)
                        }
                    }).catch(error => {
                        console.log(error);
                        toast.error('Something went wrong when sending message!')
                    })
                    
                } catch (error) {
                    console.log(error)
                    setLoading(false)
                    toast.error('Something went wrong when sending message!')
            }
        }
    }

    return (
        <div className={[cx('container'), className].join(' ')}>
            {loading && <Loading className={cx('loading')} />}
            {
                state.medias.length > 0 &&
                <div className={cx('media-message-preview')}>
                    {
                        state.medias.map((media, index) =>
                            <Image
                                key={index}
                                className={cx('item')}
                                src={media.base64}
                                icon={{
                                    placement: 'top-right',
                                    Icon: [<CloseIcon onClick={() => handleRemove1Media(media)} />]
                                }}
                            />
                        )
                    }
                </div>
            }

            <div className={cx('main')}>
                <div className={cx('actions')}>
                    <label htmlFor="open-media"><MediaUploadIcon className={cx('icon')} /></label>
                    <input
                        ref={input}
                        id="open-media"
                        type="file"
                        // multiple="multiple"
                        style={{ display: 'none' }}
                        onChange={handlePreviewMedia}
                    />
                </div>
                <Input
                    className={cx('input')}
                    RightIcon={
                        <div ref={iconEmojiRef}>
                            <EmojiIcon className={cx('emoji-icon', 'icon')} onClick={openEmoji} />
                        </div>
                    }
                    placeholder="Abc"
                    onChange={(event) => {
                        if(loading) return
                        dispatch(actions.changeMessage(event.target.value))}
                    }
                    value={state.message}
                    onKeyDown={e => postMessages(e)}
                />
                <div ref={emojiContainer}>
                    {
                        showEmoji &&
                        <Emoji
                            className={cx('emoji')}
                            fullEmoji
                            onEmojiClick={onEmojiChoose}    
                        />
                    }
                </div>
            </div>
        </div>
    );
}

export default ChatPanel;