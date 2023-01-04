import {forwardRef} from 'react'
import PropTypes from 'prop-types';
import style from './style.module.scss';
import ClassNames from '~/utils/classNames';
const cx = ClassNames(style);

function Input(props, ref) {
    const { className, LeftIcon, RightIcon, type, style, ...rest } = props;
    
    return (
        <div className={[cx('container'), className].join(' ')} style={style}>
            {
                LeftIcon && <span className={cx('icon', 'left')}>{LeftIcon}</span>
            }

            <input type={type} {...rest} ref={ref}/>
            
            {
                RightIcon && <span className={cx('icon', 'right')}>{RightIcon}</span>
            }
        </div>
    );
}

export default forwardRef(Input);

Input.propTypes = {
    className: PropTypes.string,
    LeftIcon: PropTypes.element,
    RightIcon: PropTypes.element,
    type: PropTypes.string
}

Input.defaultProps = {
    type: 'text'
}