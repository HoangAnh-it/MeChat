import { useState } from 'react';
import { MoreIcon } from '~/components/Icon';

import style from './style.module.scss';
import ClassNames from '~/utils/classNames';

const cx = ClassNames(style);

function More({ className, onClick }) {
    const [click, setClick] = useState(false);

    const handleClick = () => {
        onClick();
        setClick(!click);
    }

    const classes = cx('container', {
        [className]: !!className,
        click: click
    })
    
    return ( 
        <div className={classes} onClick={handleClick}>
            <MoreIcon className={cx("more-icon")} />
        </div>
     );
}

export default More;