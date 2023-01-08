import React from 'react';
import IMAGE_DEFAULT from '~/assets/images/image_user_default.jpg';
import Image from '~/components/Image';
import { useAuth } from '~/hooks';
import { toast } from 'react-toastify';

import style from './style.module.scss';
import ClassNames from '~/utils/classNames';
import { TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Loading from '~/components/Loading'
import UserItem from '~/components/UserItem';
import Button from '~/components/Button';
import { CloseIcon, SearchIcon } from '~/components/Icon';
import { useAxios } from '~/hooks';
import api from '~/config/api';
import { reducer, initialState, actions } from '~/store/CreateGroupForm'
import {uploadToFirebase} from '~/utils/firebase';
const cx = ClassNames(style);

const LIMIT_USER = 5;

function CreateGroupForm() {
    const [state, dispatch] = React.useReducer(reducer, initialState);
    const [loading, setLoading] = React.useState(false)
    const [loadingCreation, setLoadingCreation] = React.useState(false)
    const [hasMoreData, setHasMoreData] = React.useState(true)
    const [auth] = useAuth();
    const input = React.useRef()
    const axios = useAxios();

    const fetchUser = (skip, inserted = false) => {
        setLoading(true)
        if (!inserted) {
            setHasMoreData(true)
        }

        axios.get(api.findFriends(state.search.trim(), {
            limit: LIMIT_USER,
            skip: skip
        }))
            .then(res => {
                if (res.statusText === 'OK') {
                    const data = res.data.filter(user => user.id !== auth.user.id);
                    setTimeout(() => {
                        if (data.length === 0) {
                            setHasMoreData(false);
                        }
                        if (!inserted) {
                            dispatch(actions.addFoundUsers(data))
                        } else {
                            dispatch(actions.insertFoundUsers(data))
                        }
                        setLoading(false)
                    }, 1000);
                }
            }).catch(err => {
                console.log(err)
                toast.error('Cannot find...')
                setLoading(false)
            })
    }

    const handlePreviewMedia = () => {
        if (input.current.files && input.current.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                dispatch(actions.changeAvatar({
                    content: input.current.files[0],
                    base64: e.target.result,
                }))
            }
            reader.readAsDataURL(input.current.files[0])
        }
    }

    const handleCreateGroup = async () => {
        if (!state.conversation.name.trim()) {
            return toast.error('Name must be not empty!')
        }
        
        if (state.conversation.members.length < 2) {
            return toast.error('Group must have at least 3 members including admin.')
        }
        setLoadingCreation(true)

        let avatar_url = '';
        try {
            avatar_url = await uploadToFirebase([state.conversation.avatar.content]);
        } catch (error) {
            console.log(error)
            setLoadingCreation(false)
            return toast.error('Cannot create group!');
        }

        axios.post(api.conversationCreation, {
            avatar: avatar_url[0],
            name: state.conversation.name,
            members: state.conversation.members.map(member => member.id)
        })
            .then(res => {
                if (res.statusText === 'OK') {
                    setLoadingCreation(false)
                    toast.success('Create successfully')
                }
            }).catch(err => {
                console.log(err)
                toast.error('Cannot create group!');
                setLoadingCreation(false)
            })
    }

    return (
        <div className={cx('container')}>
            <div className={cx('form')}>
                <div className={cx('left')}>
                    <h1 className={cx('title')}>Create your own group!</h1>
                    <div className={cx('general')}>
                        <label className={cx('avatar')} htmlFor="avatar-group">
                            <Image src={state.conversation.avatar.base64 || IMAGE_DEFAULT} />
                        </label>
                        <input
                            ref={input}
                            id="avatar-group"
                            type="file"
                            style={{ display: 'none' }}
                            onChange={handlePreviewMedia}
                        />
                        <TextField
                            className={cx('name')}
                            fullWidth
                            label="Name group"
                            onChange={e => dispatch(actions.changeNameGroup(e.target.value))}
                            value={state.conversation.name}
                        />
                    </div>
                    <div className={cx('members')}>
                        <div className={cx('admin')}>
                            <span className={cx('title')}>Admin</span>
                            <UserItem data={{
                                id: auth.user.id,
                                name: `${auth.user.firstName} ${auth.user.lastName}`,
                                avatar: auth.user.avatar
                            }}
                                className={cx('user')}
                                More={<span className={cx('admin-more')}>You</span>}
                            />
                        </div>
                        <div className={cx('others')}>
                            <div className={cx('controller')}>
                                <span className={cx('title')}>Add members</span>
                                <TextField
                                    className={cx('add-members')}
                                    fullWidth
                                    label="Find more (Name, phone, email)"
                                    onChange={e => dispatch(actions.changeSearch(e.target.value))}
                                    value={state.search}
                                />
                                <SearchIcon className={cx('search-icon')} onClick={() => {
                                    if (state.search.trim()) {
                                        fetchUser(0, false)
                                    }
                                }} />
                            </div>
                            <div className={cx('list-found')}>
                                {
                                    loading ?
                                        <Loading className={cx('loading')} />
                                        :
                                        state.usersFound.map((user, index) => {
                                            const added = state.conversation.members.some(member => member.id === user.id);

                                            return (
                                                <UserItem data={{
                                                    id: user.id,
                                                    name: user.name,
                                                    avatar: user.avatar,
                                                    intro: `${user.email} - ${user.phoneNumber}`
                                                }}
                                                    key={`found-${user.id}-index-${index}`}
                                                    className={cx('item')}
                                                    More={
                                                        <Button
                                                            className={cx('btn-add')}
                                                            onClick={() => {
                                                                if (added) {
                                                                    dispatch(actions.removeMember(user))
                                                                } else {
                                                                    dispatch(actions.addMember(user))
                                                                }
                                                            }}
                                                        >
                                                            {added ? '- Remove' : '+ Add'}
                                                        </Button>}
                                                />
                                            )
                                        })
                                }

                                {
                                    hasMoreData && state.usersFound.length > 0 && state.usersFound.length % LIMIT_USER === 0 &&
                                    <Button className={cx('btn-load-more')}
                                        onClick={() => fetchUser(state.usersFound.length, true)}
                                    >Load more</Button>
                                }
                            </div>
                        </div>
                    </div>
                </div>

                <div className={cx('right')}>
                    <div className={cx('all-members')}>
                        <span className={cx('title')}>{state.conversation.members.length} members</span>
                        
                        <div className={cx('list-members')}>
                            {
                                state.conversation.members.map((user, index) => {
                                    return (
                                        <UserItem data={{
                                            id: user.id,
                                            name: user.name,
                                            avatar: user.avatar,
                                            intro: `${user.email} - ${user.phoneNumber}`
                                        }}
                                            key={`members-${user.id}-index-${index}`}
                                            className={cx('item')}
                                            More={<Button
                                                LeftIcon={<CloseIcon />}
                                                className={cx('btn-remove')}
                                                onClick={() => dispatch(actions.removeMember(user))}
                                            >Remove</Button>}
                                        />
                                    )
                                })
                            }
                        </div>
                    </div>
                        
                    <LoadingButton
                        className={cx('btn-create')}
                        loading={loadingCreation}
                        variant="contained"
                        onClick={handleCreateGroup}
                    >Create</LoadingButton>
                </div>
            </div>
        </div>
    );
}

export default CreateGroupForm;