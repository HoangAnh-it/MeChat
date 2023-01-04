import style from './style.module.scss';
import ClassNames from '~/utils/classNames';

const cx = ClassNames(style);

function Loading({className}) {
    return ( 
        <div className={[cx('container'), className].join(' ')}>
            <div className={cx('circle')}></div>
        </div>
     );
}

export default Loading;