import { useState, forwardRef, useRef } from 'react';
import EmojiPicker from 'emoji-picker-react';

import { emojiObject } from '~/assets/images/emoji';
import Image from '~/components/Image';
import style from './style.module.scss';
import ClassNames from '~/utils/classNames';
import { useClickOutside } from '~/hooks';

const cx = ClassNames(style);

function Emoji({
    className,
    fullEmoji,
    onEmojiClick,
    ...configEmojiPicker
}, ref) {
    const [showFullEmoji, setShowFullEmoji] = useState(fullEmoji || false);
    const full = useRef()
    const preview = useRef()
    
    const { handleOnClickEmoji, ...restConfig } = configEmojiPicker;

    useClickOutside(() => {
        if(preview) preview.current.style.display = 'flex';
        setShowFullEmoji(false)
    }, [ref?.current], [])

    const handleClickMoreEmoji = () => {
        setShowFullEmoji(true)
        preview.current.style.display = 'none';
    }

    const onEmojiChoose = (event, { type, emojiObject }) => {
        onEmojiClick(emojiObject)
    }

    return (
        <div className={[className, cx('emoji-container')].join(' ')} ref={ref} >
            <div className={cx('emoji-picker')} ref={full}>
                {
                    showFullEmoji &&
                    <EmojiPicker
                        width="300px"
                        height="400px"
                        lazyLoadEmojis
                        previewConfig={{
                            showPreview: false
                        }}
                        groupVisibility={{
                            flags: false,
                        }}
                        onEmojiClick={(emojiObject, event) => onEmojiChoose(event, { type: 'full', emojiObject: emojiObject })}
                        {...restConfig}
                    />
                }
            </div>
            {
                !fullEmoji &&
                <div className={cx('preview-emoji')} ref={preview}>
                    {
                        !showFullEmoji && Object.keys(emojiObject).map((emoji, index) => {
                            return (
                                <span key={index} className={cx('emoji', 'emoji-icon')} onClick={(event) => onEmojiChoose(event, { type: 'preview', emojiObject: { emoji: emojiObject[emoji].emoji } })}>
                                    <Image src={emojiObject[emoji].image} />
                                </span>
                            )
                        })
                    }
                    <span
                        className={['emoji__plus-icon', cx('more-emoji', 'emoji-icon')].join(' ')}
                        onClick={handleClickMoreEmoji}
                    >+</span>
                </div>
            }
        </div>
    );
}

export default forwardRef(Emoji);