import { useReducer } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { UserIcon, LockIcon, GoogleIcon, FacebookIcon } from '~/components/Icon';
import style from './style.module.scss';
import ClassNames from '~/utils/classNames';
import Input from '~/components/Input';
import {reducer, initialState, actions } from '~/store/login';
import Button from '~/components/Button';
import { isEmail, isPhoneNumber, trimObject } from '~/utils/validator';
import { useAxios, useAuth } from '~/hooks';
import api from '~/config/api'
import routes from '~/config/routes';

const cx = ClassNames(style);

function Login() {
    const [state, dispatch] = useReducer(reducer, initialState);
    const axios = useAxios()
    const navigate = useNavigate()
    const [auth, authDispatch, authActions] = useAuth();

    const handleLogin = () => {
        const isUsernameValid = isEmail(state.username) || isPhoneNumber(state.username);
        const isPasswordValid = !!state.password;
        if (!isUsernameValid) {
            toast.error('Username is invalid');
            return;
        }

        if (!isPasswordValid) {
            toast.error('Password cannot be empty');
            return;
        }

        axios.post(api.login, trimObject(state))
            .then((response) => {
                if (response.statusText === 'OK') {
                    authDispatch(authActions.loggedIn(response.data))
                }
            }).then(() => {
                navigate(routes.private.home, { replace: true });
            })
            .catch(error => {
                console.log(error)
                toast.error(error.response?.data?.message || 'Cannot login. Something went wrong!');
            })
    }

    return (
        <div className={cx('container')}>
            <div className={cx('title')}>LOG IN FORM</div>

            <div className={cx('content')}>
                <Input
                    className={cx('input', 'input-username')}
                    type="email"
                    placeholder="Email or Phone"
                    LeftIcon={<UserIcon />}
                    value={state.username}
                    onChange={(event) => dispatch(actions.handleOnChangeUsername(event.target.value))}
                />
                
                <Input
                    className={cx('input')}
                    type="password"
                    placeholder="Password"
                    LeftIcon={<LockIcon />}
                    value={state.password}
                    onChange={(event) => dispatch(actions.handleOnChangePassword(event.target.value))}
                />

                <Link to="" className={cx("forgot-password")}>Forgot password?</Link>

                <Button
                    className={cx('btn-login')}
                    primary
                    onClick={handleLogin}
                >
                    LOG IN
                </Button>

                <div className={cx('login-more')}>
                    <h4 className={cx('title-more')}>Or login with</h4>
                    <div className={cx('options')}>
                        <Button
                            className={cx('google-login', 'icon')}
                            LeftIcon={<GoogleIcon/>}
                        >
                            Google
                        </Button>

                        <Button
                            className={cx('facebook-login', 'icon')}
                            LeftIcon={<FacebookIcon />}
                        >
                            Facebook
                        </Button>
                    </div>
                </div>

                <Link to="/signup" className={cx("dont-have")}>Not a member?</Link>
            </div>
        </div>
    );
}

export default Login;