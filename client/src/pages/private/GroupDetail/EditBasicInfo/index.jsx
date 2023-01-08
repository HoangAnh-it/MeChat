import React from 'react';
import { useParams } from 'react-router-dom';
import Image from '~/components/Image';

import api from '~/config/api';
import { useAxios } from '~/hooks';
import style from './style.module.scss';
import ClassNames from '~/utils/classNames';
import { Button } from '@mui/material';
import { toast } from 'react-toastify';
import { uploadToFirebase } from '~/utils/firebase';
const cx = ClassNames(style);

function EditBasic({ avatar, name, close, closeSuccess }) {
    const { id } = useParams()
    const [avatarUpdated, setAvatarUpdated] = React.useState({ base64: avatar, content: '' });
    const [nameUpdated, setNameUpdated] = React.useState(name);
    const axios = useAxios()

    const handlePreviewMedia = (event) => {
        if (event.target.files && event.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setAvatarUpdated({
                    content: event.target.files[0],
                    base64: e.target.result,
                })
                event.target.value = ''
            }
            reader.readAsDataURL(event.target.files[0])
        }
    }

    const handleUpdate = async () => {
        if (nameUpdated.trim() === name && avatarUpdated.content === '') {
            toast.warning('Nothing changes yet!');
            return
        }

        const data = { name: nameUpdated.trim() };
        if (avatarUpdated.content) {
            data.avatar = (await uploadToFirebase([avatarUpdated.content]))[0]
        }

        axios.patch(api.updateConversation(id), data)
            .then(response => {
                if (response.statusText === 'OK') {
                    toast.success('Update successfully!')
                    closeSuccess(prev => ({
                        ...prev,
                        ...response.data
                    }));
                    close()
                }
            }).catch(error => {
                console.log(error)
                toast.error('Cannot update!');
            })
    }

    return (
        <div id="modal">
            <div className={cx('container')}>
                <label className={cx('avatar')} htmlFor="avatar-group">
                    <Image src={avatarUpdated.base64} />
                </label>
                <input
                    id="avatar-group"
                    type="file"
                    style={{ display: 'none' }}
                    onChange={handlePreviewMedia}
                />

                <div className={cx('basic-info')}>
                    <input
                        className={cx('name')}
                        type="text"
                        value={nameUpdated}
                        onChange={(e) => {
                            setNameUpdated(e.target.value)
                        }}
                    />
                </div>

                <div className={cx('actions')}>
                    <Button
                        variant='outlined'
                        className={cx('btn')}
                        onClick={() => {
                            close()
                        }}
                    >Cancel</Button>

                    <Button
                        variant='contained'
                        className={cx('btn')}
                        onClick={handleUpdate}
                    >Update</Button>
                </div>
            </div>
        </div>
    );
}

export default EditBasic;