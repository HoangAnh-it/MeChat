import { useState,useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import Image from '~/components/Image';
import Button from '~/components/Button';
import { MessageIcon, PhoneIcon, VideoIcon, MailIcon, MoreIcon, PenIcon } from '~/components/Icon';
import { useClickOutside, useAxios, useAuth } from '~/hooks';
import api from '~/config/api';
import routes from '~/config/routes';
import style from './style.module.scss';
import ClassNames from '~/utils/classNames';
import EditConfirmModal from '~/pages/private/Profile/EditProfileModal';
const cx = ClassNames(style);

function Profile() {
    const { id } = useParams()
    const [user, setUser] = useState({})
    const [isShowFormEdit, setShowFormEdit] = useState(false);
    const [auth] = useAuth();
    const moreActions = useRef();
    const moreIconRef = useRef()
    const axios = useAxios()
    const navigate = useNavigate()

    useEffect(() => {
        if (id) {
            axios.get(api.getProfile(id))
                .then(response => {
                    if (response.statusText === 'OK') {
                        setUser(response.data)
                    }
                }).catch(error => {
                    console.log(error)
                    toast.error(error.response.data.message || 'Something went wrong!')
                })
        }
    }, [id])

    useClickOutside(() => {
        moreActions.current.style.visibility = 'hidden';
    }, [moreIconRef.current], [moreActions.current])

    const handleShowMoreActions = () => {
        if (moreActions.current.style.visibility === 'visible') {
            moreActions.current.style.visibility = 'hidden';
        } else {
            moreActions.current.style.visibility = 'visible';
        }
    }

    const handleToMessage = () => {
        navigate(routes.private.toInbox(user.id))
    }

    const openEditModal = () => {
        setShowFormEdit(true)
    }

    const closeEditModal = () => {
        setShowFormEdit(false)
    }

    const handleSaveEditProfile = (updatedData) => {
        axios.patch(api.updateProfile(auth.user.id), updatedData)
            .then(res => {
                if (res.statusText === 'OK') {
                    closeEditModal();
                    setUser(res.data)
                    toast.success('Update successfully!');
                }
        }).catch(err => {
            console.log(err)
            toast.error('Cannot update.');
        })
    }

    const isYours = auth.user.id === id;

    return (
        <div className={cx('container')}>
            <Image className={cx('avatar')} src={user.avatar} />

            <div className={cx('basic-info')}>
                <h1 className={cx('name')}>{user.firstName} {user.lastName}</h1>
            </div>

            {
                !isYours &&
                <div className={cx('actions')}>
                    <Button
                        className={cx('btn-action')}
                        primary
                        LeftIcon={<MessageIcon />}
                        onClick={handleToMessage}
                    >Message</Button>

                    {/* <Button
                        className={cx('btn-action')}
                        primary
                        LeftIcon={<PhoneIcon />}
                    >Phone</Button>

                    <Button
                        className={cx('btn-action')}
                        primary
                        LeftIcon={<VideoIcon />}
                    >Video</Button> */}
                </div>
            }

            <div className={cx('detail-info')}>
                <h1 className={cx('title')}>
                    <span>Intro</span>
                    <MoreIcon
                        className={cx('more-icon')}
                        onClick={handleShowMoreActions}
                        ref={moreIconRef}
                    />
                </h1>
                <span className={cx('description')}>{user.intro ?? ''}</span>
                <div className={cx('more-info')}>
                    <div className={cx('item')}>
                        <MailIcon className={cx('icon')} />
                        <span className={cx('content')}>{user.email}</span>
                        {/* {
                            !isYours &&
                            <Button primary className={cx('send-mail')}>Send mail</Button>
                        } */}
                    </div>

                    <div className={cx('item')}>
                        <PhoneIcon className={cx('icon')} />
                        <span className={cx('content')}>{user.phoneNumber}</span>
                    </div>
                </div>

                <div className={cx('more-actions')} ref={moreActions}>
                    {
                        isYours &&
                        <Button
                            className={cx('update', 'btn')}
                                LeftIcon={<PenIcon />}
                                onClick={openEditModal}
                        >Edit</Button>
                    }
                </div>
            </div>

            {
                isYours && isShowFormEdit && 
                <EditConfirmModal
                    close={closeEditModal}
                    save={handleSaveEditProfile}
                    initState={user}
                />
            }
        </div>
    );
}

export default Profile;