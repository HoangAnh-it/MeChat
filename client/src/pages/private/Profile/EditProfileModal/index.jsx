import {useReducer} from 'react'
import { reducer, initialState, actions } from '~/store/profile';

import style from './style.module.scss';
import ClassNames from '~/utils/classNames';
import { TextField, Button } from '@mui/material';
import {isObjectEqual, trimObject} from '~/utils/helpers'
import { toast } from 'react-toastify';

const cx = ClassNames(style);

function EditConfirmModal({ initState, close, save }) {
    const [state, dispatch] = useReducer(reducer, {...initState})

    const saveChange = () => {
        if (isObjectEqual(initState, state)) {
            toast.success('Do not have any changes yet!')
            return
        }
        save(trimObject(state));
    }

    return (
        <div id="modal">
            <div className={cx('container')}>
                <h1 className={cx('title')}>Edit Profile</h1>
                <div className={cx('content')}>
                    <TextField
                        className={cx('item')}
                        id="demo-helper-text-aligned"
                        label="Email"
                        value={state.email || ''}
                        onChange={(e) => {dispatch(actions.change('email', e.target.value))}}
                    />

                    <TextField
                        className={cx('item')}
                        id="demo-helper-text-aligned"
                        label="First name"
                        value={state.firstName || ''}
                        onChange={(e) => {dispatch(actions.change('firstName', e.target.value))}}
                    />

                    <TextField
                        className={cx('item')}
                        id="demo-helper-text-aligned"
                        label="Last name"
                        value={state.lastName || ''}
                        onChange={(e) => {dispatch(actions.change('lastName', e.target.value))}}
                    />

                    <TextField
                        className={cx('item')}
                        id="outlined-number"
                        label="Number"
                        type="number"
                        inputProps={{ min: 0 }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        value={state.phoneNumber || ''}
                        onChange={(e) => {dispatch(actions.change('phoneNumber', e.target.value))}}
                    />

                    <TextField
                        className={cx('item')}
                        id="demo-helper-text-aligned"
                        label="Intro"
                        value={state.intro || ''}
                        onChange={(e) => {dispatch(actions.change('intro', e.target.value))}}
                    />
                </div>

                <div className={cx('actions')}>
                    <Button
                        className={cx('btn')}
                        onClick={() => close()}
                    >Cancel</Button>

                    <Button
                        className={cx('btn')}
                        onClick={saveChange}
                    >Save</Button>
                </div>
            </div>
        </div>
    );
}

export default EditConfirmModal;