import { useReducer, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { UserIcon, LockIcon, GoogleIcon, FacebookIcon, PenIcon } from '~/components/Icon';
import style from './style.module.scss';
import ClassNames from '~/utils/classNames';
import Input from '~/components/Input';
import {reducer, initialState, actions } from '~/store/signup';
import { isEmail, isPhoneNumber, isEmptyString, trimObject } from '~/utils/validator';
import { Button } from '@mui/material'
import {LoadingButton} from '@mui/lab'
import { useAxios } from '~/hooks';
import api from '~/config/api';
import routes from '~/config/routes';
const cx = ClassNames(style);

function Signup() {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [loading, setLoading] = useState(false)
    const axios = useAxios()
    const navigate = useNavigate()

    const handleSignUp = () => {
        const isUsernameValid = isEmail(state.username) || isPhoneNumber(state.username);
        const isEmptyStr = isEmptyString(state.password, state.rePassword, state.firstName, state.lastName);
        
        if (!isUsernameValid) {
            toast.error('Username is invalid');
            return;
        }

        if (isEmptyStr) {
            toast.error('All fields must be filled out.');
            return;
        }

        if (state.password.length < 8) {
            toast.error('Password must be at least 8 characters long.');
            return;
        }

        if (state.password !== state.rePassword) {
            toast.error('Retype Password does not match');
            return;
        }
        
        setLoading(true)
        axios.post(api.signup, trimObject(state))
            .then(response => {
                if (response.statusText === 'OK') {
                    toast.success(response.data.message)
                    navigate(routes.public.login, { replace: true });
                    setLoading(false)
                }
            })
            .catch(error => {
                setLoading(false)
                console.log(error)
                toast.error(error.response.data.message);
            })
    }

    return ( 
        <div className={cx('container')}>
            <div className={cx('title')}>SIGN UP FORM</div>

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
                    className={cx('input', 'input-firstName')}
                    type="text"
                    placeholder="First name"
                    LeftIcon={<PenIcon />}
                    value={state.firstName}
                    onChange={(event) => dispatch(actions.handleOnChangeFirstName(event.target.value))}
                />

                <Input
                    className={cx('input', 'input-lastName')}
                    type="text"
                    placeholder="Last name"
                    LeftIcon={<PenIcon />}
                    value={state.lastName}
                    onChange={(event) => dispatch(actions.handleOnChangeLastName(event.target.value))}
                />
                
                <Input
                    className={cx('input')}
                    type="password"
                    placeholder="Password"
                    LeftIcon={<LockIcon />}
                    value={state.password}
                    onChange={(event) => dispatch(actions.handleOnChangePassword(event.target.value))}
                />

                <Input
                    className={cx('input')}
                    type="password"
                    placeholder="Retype Password"
                    LeftIcon={<LockIcon />}
                    value={state.rePassword}
                    onChange={(event) => dispatch(actions.handleOnChangeRePassword(event.target.value))}
                />

                <LoadingButton
                    className={cx('btn-signup')}
                    onClick={handleSignUp}
                    variant="contained"
                    loading={loading}
                >
                    SIGN UP
                </LoadingButton>


                <div className={cx('signup-more')}>
                    <h4 className={cx('title-more')}>Or sign up with</h4>
                    <div className={cx('options')}>
                        <Button
                            className={[cx('google-login', 'icon'), 'disabled'].join(' ')}
                            startIcon={<GoogleIcon />}
                            variant="outlined"
                            disabled
                        >
                            Google
                        </Button>

                        <Button
                            className={[cx('facebook-login', 'icon'), 'disabled'].join(' ')}
                            startIcon={<FacebookIcon />}
                            variant="outlined"
                            disabled
                        >
                            Facebook
                        </Button>
                    </div>
                </div>

                <Link to="/login" className={cx("already-have")}>Already a member?</Link>
            </div>
        </div>
     );
}

export default Signup;