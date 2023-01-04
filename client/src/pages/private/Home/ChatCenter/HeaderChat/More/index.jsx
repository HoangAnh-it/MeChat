import { PhoneIcon, VideoIcon } from '~/components/Icon';

import style from './style.module.scss';
import ClassNames from '~/utils/classNames';
const cx = ClassNames(style);

function More() {
    return ( 
        <div className={cx('container')}>
            <VideoIcon className={cx('item')}/>
            <PhoneIcon className={cx('item')}/>
        </div>
     );
}

export default More;
