import style from './style.module.scss';
import ClassNames from '~/utils/classNames';
import { Link } from 'react-router-dom';
import routes from '~/config/routes';
const cx = ClassNames(style);

function NotFound() {
    return ( 
        <div className={cx('container')}>
            <h1>
                <span className={cx('title')}>MeChat</span>, OOps
            </h1>
            <div>Page not found.</div>
            <div>
                Please go back to
                <Link className={cx('link')} to={routes.public.login}>log in</Link>
                page to continue!
            </div>
        </div>
     );
}

export default NotFound;