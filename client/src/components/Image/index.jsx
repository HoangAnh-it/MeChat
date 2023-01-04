import { useState, useEffect, forwardRef, Fragment } from 'react';
import PropTypes from 'prop-types';

import style from './style.module.scss';
import ClassNames from '~/utils/classNames';
import DEFAULT_IMAGE from '~/assets/images/image_user_default.jpg';
import Loading from '../Loading';

const cx = ClassNames(style);

function Image({
    src,
    alt = 'Image',
    fallback,
    className,
    icon = {placement: 'center', Icon: []},
    loading,
    ...rest
}, ref) {
    const [source, setSource] = useState(src || DEFAULT_IMAGE);
    const { placement, Icon } = icon;
    const [isLoading, setLoading] = useState(loading || false)

    useEffect(() => {
        setSource(src || DEFAULT_IMAGE);
    }, [src])
    
    const handleOnError = () => {
        // setSource(fallback || DEFAULT_IMAGE);
    }
    
    return (
        <div
            className={[className, cx('container')].join(' ')}
        >
            {
                loading ?
                    <Loading />
                    :
                    <>
                        <img
                            src={source}
                            alt={alt || 'no-image'}
                            onError={handleOnError}
                            ref={ref}
                            {...rest}
                        />
                        {
                            Icon.length > 0 &&
                            <div className={cx('icon', { [placement ?? 'center']: true })}>
                                {
                                    Icon.map((IconItem, index) => <div key={index}>{IconItem}</div>)
                                }
                            </div>
                        }
                    </>
            }
        </div>
    );
}

export default forwardRef(Image);

Image.prototype = {
    src: PropTypes.string,
    alt: PropTypes.string,
    fallback: PropTypes.func,
    className: PropTypes.string,
    icon: {
        placement: PropTypes.string,
        Icon: PropTypes.arrayOf(PropTypes.element)
    },
    loading: PropTypes.bool,
};