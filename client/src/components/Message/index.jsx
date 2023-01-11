import { useState, forwardRef, useEffect } from 'react';
import Tippy from '@tippyjs/react';
import moment from 'moment';

import style from './style.module.scss';
import ClassNames from '~/utils/classNames';
import Image from '../Image';
import Video from '../Video';
import { isLink } from '~/utils/linkRegex';
import Actions from './Actions';
import { useAuth, useSocket } from '~/hooks';
import Text from '../Text';
import Reaction from './Reaction';

const cx = ClassNames(style);

function Message(props, ref) {
    const { className, data, members, isAvatarShown, loading } = props;
    const [isLoading, setLoading] = useState(loading || false)
    const [auth] = useAuth();

    const isYours = data.from === auth.user.id ? true : false;
    const isUnsent = !!data.deletedAt
    const sentDateTime = moment(data.sentDateTime).format('DD/MM/YYYY HH:mm:ss');
    const deletedAt = data.deletedAt ? moment(data.deletedAt).format('DD/MM/YYYY HH:mm:ss') : null;
    
    const classes = cx('container', {
        [className]: className,
        isYours: isYours,
        isUnsent: isUnsent,
    })
    return (
        <div className={classes} ref={ref}>
            <Tippy
                placement='left'
                content={members.find(member => member.id === data.from)?.lastName}
            >
                <Image className={cx('user', { isAvatarShown: !!isAvatarShown })} />
            </Tippy>
            <Tippy
                placement={isYours ? 'left' : 'right'}
                content={!isUnsent ? `${sentDateTime}` : `sent ${sentDateTime}-unsent ${deletedAt}`}
            >
                <div className={cx('main')}>
                    <div className={cx('content')}>
                        {
                            !isUnsent ?
                                data.type === 'image' ?
                                    <Image className={cx('message_image')} classerror={cx('error_message')} src={data.content} loading={isLoading} />
                                    :
                                    data.type === 'video' ?
                                        <Video className={cx('message_video')} classerror={cx('error_message')} src={data.content} loading={isLoading} />
                                        :
                                        data.type === 'text' ?
                                            <Text loading={isLoading} loadingMessage="sending...">
                                                {
                                                    isLink(data.content) ?
                                                        <a className={cx('message_link')} href={data.content} target="_plank">{data.content}</a>
                                                        :
                                                        data.content
                                                }
                                            </Text>
                                            :
                                            data.type === 'announcement' ?
                                                <div className={cx('message_announcement')}>{data.content}</div>
                                                :
                                                <Text className={cx('error_message')}>Error message!!!</Text>
                                
                                :
                                <span className={cx('unsent_message')}>message was unsent</span>
                        }
                    </div>

                    {
                        data.reactions?.length > 0 &&
                        <Reaction className={cx('reactions')} data={data.reactions} message={data} />
                    }
                </div>
            </Tippy>

            {
                !isUnsent && data.type !== 'announcement' &&
                <Actions className={cx('actions')} isYours={isYours} messageId={data.id} />
            }
        </div>
    );
}

export default forwardRef(Message);