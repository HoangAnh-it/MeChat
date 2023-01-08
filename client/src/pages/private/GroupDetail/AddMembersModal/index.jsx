import React from 'react';
import { useParams } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import { toast } from 'react-toastify';

import Loading from '~/components/Loading'
import UserItem from '~/components/UserItem';
import api from '~/config/api'
import { useAxios, useAuth } from '~/hooks';
import { SearchIcon } from '~/components/Icon';
import style from './style.module.scss';
import ClassNames from '~/utils/classNames';
import { Button } from '@mui/material';
const cx = ClassNames(style);

const LIMIT_USER = 5;

function AddMembersModal({ close, members, closeSuccess }) {
    const {id} = useParams()
    const [search, setSearch] = React.useState('')
    const [users, setUsers] = React.useState([])
    const [chosenUser, setChosenUser] = React.useState([])
    const [loading, setLoading] = React.useState(false)
    const axios = useAxios()
    const [auth] = useAuth()

    const fetch = (skip, inserted = false) => {
        setLoading(true)

        if (inserted) {
            if (users.length % LIMIT_USER !== 0) {
                setLoading(false)
                return;
            }
        }

        axios.get(api.findFriends(search.trim(), {
            limit: LIMIT_USER,
            skip: skip,
            exclude: {id: members.map(member => member.id)}
        }))
            .then(res => {
                if (res.statusText === 'OK') {
                    const data = res.data.map(d => ({
                        id: d.id,
                        name: d.name,
                        avatar: d.avatar,
                        intro: `${d.email || '[no email]'} - ${d.phoneNumber || '[no phone]'}`
                    }))
                    setTimeout(() => {
                        if (!inserted) {
                            setUsers(data);
                        } else {
                            setUsers(u => ([
                                ...u,
                                ...data
                            ]))
                        }
                        setLoading(false)
                    }, 1200);
                }
            }).catch(err => {
                console.log(err)
                toast.error('Cannot find...')
                setLoading(false)
            })
    }

    const handleSearch = () => {
        if (!search) return;
        fetch(0)
    }

    const handleLoadMore = () => {
        fetch(users.length, true);
    }

    const handleChooseUser = (userId) => {
        if (chosenUser.includes(userId)) {
            setChosenUser(prev => prev.filter(id => id !== userId))
        } else {
            setChosenUser(prev => ([
                ...prev,
                userId
            ]))
        }
    }

    const handleDone = () => {
        axios.post(api.addUserToConversation(id), chosenUser)
            .then(response => {
                if (response.statusText === 'OK') {
                    toast.success("Add successfully!");
                    closeSuccess(prev => ({
                        ...prev,
                        users: [
                            ...prev.users,
                            ...response.data.map(d => ({
                                id: d.id,
                                avatar: d.avatar,
                                email: d.email,
                                phoneNumber: d.phoneNumber,
                                name: `${d.firstName} ${d.lastName}`
                            }))
                        ]
                    }))
                    close()
                }
            }).catch(error => {
                console.log(error)
                toast.error('Cannot add!')
            })
    }

    return (
        <div id="modal">
            <div className={cx('container')}>
                <div className={cx('title')}>Find more members</div>
                <FormControl
                    sx={{ m: 2 }}
                    variant="outlined"
                    className={cx('input')}
                    fullWidth
                >
                    <InputLabel
                        htmlFor="outlined-adornment-password"
                        className={cx('label')}
                    >Search (email, phone, name)</InputLabel>
                    <OutlinedInput
                        className={cx('content')}
                        id="outlined-adornment-password"
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                handleSearch()
                            }
                        }}
                        onChange={(e) => { setSearch(e.target.value) }}
                        value={search}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    edge="end"
                                    className={cx('icon-search')}
                                    onClick={handleSearch}
                                >
                                    <SearchIcon />
                                </IconButton>
                            </InputAdornment>
                        }
                        label="Password"
                    />
                </FormControl>
                 <div className={cx('list')}>
                    {
                        loading && <Loading className={cx('loading')} />
                    }
                    {
                            users.length > 0 ?
                                <>
                                    {
                                        users.map((user, index) => {
                                            return (
                                                <UserItem
                                                    key={`friends-${user.id}-index-${index}`}
                                                    className={cx('item', {
                                                        chosen: chosenUser.includes(user.id)
                                                    })}
                                                    data={user}
                                                    onClick={() => handleChooseUser(user.id)}
                                                />
                                            )
                                        })
                                    }
                                    {
                                        users.length % LIMIT_USER === 0 &&
                                    <Button
                                        className={cx('btn-load-more')}
                                            onClick={handleLoadMore}
                                            variant="contained"
                                        >Load more</Button>
                                    }
                                </>
                                :
                                <div className={cx('no-data')}>No data</div>
                    }
                </div>
                <div className={cx('instruction')}>User added has a black background!</div>
                <div className={cx('actions')}>
                    <Button
                        className={cx('btn')}
                        variant="outlined"
                        onClick={() => {
                            close()
                        }}
                    >cancel</Button>
            
                    <Button
                        className={cx('btn')}
                        variant="contained"
                        onClick={handleDone}
                    >Done</Button>
                </div>
            </div>
        </div>
    );
}

export default AddMembersModal;