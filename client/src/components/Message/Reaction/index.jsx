import style from './style.module.scss';
import ClassNames from '~/utils/classNames';
import { useEffect, useState } from 'react';
import DetailReactionModal from './DetailReactionModal';

const cx = ClassNames(style);

function Reaction({ className, data, message }, ref) {
    const [content, setContent] = useState('');
    const [showDetailModal, setShowDetailModal] = useState(false);

    useEffect(() => {
        const object = {};
        data.forEach(react => {
            if (!object[react.emoji]) {
                object[react.emoji] = 0;
            } else {
                object[react.emoji]++;
            }
        })

        setContent(`${Object.keys(object).map(k => k).join('')}`);
    }, [data])
    
    const rest = data.length - content.split('').length + 1;
    
    return ( 
        <div className={[cx('container'), className].join(' ')}>
            <div className={cx('content')} onClick={() => setShowDetailModal(true)}>
                {content}
                {
                    rest > 0 &&
                    <span className={cx('brief')}>+{rest}</span>
                }
            </div>

            {
                showDetailModal &&
                <DetailReactionModal data={data} message={message} close={() => setShowDetailModal(false)} />
            }
        </div>
     );
}

export default Reaction;