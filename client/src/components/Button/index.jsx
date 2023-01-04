import PropTypes from 'prop-types';
import style from './style.module.scss';
import ClassNames from '~/utils/classNames';
const cx = ClassNames(style);

function Button(props) {
    const { className, LeftIcon, RightIcon, primary, disable, children, ...rest } = props;

     const classes = cx('container', {
        [className]: className,
        primary,
        disable
    })

    return ( 
        <div className={classes} {...rest}>
            {
                LeftIcon && <span className={cx('icon','left')}>{LeftIcon}</span>
            }
            <div className={cx(`${className}__children`, 'children')}>
                {children}
            </div>
            {
                RightIcon && <span className={cx('icon','right')}>{RightIcon}</span>
            }
        </div>
     );
}

export default Button;

Button.propTypes = {
    className: PropTypes.string,
    LeftIcon: PropTypes.element,
    RightIcon: PropTypes.element,
    text: PropTypes.string,
}