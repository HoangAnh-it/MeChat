import {useState} from 'react'

import style from './style.module.scss';
import ClassNames from '~/utils/classNames';

const cx = ClassNames(style);

function Text(props) {
    const {className,onClick, loading, loadingMessage, children} = props;
    const [isLoading, setLoading] = useState(loading || false);

    return (
        <div className={[cx('container'), className].join(' ')} onClick={onClick}>
            {children}
            {
                isLoading && <span className={cx('loading_message')}>{loadingMessage}</span>
            }
        </div>
    );
}

export default Text;