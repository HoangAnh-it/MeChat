import { Fragment } from 'react';
import PropTypes from 'prop-types';

import style from './style.module.scss';
import ClassNames from '~/utils/classNames';
import Image from '../Image';
const cx = ClassNames(style);

function UserItem({ className, More, data, onClick }) {
    return ( 
        <div className={[cx('container'), className].join(' ')} onClick={onClick}>
            <Image className={cx('avatar')} src={data.avatar} />

            <div className={cx('info')}>
                <div className={cx('name')}>{data.name}</div>

                <div className={cx('description')}>{data.intro || ''}</div>
            </div>

            <div className={cx('more')}>
                {More}
            </div>
        </div>
     );
}

UserItem.propTypes = {
    className: PropTypes.string,
    More: PropTypes.element,
    data: PropTypes.shape({
        avatar: PropTypes.string,
        name: PropTypes.string,
        intro: PropTypes.string,
    })
}

UserItem.defaultProps = {
    More: <Fragment></Fragment>
}

export default UserItem;