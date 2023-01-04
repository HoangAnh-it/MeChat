import { useState, useRef, useEffect } from 'react';
import {useNavigate} from 'react-router-dom'
import style from './style.module.scss';
import ClassNames from '~/utils/classNames';
import Image from '../Image';
import Button from '../Button';
import { UserIcon, LogoutIcon, NotificationIcon } from '~/components/Icon'
import { useClickOutside, useAuth, useAxios } from '~/hooks';
import routes from '~/config/routes';
import Text from '../Text';
import api from '~/config/api';
import { toast } from 'react-toastify';
const cx = ClassNames(style);

function Header() {
    const [isShownSubUser, setSubUser] = useState(false);
    const [auth] = useAuth()
    const userRef = useRef();
    const navigate = useNavigate();
    const axios = useAxios()

    useClickOutside(() => {
        isShownSubUser && setSubUser(false)
    }, [userRef.current], []);

    const handleClickSubUser = () => {
        setSubUser(!isShownSubUser)
    }

    const comeHome = () => {
        navigate(routes.private.home, { replace: true })
    }

    const handleToProfile = () => {
        setSubUser(false)
        navigate(routes.private.toProfile(auth.user.id))
    }

    const handleLogout = () => {
        axios.get(api.logout)
            .then(res => {
                if (res.statusText === 'OK') {
                    navigate(routes.public.login, { replace: true });
                }
            }).catch(err => {
                console.log(err)
                toast.error(err)
            })
    }

    return (
        <div className={cx("container")}>
            <Text className={cx('logo')} onClick={comeHome}>MeChat</Text>
            <div className={cx('empty')}></div>
            <div className={cx('actions')}>
                <NotificationIcon className={cx('item', 'noti')} />
            </div>
            
            <div className={cx('user')} ref={userRef}>
                <Image className={cx('avatar')} onClick={handleClickSubUser} src={auth.user.avatar} />
                {
                    isShownSubUser &&
                    <div className={cx("sub-user")}>
                        <Button
                            className={cx('item')}
                            LeftIcon=<UserIcon />
                            onClick={handleToProfile}
                        >
                            Profile</Button>
                    
                        <Button
                            className={cx('item')}
                            LeftIcon=<LogoutIcon />
                            onClick={handleLogout}
                        >Log out</Button>
                    </div>
                }
            </div>
        </div>
    );
}

export default Header;