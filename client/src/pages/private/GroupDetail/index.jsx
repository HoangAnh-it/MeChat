import { useState,useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button as ButtonMaterial } from '@mui/material';

import Image from '~/components/Image';
import Button from '~/components/Button';
import { MessageIcon, MoreIcon } from '~/components/Icon';
import { useClickOutside, useAxios, useAuth, useConfirmModal } from '~/hooks';
import api from '~/config/api';
import routes from '~/config/routes';
import style from './style.module.scss';
import ClassNames from '~/utils/classNames';
import UserItem from '~/components/UserItem';
import More from './More';
import EditBasic from './EditBasicInfo';
import AddMembersModal from './AddMembersModal';
const cx = ClassNames(style);

function GroupDetail() {
    const { id } = useParams()
    const [group, setGroup] = useState({})
    const [showEdit, setShowEdit] = useState(false)
    const [showAddMembersModal, setShowAddMembersModal] = useState(false)

    const [auth] = useAuth();
    const moreActions = useRef();
    const moreIconRef = useRef()
    const axios = useAxios()
    const navigate = useNavigate()
    const [confirmModal_init, openConfirmModal, closeConfirmModal] = useConfirmModal();

    useEffect(() => {
        if (id) {
            axios.get(api.conversationDetail(id))
                .then(response => {
                    if (response.statusText === 'OK') {
                        setGroup(response.data)
                    }
                }).catch(error => {
                    console.log(error)
                    toast.error('Something went wrong!')
                })
        }
    }, [id])

    useClickOutside(() => {
        moreActions.current.style.visibility = 'hidden';
    }, [moreIconRef.current], [moreActions.current])

    const handleToMessage = () => {
        navigate(routes.private.toInbox(group.id))
    }

    const handleDeleteConversation = () => {
        const deleteConversation = () => {
            axios.delete(api.deleteConversation(group.id))
                .then(response => {
                    if (response.statusText === 'OK') {
                        navigate(routes.private.group_create, { replace: true });
                        toast.success('Delete successfully!')
                        closeConfirmModal()
                    }
                }).catch(err => {
                    console.log(err)
                    toast.error('Cannot delete chat!')
                })
        }

        confirmModal_init(`Delete this group?`, `Do you sure to delete this group: ${group.name}?`, deleteConversation);
        openConfirmModal()
    }
    
    const isAdmin = group.admin === auth.user.id;
    return (
        <div className={cx('container')}>
            <Image className={cx('avatar')} src={group.avatar} />

            <div className={cx('basic-info')}>
                <h1 className={cx('name')}>{group.name}</h1>
            </div>

            {
                showEdit &&
                <EditBasic
                    avatar={group.avatar}
                    name={group.name} 
                    close={() => {
                        setShowEdit(false)
                    }}
                    closeSuccess={setGroup}
                />
            }

            {
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
                {
                    isAdmin &&
                    <h1 className={cx('title')}>
                            <ButtonMaterial
                                className={cx('edit-button')}
                                variant="contained"
                                onClick={() => setShowAddMembersModal(true)}
                            >+ Add</ButtonMaterial>
                            
                            <ButtonMaterial
                                className={cx('edit-button')}
                                variant="contained"
                                onClick={() => setShowEdit(true)}
                            >Edit</ButtonMaterial>
                            
                            <ButtonMaterial
                                className={cx('edit-button')}
                                variant="outlined"
                                onClick={handleDeleteConversation}
                            >Delete</ButtonMaterial>
                    </h1>
                }

                {
                    showAddMembersModal &&
                    <AddMembersModal
                        members= {group.users}
                        className={cx('AddMembersModal')}
                        close={() => {
                            setShowAddMembersModal(false)
                        }}
                        closeSuccess={setGroup}
                    />
                }

                <div className={cx('more-info')}>
                    <div className={cx('members')}>
                        <span className={cx('members-title')}>{group?.users?.length || 0} members</span>
                        <div className={cx('list')}>
                            {
                                group?.users?.map((user, index) => {

                                    return (
                                        <UserItem
                                            key={`members-${user.id}-index-${index}`}
                                            className={cx('item')}
                                            data={user}
                                            More={
                                                <>
                                                    {
                                                        group.admin === user.id &&
                                                        <span className={cx('admin')}>Admin</span>
                                                    }
                                                    {

                                                        user.id === auth.user.id ?
                                                            <span className={cx('you')}>You</span>
                                                            :
                                                            <More
                                                                members={group.users}
                                                                user={user}
                                                                isAdmin={isAdmin}
                                                                deleteSuccess={(id) => {
                                                                    setGroup(prev => ({
                                                                        ...prev,
                                                                        users: prev.users.filter(u => u.id !== id)
                                                                    }))
                                                                }}    
                                                            />
                                                    }
                                                </>
                                            }
                                        />
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GroupDetail;