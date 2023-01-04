import style from './style.module.scss';
import ClassNames from '~/utils/classNames';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import routes from '~/config/routes'
const cx = ClassNames(style);

function More({ user }) {
    const navigate = useNavigate()

    return ( 
        <div className={cx('container')}>
            <Button
                className={cx('btn')}
                variant="contained"
                onClick={() => navigate(routes.private.toProfile(user.id))}
            >Profile</Button>
            <Button
                className={cx('btn')}
                variant="contained"
                onClick={() => navigate(routes.private.toInbox(user.id))}
            >Message</Button>
        </div>
     );
}

export default More;